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

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
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
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);
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
    if (error instanceof AppwriteException) {
      console.error("An error occurred while retrieving user details:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument.get("blobFile") as Blob,
        identificationDocument.get("fileName") as string
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
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    if (error instanceof AppwriteException) {
      console.error("An error occurred while creating a new patient:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    if (error instanceof AppwriteException) {
      console.error("An error occurred while retrieving the patient details:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
