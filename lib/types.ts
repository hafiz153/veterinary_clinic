import { z } from "zod";

export const AppointmentStatus = z.enum(["pending", "completed", "cancelled"]);
export const AppointmentType = z.enum([
  "",
  "vaccination",
  "checkup",
  "surgery",
  "emergency",
  "grooming",
  "dental",
]).refine((val) => val !== "", {
  message: "Please select type",
});

export const AppointmentSchema = z.object({
  id: z.string().optional(),
  petName: z.string().min(1, "Pet name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  type: AppointmentType,
  status: AppointmentStatus,
  notes: z.string().optional(),
  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration cannot exceed 8 hours"),
  startAt: z
    .string()
    .min(1, "Start time required")
    .transform((val) => new Date(val)),
  endAt: z
    .string()
    .min(1, "End time required")
    .transform((val) => new Date(val)),
  vetId: z.string().min(1, "Please select a vet"),
  roomId: z.string().min(1, "Please select a room")
});

export const CreateAppointmentSchema = AppointmentSchema.omit({
  id: true,
  endAt: true,
}).extend({
  startAt: z.string().min(1, "Start time is required"),
});

export const UpdateAppointmentSchema = AppointmentSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export type Appointment = z.infer<typeof AppointmentSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  vet?: {
    id: string;
    name: string;
  };
  room?: {
    id: string;
    name: string;
  };
  owner?: {
    id: string;
    name: string;
  };
  pet?: {
    id: string;
    name: string;
  };
};

export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;

export type AppointmentStatusType = z.infer<typeof AppointmentStatus>;
export type AppointmentTypeType = z.infer<typeof AppointmentType>;

export interface Vet {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Room {
  id: string;
  name: string;
  location?: string;
}

export interface Owner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Pet {
  id: string;
  name: string;
  species?: string;
  breed?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ConflictError {
  message: string;
  conflictingAppointment?: {
    id: string;
    petName: string;
    ownerName: string;
    startAt: Date;
    endAt: Date;
  };
}
