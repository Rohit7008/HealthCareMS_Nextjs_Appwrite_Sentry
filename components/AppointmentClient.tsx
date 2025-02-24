"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppointmentForm } from "@/components/ui/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

interface Patient {
  $id: string;
  name: string;
  age?: number;
  // Add more patient properties if needed
}

const AppointmentClient = () => {
  const params = useParams();
  const userid: string = Array.isArray(params.userid)
    ? params.userid[0]
    : params.userid ?? ""; // ✅ Ensure string

  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userid) {
      setError("User ID is missing");
      return;
    }

    const fetchPatient = async () => {
      try {
        const patientData: Patient | null = await getPatient(userid);
        if (!patientData) {
          setError("Patient data not found");
        } else {
          setPatient(patientData);
        }
      } catch (err) {
        console.error("❌ Error fetching patient:", err);
        setError("Error loading patient data");
      }
    };

    fetchPatient();
  }, [userid]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!patient) {
    return <p>Loading patient data...</p>;
  }

  return (
    <AppointmentForm
      patientId={patient.$id} // ✅ No more TypeScript error
      userId={userid} // ✅ Always a string
      type="create"
    />
  );
};

export default AppointmentClient;
