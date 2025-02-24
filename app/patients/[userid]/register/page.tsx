"use client"; // ✅ Required for Client Component

import { useParams, redirect } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getPatient, getUser } from "@/lib/actions/patient.actions";
import RegisterForm from "@/components/ui/forms/RegisterForm";

// ✅ Define User and Patient types with required properties
interface User {
  $id: string; // Appwrite uses $id instead of id
  name: string;
  email: string;
  gender: "male" | "female" | "other"; // Restricts to valid gender values
  phone: string;
}

interface Patient {
  id: string;
  userId: string;
  status: string;
}

const Register = () => {
  const params = useParams();
  const userid = Array.isArray(params.userid)
    ? params.userid[0]
    : params.userid ?? ""; // ✅ Ensure string

  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userid) {
      setError("❌ User ID is missing from URL parameters.");
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedUser: User | null = await getUser(userid);
        if (!fetchedUser) {
          setError("❌ User not found.");
          return;
        }

        setUser(fetchedUser);

        const fetchedPatient: Patient | null = await getPatient(userid);
        if (fetchedPatient) {
          redirect(`/patients/${userid}/new-appointment`);
          return;
        }

        setPatient(fetchedPatient);
      } catch (err) {
        console.error("❌ Error fetching user or patient data:", err);
        setError("⚠️ Error loading data. Please try again.");
      }
    };

    fetchData();
  }, [userid]);

  if (error) {
    return <p className="text-red-500 font-semibold">{error}</p>;
  }

  if (!user) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12 text-gray-400">© 2024 CarePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
