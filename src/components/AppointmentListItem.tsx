import { Edit2, Trash2 } from "lucide-react";
import { Appointment } from "@/lib/types";

interface AppointmentListItemProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentListItem({
  appointment,
  onEdit,
  onDelete,
}: AppointmentListItemProps) {
  const formatTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success-100 text-success-800 border-success-200";
      case "pending":
        return "bg-warning-100 text-warning-800 border-warning-200";
      case "cancelled":
        return "bg-danger-100 text-danger-800 border-danger-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "vaccination":
        return "bg-blue-100 text-blue-800";
      case "checkup":
        return "bg-green-100 text-green-800";
      case "surgery":
        return "bg-red-100 text-red-800";
      case "emergency":
        return "bg-orange-100 text-orange-800";
      case "grooming":
        return "bg-purple-100 text-purple-800";
      case "dental":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="font-medium text-gray-900">{appointment.petName}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm text-gray-500">{appointment.ownerName}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(
            appointment.type
          )}`}
        >
          {appointment.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {appointment.vet && (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(
              appointment?.vet?.name
            )}`}
          >
            {appointment?.vet?.name}
          </span>
        )}
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div>{formatTime(appointment.startAt)}</div>
        {appointment.endAt && (
          <div className="text-xs text-gray-500">
            - {formatTime(appointment.endAt)}
          </div>
        )}
      </td> */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div>
          {formatTime(appointment.startAt)}- {formatTime(appointment.endAt)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(
            appointment.status
          )}`}
        >
          {appointment.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(appointment)}
            className="text-primary-600 hover:text-primary-700 p-1 rounded-md hover:bg-primary-50 transition-colors"
            title="Edit appointment"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(appointment.id)}
            className="text-danger-600 hover:text-danger-700 p-1 rounded-md hover:bg-danger-50 transition-colors"
            title="Delete appointment"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
