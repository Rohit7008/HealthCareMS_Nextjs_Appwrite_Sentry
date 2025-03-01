"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

interface UpdateAppointmentParams {
  appointmentId: string;
  userId: string;
  timeZone: string;
  appointment: Partial<Appointment>;
  type: "schedule" | "cancel" | "update"; // ✅ Add "update" if needed
  cancellationReason?: string; 
  status?: "pending" | "scheduled" | "cancelled"; // ✅ Add this field
}

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPOINTMENT
export const createAppointment = async (appointment: {
  userId: string;
  schedule: string;
  primaryPhysician?: string;
}) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      {
        userId: appointment.userId,
        schedule: appointment.schedule,
        status: "pending", // 🔒 Enforcing "pending" status
        primaryPhysician: appointment.primaryPhysician || "",
      }
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };
    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

//  SEND SMS NOTIFICATION
export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};

// UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
  cancellationReason,
}: UpdateAppointmentParams) => {
  try {
    console.log("🚀 Starting updateAppointment function...");

    console.log("📌 Debug: Received parameters ->", {
      appointmentId,
      userId,
      timeZone,
      appointment,
      type,
      cancellationReason,
    });

    if (!appointmentId) {
      throw new Error("❌ Missing appointmentId! Update cannot proceed.");
    }

    if (!DATABASE_ID || !APPOINTMENT_COLLECTION_ID) {
      throw new Error("❌ Missing database credentials!");
    }

    let newStatus = appointment.status ?? "pending";
    if (type === "cancel") newStatus = "cancelled";
    else if (type === "schedule") newStatus = "scheduled";
    else if (type === "update") newStatus = "scheduled"; // ✅ Explicitly update to "scheduled"

    console.log("🛠️ Debug: Computed new status ->", newStatus);

    // 🔥 Remove system fields before updating
    const { sanitizedAppointment } = appointment;

    const updateData: Partial<Appointment> = {
      ...sanitizedAppointment, // ✅ Only allowed fields
      status: newStatus, // 🔥 Ensure status is explicitly updated
      ...(cancellationReason && { cancellationReason }),
    };

    console.log("📝 Debug: Final update data ->", updateData);

    console.log("⏳ Sending request to Appwrite...");
    let updatedAppointment;

    try {
      updatedAppointment = await databases.updateDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        appointmentId,
        updateData
      );

      console.log("✅ Debug: Database response ->", updatedAppointment);

      // 🔍 Verify status update in the response
      if (updatedAppointment.status !== newStatus) {
        console.warn("⚠️ Status update mismatch! Expected:", newStatus, "but got:", updatedAppointment.status);
        throw new Error("❌ Status update failed!");
      }
    } catch (err: unknown) {
      console.error("🚨 Appwrite API Error:", err);
      throw new Error("❌ Failed to update the appointment.");
    }

    console.log("🔄 Revalidating path: /admin");
    revalidatePath("/admin");

    console.log("✅ Appointment updated successfully!");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("❌ Final Catch - Appointment API Error:", error);
    throw new Error("Unable to update the appointment. Please try again later.");
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing appointment:",
      error
    );
  }
};
