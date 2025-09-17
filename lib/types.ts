import { z } from "zod";

export enum AppointmentTypeEnum {
  NONE = "",
  VACCINATION = "vaccination",
  CHECKUP = "checkup",
  SURGERY = "surgery",
  EMERGENCY = "emergency",
  GROOMING = "grooming",
  DENTAL = "dental",
}

export const AppointmentStatus = z.enum(["pending", "completed", "cancelled"]);
export const AppointmentType = z.enum([
  "vaccination",
  "checkup",
  "surgery",
  "emergency",
  "grooming",
  "dental",
]);
// .refine((val) => val !== "", {
//   message: "Please select type",
// });

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
  roomId: z.string().min(1, "Please select a room"),
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
  vetId: string;
  roomId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  startAt: Date | string;
  endAt: Date | string;
  type: AppointmentTypeType;
  status: AppointmentStatusType;
  notes?: string | null;
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
export type AppointmentTypeType = z.infer<typeof AppointmentType | string>;

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

// ************************************** Types for backedn APIs
// list appointments with pagination

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AppointmentListResponse =
  | {
      success: true;
      data: Appointment[];
      pagination: Pagination;
    }
  | {
      success: false;
      error: string;
    };

// create appointment
export type AppointmentCreateResponse = {
  success: boolean;
  data: Appointment;
};

export type AppointmentCreateErrorResponse = {
  success: boolean;
  error: string;
};

// get single appointment
export type AppointmentDetailResponse = {
  success: boolean;
  data: Appointment;
};

export type AppointmentDetailErrorResponse = {
  success: boolean;
  error: string;
};

// update appointment or status
export type AppointmentUpdateResponse = {
  success: boolean;
  data: Appointment;
};

export type AppointmentUpdateErrorResponse = {
  success: boolean;
  error: string;
};

// delete appointment
export type AppointmentDeleteResponse = {
  success: boolean;
  message: string;
};

export type AppointmentDeleteErrorResponse = {
  success: false;
  error: string;
};

// Shared types for Vet and Room
export type vet = {
  id: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type room = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  location: string | null;
};

export type VetGetResponse = {
  success: boolean;
  data: vet[];
};

export type VetGetErrorResponse = {
  success: false;
  error: string;
};
export type RoomGetResponse = {
  success: boolean;
  data: room[];
};

export type RoomGetErrorResponse = {
  success: false;
  error: string;
};
