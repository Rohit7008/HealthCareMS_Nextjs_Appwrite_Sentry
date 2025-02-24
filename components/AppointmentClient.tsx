"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppointmentForm } from "@/components/ui/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

interface Patient {
  $id: string;
  name: string;
  age?: number; // Optional property
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
        const documentData = await getPatient(userid); // Returns Document | null
        if (!documentData) {
          setError("Patient data not found");
          return;
        }

        // Ensure the documentData has required properties before assigning it to Patient
        const patientData: Patient = {
          $id: documentData.$id,
          name: documentData.name ?? "Unknown", // Ensure 'name' exists
          age: documentData.age ?? undefined, // Optional field
        };

        setPatient(patientData);
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
