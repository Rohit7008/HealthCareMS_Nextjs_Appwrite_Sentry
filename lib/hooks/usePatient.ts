import { useState, useEffect } from "react";
import { fetchPatientById } from "@/lib/api/fetchPatient";
import { Models } from "appwrite"; // Ensure this is the correct import for your Appwrite types

export function usePatient(userId: string) {
  const [patient, setPatient] = useState<{ name: string } | null>(null);

  useEffect(() => {
    async function getPatient() {
      if (!userId) return;
      
      const data: Models.Document | null = await fetchPatientById(userId);
      
      // Ensure `data` has a `name` property before updating state
      if (data && "name" in data) {
        setPatient({ name: data.name });  // ✅ Explicitly extract `name`
      } else {
        setPatient(null);
      }
    }

    getPatient();
  }, [userId]);

  return patient;
}
