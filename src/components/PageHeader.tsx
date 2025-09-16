import { Plus } from "lucide-react";

interface PageHeaderProps {
  onAddAppointment: () => void;
}

export default function PageHeader({ onAddAppointment }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary-600">
          Today's Appointments
        </h1>
        <p className="text-gray-600">
          Manage your veterinary appointments for{" "}
          {new Date().toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={onAddAppointment}
        className="btn-primary flex items-center gap-2"
      >
        <Plus size={20} />
        Add Appointment
      </button>
    </div>
  );
}