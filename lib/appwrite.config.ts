import * as sdk from "node-appwrite";
import * as dotenv from "dotenv";
dotenv.config();


export const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
export const PATIENT_COLLECTION_ID = process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID;
export const DOCTOR_COLLECTION_ID = process.env.NEXT_PUBLIC_DOCTOR_COLLECTION_ID;
export const APPOINTMENT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID;
export const BUCKET_ID = process.env.NEXT_PUBLIC_BUCKET_ID;



const client = new sdk.Client();

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

console.log("Project ID:", PROJECT_ID);
console.log("Endpoint:", ENDPOINT);
console.log("API Key:", API_KEY ? "Loaded" : "Not Found");
