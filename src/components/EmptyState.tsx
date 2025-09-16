interface EmptyStateProps {
  totalAppointments: number;
  onAddAppointment: () => void;
}

export default function EmptyState({
  totalAppointments,
  onAddAppointment,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📅</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {totalAppointments === 0
          ? "No appointments scheduled"
          : "No appointments match your filters"}
      </h3>
      <p className="text-gray-600 mb-4">
        {totalAppointments === 0
          ? "Get started by scheduling your first appointment."
          : "Try adjusting your search or filter criteria."}
      </p>
      {totalAppointments === 0 && (
        <button onClick={onAddAppointment} className="btn-primary">
          Schedule First Appointment
        </button>
      )}
    </div>
  );
}