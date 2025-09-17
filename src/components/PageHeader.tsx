import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  onAddAppointment: () => void;
}

export default function PageHeader({ onAddAppointment }: PageHeaderProps) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary-600">
          Today&apos;s Appointments
        </h1>
        <p className="text-gray-600">
          Manage your veterinary appointments for{" "}
          {dateTime.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at{" "}
          {dateTime.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
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
