import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Updated function with explicit type
export const parseStringify = <T>(value: T): T | null => {
  if (value === undefined || value === null) {
    return null;
  }
  return JSON.parse(JSON.stringify(value)) as T;
};

export const convertFileToUrl = (file: File): string => URL.createObjectURL(file);

// FORMAT DATE TIME
export const formatDateTime = (schedule: Date | string | null) => {
  if (!schedule) {
    console.error("❌ Invalid Date: No schedule provided");
    return { dateTime: "Invalid Date", dateDay: "Invalid Date", dateOnly: "Invalid Date", timeOnly: "Invalid Time" };
  }

  let parsedDate: Date;

  if (typeof schedule === "string") {
    if (schedule.toLowerCase() === "utc") {
      console.error("❌ Invalid Date String: UTC");
      return { dateTime: "Invalid Date", dateDay: "Invalid Date", dateOnly: "Invalid Date", timeOnly: "Invalid Time" };
    }
    parsedDate = new Date(schedule);
  } else {
    parsedDate = schedule;
  }

  if (isNaN(parsedDate.getTime())) {
    console.error("❌ Invalid Date Format:", schedule);
    return { dateTime: "Invalid Date", dateDay: "Invalid Date", dateOnly: "Invalid Date", timeOnly: "Invalid Time" };
  }

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return {
    dateTime: parsedDate.toLocaleString("en-US", dateTimeOptions),
    dateDay: parsedDate.toLocaleString("en-US", { weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" }),
    dateOnly: parsedDate.toLocaleString("en-US", { month: "short", year: "numeric", day: "numeric" }),
    timeOnly: parsedDate.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
  };
};

export function encryptKey(passkey: string): string {
  return btoa(passkey);
}

export function decryptKey(passkey: string): string {
  return atob(passkey);
}
