"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
// import AppointmentCard from "@/components/AppointmentCard";
// import AppointmentModal from "@/components/AppointmentModal";
import {
  Appointment,
  AppointmentStatusType,
  AppointmentTypeType,
} from "@/lib/types";
import { getTodayDateString } from "@/lib/utils";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentModal from "../components/AppointmentModal";

export default function HomePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    AppointmentStatusType | "all"
  >("all");
  const [typeFilter, setTypeFilter] = useState<AppointmentTypeType | "all">(
    "all"
  );

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const today = getTodayDateString();
      const response = await fetch(`/api/appointments?date=${today}`);
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch appointments");
      }
    } catch (err) {
      setError("Network error while fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleAppointmentSaved = () => {
    fetchAppointments();
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        fetchAppointments();
      } else {
        setError(result.error || "Failed to delete appointment");
      }
    } catch (err) {
      setError("Network error while deleting appointment");
    }
  };

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    const matchesType = typeFilter === "all" || appointment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading appointments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-400">
            Today's Appointmentstttt
          </h1>
          <p className="text-gray-600">
            Manage your veterinary appointments for{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleAddAppointment}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Appointment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by pet name, owner, or appointment type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as AppointmentStatusType | "all"
                  )
                }
                className="input w-auto"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as AppointmentTypeType | "all")
                }
                className="input w-auto"
              >
                <option value="all">All Types</option>
                <option value="vaccination">Vaccination</option>
                <option value="checkup">Checkup</option>
                <option value="surgery">Surgery</option>
                <option value="emergency">Emergency</option>
                <option value="grooming">Grooming</option>
                <option value="dental">Dental</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {appointments.length === 0
                ? "No appointments scheduled"
                : "No appointments match your filters"}
            </h3>
            <p className="text-gray-600 mb-4">
              {appointments.length === 0
                ? "Get started by scheduling your first appointment."
                : "Try adjusting your search or filter criteria."}
            </p>
            {appointments.length === 0 && (
              <button onClick={handleAddAppointment} className="btn-primary">
                Schedule First Appointment
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredAppointments.length} of {appointments.length}{" "}
                appointments
              </p>
            </div>
            <div className="grid gap-4">
              {filteredAppointments
                .sort(
                  (a, b) =>
                    new Date(a.startAt).getTime() -
                    new Date(b.startAt).getTime()
                )
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEditAppointment}
                    onDelete={handleDeleteAppointment}
                  />
                ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAppointmentSaved}
        appointment={editingAppointment}
      />
    </div>
  );
}
