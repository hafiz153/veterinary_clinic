import { Appointment } from "@/lib/types";
import AppointmentCard from "./AppointmentCard";
import AppointmentListItem from "./AppointmentListItem";
import EmptyState from "./EmptyState";

export type ViewType = "card" | "list";

interface AppointmentsListProps {
  appointments: Appointment[];
  totalAppointments: number;
  viewType: ViewType;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onAddAppointment: () => void;
}

export default function AppointmentsList({
  appointments,
  totalAppointments,
  viewType,
  onEdit,
  onDelete,
  onAddAppointment,
}: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        totalAppointments={totalAppointments}
        onAddAppointment={onAddAppointment}
      />
    );
  }

  const sortedAppointments = appointments.sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  if (viewType === "list") {
    return (
      <div className="card">
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pet & Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veterinarian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAppointments.map((appointment) => (
                  <AppointmentListItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {sortedAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
