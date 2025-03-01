"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";
import { Appointment } from "@/types/appwrite.types";

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
  cancellationReason?: string;
}

const getAppointmentSchema = (type: "create" | "schedule" | "cancel") => {
  return z.object({
    primaryPhysician: z.string().min(1, "Doctor is required"),
    schedule: z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
    reason: z.string().optional(),
    note: z.string().optional(),
    cancellationReason:
      type === "cancel"
        ? z.string().min(1, "Cancellation reason is required")
        : z.string().optional(),
  });
};

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel" | "update";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation =
    type === "update"
      ? getAppointmentSchema("create")
      : getAppointmentSchema(type);

  const defaultValues = useMemo(
    () => ({
      primaryPhysician: appointment?.primaryPhysician || "",
      schedule: appointment?.schedule
        ? new Date(appointment.schedule)
        : new Date(),
      reason: appointment?.reason || "",
      note: appointment?.note || "",
      cancellationReason:
        type === "cancel" ? appointment?.cancellationReason || "" : undefined,
    }),
    [appointment, type]
  );

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues,
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
      schedule:
        appointment?.schedule &&
        !isNaN(new Date(appointment.schedule).getTime())
          ? new Date(appointment.schedule)
          : new Date(),
    });
  }, [appointment, form, defaultValues]);

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);
    try {
      if (type === "create" && patientId) {
        const newAppointment: CreateAppointmentParams = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule).toISOString(),
          reason: values.reason || "",
          status: "scheduled",
          note: values.note || "",
          phone: "1234567890",
          name: "John Doe",
        };

        const createdAppointment = await createAppointment(newAppointment);

        if (createdAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${
              createdAppointment.$id
            }&doctor=${encodeURIComponent(
              values.primaryPhysician
            )}&date=${encodeURIComponent(
              new Date(values.schedule).toISOString()
            )}`
          );
        }
      }

      if ((type === "update" || type === "schedule") && appointment) {
        await updateAppointment({
          appointmentId: appointment.$id,
          userId: userId,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          appointment: {
            ...appointment,
            schedule: new Date(values.schedule).toISOString(),
            status: type === "update" ? "scheduled" : appointment.status,
          },
          type: "update",
        });

        if (setOpen) setOpen(false);
      }

      if (type === "cancel" && appointment) {
        await updateAppointment({
          appointmentId: appointment.$id,
          userId,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          appointment: {
            ...appointment,
            status: "cancelled",
            cancellationReason:
              values.cancellationReason || "No reason provided",
          },
          type: "cancel",
        });

        if (setOpen) setOpen(false);
      }
    } catch (error) {
      console.error("❌ Appointment API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
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
              className={`flex flex-col gap-6  ${
                type === "create" && "xl:flex-row"
              }`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual montly check-up"
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
          {type === "cancel" ? "Cancel Appointment" : "Submit Appointment"}
        </SubmitButton>
      </form>
    </Form>
  );
};
