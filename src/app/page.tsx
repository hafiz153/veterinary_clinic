"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Appointment,
  AppointmentStatusType,
  AppointmentTypeType,
} from "@/lib/types";
import { getUTCTodayDateString } from "@/lib/utils";
import AppointmentModal from "../components/AppointmentModal";
import PageHeader from "../components/PageHeader";
import SearchAndFilters from "../components/SearchAndFilters";
import AppointmentsList from "../components/AppointmentsList";
import ViewToggle from "../components/ViewToggle";
import Pagination from "../components/ui/Pagination";

export type ViewType = "card" | "list";

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
  const [viewType, setViewType] = useState<ViewType>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchAppointments = async (page = 1, limit = pageSize) => {
    try {
      setLoading(true);
      const today = getUTCTodayDateString();
      const response = await fetch(
        `/api/appointments?date=${today}&page=${page}&limit=${limit}`
      );
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);
        setPagination(result.pagination);
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
    fetchAppointments(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleAppointmentSaved = () => {
    fetchAppointments(currentPage, pageSize);
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
        fetchAppointments(currentPage, pageSize);
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
      <PageHeader onAddAppointment={handleAddAppointment} />

      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* View Toggle and Results Count */}
      {filteredAppointments.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, pagination?.totalCount)} of{" "}
            {pagination?.totalCount} appointments
          </p>
          <ViewToggle viewType={viewType} setViewType={setViewType} />
        </div>
      )}

      <AppointmentsList
        appointments={filteredAppointments}
        totalAppointments={pagination?.totalCount}
        viewType={viewType}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
        onAddAppointment={handleAddAppointment}
      />

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages}
          totalCount={pagination?.totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

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
