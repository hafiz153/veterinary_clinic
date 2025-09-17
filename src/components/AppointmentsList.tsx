import { Appointment } from "@/lib/types";
import AppointmentListItem from "./AppointmentListItem";
import EmptyState from "./EmptyState";

export type ViewType = "card" | "list";

interface AppointmentsListProps {
  appointments: Appointment[];
  totalAppointments: number;
  viewType: ViewType;
  onEdit: (appointment: Appointment) => void;
  onView: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onAddAppointment: () => void;
}

export default function AppointmentsList({
  appointments,
  totalAppointments,
  onEdit,
  onView,
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

  // Don't sort here since API already returns sorted data
  const appointmentsToRender = appointments;

    return (
      <div className="card">
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pet
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
                    Room
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
                {appointmentsToRender.map((appointment) => (
                  <AppointmentListItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={onEdit}
                    onView={onView}
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