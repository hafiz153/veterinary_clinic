
import { Appointment } from "@/lib/types";
import { X } from "lucide-react";

interface AppointmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export default function AppointmentViewModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentViewModalProps) {
  if (!isOpen || !appointment) return null;

  const startAt = new Date(appointment.startAt);
  const endAt = new Date(appointment.endAt);

  const statusColors: Record<string, string> = {
    pending: "bg-warning-100 text-warning-700",
    completed: "bg-success-100 text-success-700",
    cancelled: "bg-danger-100 text-danger-700",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Card */}
        <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="card-header flex items-center justify-between bg-primary-600">
            <h2 className="text-xl font-semibold text-white text-gray-900">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="card-content space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary-600">
                {appointment.petName}
              </h3>
              <p className="text-gray-600">Owner: {appointment.ownerName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{appointment.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${statusColors[appointment.status]}`}
                >
                  {appointment.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Time</p>
                <p className="font-medium">{startAt.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Time</p>
                <p className="font-medium">{endAt.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{appointment.duration} minutes</p>
              </div>
              {appointment.vet && (
                <div>
                  <p className="text-sm text-gray-500">Veterinarian</p>
                  <p className="font-medium">{appointment.vet.name}</p>
                </div>
              )}
              {appointment.room && (
                <div>
                  <p className="text-sm text-gray-500">Room</p>
                  <p className="font-medium">{appointment.room.name}</p>
                </div>
              )}
            </div>

            {appointment.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="mt-1 text-gray-700 whitespace-pre-line">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
