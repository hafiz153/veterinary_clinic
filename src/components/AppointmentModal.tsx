"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateAppointmentSchema,
  type CreateAppointmentInput,
  type Appointment,
  type Vet,
  type Room,
} from "@/lib/types";
import { getUTCTodayDateString, combineDateAndTime } from "@/lib/utils";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  appointment?: Appointment | null;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  appointment,
}: AppointmentModalProps) {
  const [vets, setVets] = useState<Vet[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!appointment;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateAppointmentInput>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      petName: "",
      ownerName: "",
      type: "",
      status: "pending",
      duration: 30,
      startAt: "",
      notes: "",
    },
  });
  console.log({ errors });

  // Load vets and rooms when modal opens
  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch("/api/vets").then((res) => res.json()),
        fetch("/api/rooms").then((res) => res.json()),
      ]).then(([vetsResult, roomsResult]) => {
        if (vetsResult.success) setVets(vetsResult.data);
        if (roomsResult.success) setRooms(roomsResult.data);
      });
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (isOpen && appointment) {
      const startAt = new Date(appointment.startAt);
      const timeString = startAt.toTimeString().slice(0, 5); // HH:MM format
      const dateString = startAt.toISOString().split("T")[0]; // YYYY-MM-DD format

      reset({
        petName: appointment.petName,
        ownerName: appointment.ownerName,
        type: appointment.type as any,
        status: appointment.status as any,
        duration: appointment.duration,
        startAt: `${dateString}T${timeString}`,
        notes: appointment.notes || "",
        vetId: appointment.vetId || "",
        roomId: appointment.roomId || "",
      });
    } else if (isOpen) {
      // Reset form for new appointment
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const todayDate = getUTCTodayDateString();

      reset({
        petName: "",
        ownerName: "",
        type: "",
        status: "pending",
        duration: 30,
        startAt: `${todayDate}T${currentTime}`,
        notes: "",
        vetId: "",
        roomId: "",
      });
    }
  }, [isOpen, appointment, reset]);

  const onSubmit = async (data: CreateAppointmentInput) => {
    setLoading(true);
    setError(null);

    try {
      // Parse the datetime string and create end time
      const startAt = new Date(data.startAt);
      const endAt = new Date(startAt.getTime() + data.duration * 60 * 1000);

      const payload = {
        ...data,
        startAt,
        endAt,
        vetId: data.vetId || undefined,
        roomId: data.roomId || undefined,
      };

      const url = isEditing
        ? `/api/appointments/${appointment.id}`
        : "/api/appointments";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        onSave();
        reset();
      } else {
        setError(result.error || "Failed to save appointment");
      }
    } catch (err) {
      setError("Network error while saving appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="card-header flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Appointment" : "Add New Appointment"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-content space-y-6"
          >
            {/* Error Message */}
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Pet and Owner Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name *
                </label>
                <input
                  {...register("petName")}
                  className="input"
                  placeholder="Enter pet name"
                />
                {errors.petName && (
                  <p className="text-danger-600 text-sm mt-1">
                    {errors.petName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name *
                </label>
                <input
                  {...register("ownerName")}
                  className="input"
                  placeholder="Enter owner name"
                />
                {errors.ownerName && (
                  <p className="text-danger-600 text-sm mt-1">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select {...register("type")} className="input">
                  <option selected value="">Select a type</option>
                  <option value="checkup">Checkup</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="surgery">Surgery</option>
                  <option value="emergency">Emergency</option>
                  <option value="grooming">Grooming</option>
                  <option value="dental">Dental</option>
                </select>
                {errors.type && (
                  <p className="text-danger-600 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select {...register("status")} className="input">
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                  min="15"
                  max="480"
                  step="15"
                  className="input"
                />
                {errors.duration && (
                  <p className="text-danger-600 text-sm mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinarian
                </label>
                <select {...register("vetId")} className="input">
                  <option value="">Select a vet</option>
                  {vets.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.name}
                    </option>
                  ))}
                </select>
                {errors.vetId && (
                  <p className="text-danger-600 text-sm mt-1">
                    {errors.vetId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <select {...register("roomId")} className="input">
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                {errors.roomId && (
                  <p className="text-danger-600 text-sm mt-1">
                    {errors.roomId.message}
                  </p>
                )}
              </div>
            </div>
            {/* Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  {...register("startAt")}
                  className="input"
                />
                {errors.startAt && (
                  <p className="text-danger-600 text-sm mt-1">
                    {errors.startAt.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="input resize-none"
                placeholder="Additional notes or instructions..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Appointment"
                  : "Create Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
