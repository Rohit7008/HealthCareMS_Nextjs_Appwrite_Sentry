import { databases } from "../appwrite.config";
import { Query } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded
export async function fetchPatientById(userId: string) {
  try {
    const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const PATIENT_COLLECTION_ID = process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID;


    // Debugging: Log environment variables
    console.log("DATABASE_ID:", DATABASE_ID);
    console.log("PATIENT_COLLECTION_ID:", PATIENT_COLLECTION_ID);

    // Ensure values exist
    if (!DATABASE_ID || !PATIENT_COLLECTION_ID) {
      throw new Error("❌ Missing database or collection ID");
    }

    // Query the database
    const response = await databases.listDocuments(DATABASE_ID, PATIENT_COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);

    if (response.documents.length === 0) {
      console.warn(`⚠️ No patient found for userId: ${userId}`);
      return null;
    }

    return response.documents[0]; // Return patient data
  } catch (error) {
    console.error("❌ Error fetching patient data:", error);
    return null;
  }
}
