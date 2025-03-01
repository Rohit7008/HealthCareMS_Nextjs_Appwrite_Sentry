"use client";

import { useState, useEffect } from "react";
import { fetchPatientById } from "@/lib/api/fetchPatient";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Doctors } from "@/constants";
import { Appointment } from "@/types/appwrite.types";
import { AppointmentModal } from "@/components/AppointmentModal";

// Patient Cell Component
const PatientCell = ({ userId }: { userId: string }) => {
  const [patientName, setPatientName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchPatient = async () => {
      if (!userId) return;
      try {
        const patient = await fetchPatientById(userId);
        setPatientName(patient?.name ?? "N/A");
      } catch {
        setPatientName("N/A");
      }
    };
    fetchPatient();
  }, [userId]);

  return <p className="text-14-medium">{patientName}</p>;
};

// Table Columns Definition
export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <PatientCell userId={appointment.userId} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-medium">{appointment?.status ?? "Pending"}</p>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      const dateObj = appointment.schedule
        ? new Date(appointment.schedule)
        : new Date(NaN);
      const formattedDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "Invalid Date";
      return <p className="text-14-regular min-w-[100px]">{formattedDate}</p>;
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;
      const doctor = Doctors.find(
        (doc) => doc.name === appointment.primaryPhysician
      );
      return (
        <div className="flex items-center gap-3">
          {doctor ? (
            <>
              <Image
                src={doctor.image || "/assets/default-doctor.png"}
                alt="doctor"
                width={100}
                height={100}
                className="size-8 rounded-full"
              />
              <p className="whitespace-nowrap">Dr. {doctor.name}</p>
            </>
          ) : (
            <p className="text-gray-500">Unknown Doctor</p>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      const userId = appointment?.userId;

      if (!userId) {
        return <p className="text-gray-500">No Patient Data</p>;
      }

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={userId}
            userId={userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={userId}
            userId={userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];
