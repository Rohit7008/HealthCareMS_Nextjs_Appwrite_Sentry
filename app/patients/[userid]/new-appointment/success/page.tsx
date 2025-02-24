"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { getAppointment, Appointment } from "@/lib/api"; // Import API function

const RequestSuccess = () => {
  const params = useParams();
  const userid = params.userid as string;
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId") || "";
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (appointmentId) {
      getAppointment(appointmentId)
        .then((data) => setAppointment(data))
        .catch((error) => console.error("Error fetching appointment:", error));
    }
  }, [appointmentId]);

  if (!appointment) {
    return <p>Loading...</p>;
  }

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details:</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image || "/assets/icons/doctor-placeholder.svg"}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name || "Unknown"}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>{formatDateTime(new Date(appointment.schedule), 'UTC').dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userid}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright">© 2024 CarePulse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
