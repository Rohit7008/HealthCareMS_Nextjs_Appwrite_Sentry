"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";

interface CreateAppointmentParams {
  $id?: string;
  userId: string;
  patient: string;
  primaryPhysician?: string;
  schedule: string;
  status: string;
  reason?: string;
  note?: string;
  phone: string;
  name: string;
}

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);
  console.log("Appointment Schema:", AppointmentFormValidation);

  // ✅ Validate default values before form initialization
  const parsedDefaultValues = AppointmentFormValidation.safeParse(
    appointment
      ? {
          primaryPhysician: appointment.primaryPhysician || "",
          schedule: appointment.schedule
            ? new Date(appointment.schedule)
            : new Date(),
          reason: appointment.reason || "",
          note: appointment.note || "",
          cancellationReason: appointment.cancellationReason || "",
        }
      : {} // ✅ Ensures default empty object
  );

  if (!parsedDefaultValues.success) {
    console.error("Zod Validation Error:", parsedDefaultValues.error.format());
  }

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: parsedDefaultValues.success
      ? parsedDefaultValues.data
      : {
          primaryPhysician: "",
          schedule: new Date(),
          reason: "",
          note: "",
          cancellationReason: "",
        },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status: "pending" | "scheduled" | "cancelled";
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        // ✅ Creating a new appointment
        const newAppointment: CreateAppointmentParams = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule).toISOString(),
          reason: values.reason || "",
          status,
          note: values.note || "",
          phone: "1234567890", // Replace with actual value
          name: "John Doe",
        };

        const createdAppointment = await createAppointment(newAppointment);

        if (createdAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${createdAppointment.$id}`
          );
        }
      } else if (type === "schedule" || type === "cancel") {
        // ✅ Updating an existing appointment
        if (!appointment?.$id) {
          throw new Error("Appointment ID is missing.");
        }

        const appointmentToUpdate = {
          userId,
          appointmentId: appointment.$id,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule:
              values.schedule instanceof Date
                ? values.schedule
                : new Date(values.schedule),
            status,
            cancellationReason: values.cancellationReason || "",
          },
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          if (setOpen) {
            setOpen(false);
          }
          form.reset();
        }
      }
    } catch (error) {
      console.error("Appointment API Error:", error);
    }

    setIsLoading(false);
  };

  const buttonLabel =
    type === "cancel"
      ? "Cancel Appointment"
      : type === "schedule"
      ? "Schedule Appointment"
      : "Submit Appointment";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6 ${
                type === "create" && "xl:flex-row"
              }`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
