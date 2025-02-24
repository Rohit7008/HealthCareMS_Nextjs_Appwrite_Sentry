"use client"; // ✅ Required for Client Component

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getPatient, getUser } from "@/lib/actions/patient.actions";
import RegisterForm from "@/components/ui/forms/RegisterForm";

const Register = () => {
  const params = useParams();
  const userid = Array.isArray(params.userid)
    ? params.userid[0]
    : params.userid ?? ""; // ✅ Ensure string

  const [user, setUser] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userid) {
      setError("User ID is missing from URL parameters.");
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedUser = await getUser(userid);
        if (!fetchedUser) {
          setError("User not found.");
          return;
        }

        setUser(fetchedUser);

        const fetchedPatient = await getPatient(userid);
        setPatient(fetchedPatient);

        if (fetchedPatient) {
          redirect(`/patients/${userid}/new-appointment`);
        }
      } catch (err) {
        console.error("❌ Error fetching user or patient data:", err);
        setError("Error loading data. Please try again.");
      }
    };

    fetchData();
  }, [userid]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">© 2024 CarePulse</p>
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
