"use server";

import { ID, Query, AppwriteException } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// Patient interface
interface Patient {
  $id: string;
  name: string;
  age?: number;
  userId: string;
  identificationDocumentId?: string | null;
  identificationDocumentUrl?: string | null;
}

// IdentificationDocument interface
interface IdentificationDocument {
  blobFile: Blob;
  fileName: string;
}

// CREATE USER
export const createUser = async (user: { email: string; phone: string; name: string }) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newUser);
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 409) {
      const existingUser = await users.list([Query.equal("email", [user.email])]);
      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
    throw error;
  }
};

// GET USER
export const getUser = async (userId?: string) => {
  if (!userId) {
    throw new Error("Missing required parameter: 'userId'");
  }

  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.error("Error retrieving user details:", error);
    throw error;
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: {
  identificationDocument?: IdentificationDocument;
  name: string;
  age?: number;
  userId: string;
}) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument.blobFile,
        identificationDocument.fileName
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("Error registering patient:", error);
    throw error;
  }
};

// GET PATIENT
export const getPatient = async (userId: string): Promise<Patient | null> => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    if (patients.documents.length === 0) {
      return null;
    }

    const patientData = patients.documents[0];

    // Map Appwrite document to Patient interface
    const patient: Patient = {
      $id: patientData.$id,
      name: patientData.name ?? "Unknown",
      age: patientData.age ?? undefined,
      userId: patientData.userId,
      identificationDocumentId: patientData.identificationDocumentId ?? null,
      identificationDocumentUrl: patientData.identificationDocumentUrl ?? null,
    };

    return patient;
  } catch (error) {
    console.error("Error retrieving patient details:", error);
    throw error;
  }
};
