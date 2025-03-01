"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

interface User {
  $id: string;
  name: string;
  email: string;
  gender: "male" | "female" | "other";
  phone: string;
}

const Register = () => {
  const params = useParams();
  const router = useRouter();
  const userid = Array.isArray(params.userid)
    ? params.userid[0]
    : params.userid ?? "";

  const [user, setUser] = useState<User | null>(null);
  const [isExistingPatient, setIsExistingPatient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userid) {
      setError("❌ User ID is missing from URL parameters.");
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedUser = await getUser(userid);
        if (!fetchedUser) {
          setError("❌ User not found.");
          return;
        }

        setUser({
          $id: fetchedUser.$id,
          name: fetchedUser.name,
          email: fetchedUser.email,
          phone: fetchedUser.phone,
          gender: (fetchedUser as Partial<User>).gender ?? "other",
        });

        const fetchedPatient = await getPatient(userid);
        if (fetchedPatient) {
          setIsExistingPatient(true);
        }
      } catch (err) {
        console.error("❌ Error fetching user or patient data:", err);
        setError("⚠️ Error loading data. Please try again.");
      }
    };

    fetchData();
  }, [userid]);

  useEffect(() => {
    if (isExistingPatient) {
      router.push(`/patients/${userid}/new-appointment`);
    }
  }, [isExistingPatient, userid, router]);

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
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {!isExistingPatient && <RegisterForm user={user} />}

          <p className="copyright py-12">© 2024 CarePluse</p>
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
