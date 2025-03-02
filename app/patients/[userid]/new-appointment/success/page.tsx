"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getAppointment, Appointment } from "@/lib/api";

const RequestSuccessContent = () => {
  const params = useParams();
  const userid = params.userid as string;
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId") || "";

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointmentId) {
      getAppointment(appointmentId)
        .then((data) => {
          if (!data) throw new Error("No appointment data found.");
          setAppointment(data);
        })
        .catch((error) => {
          console.error("Error fetching appointment:", error);
          setError("Failed to load appointment details.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
        <Link href={`/patients/${userid}/new-appointment`}>
          <Button variant="outline">Try Again</Button>
        </Link>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No appointment details available.</p>
      </div>
    );
  }

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

const RequestSuccess = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequestSuccessContent />
    </Suspense>
  );
};

export default RequestSuccess;
