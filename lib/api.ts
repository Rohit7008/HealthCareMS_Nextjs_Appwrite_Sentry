export interface Appointment {
  id: string;
  primaryPhysician: string;
  schedule: string;
}

export async function getAppointment(appointmentId: string): Promise<Appointment> {
  return {
    id: appointmentId,
    primaryPhysician: "Dr. John Doe",
    schedule: new Date().toISOString(),
  };
}
