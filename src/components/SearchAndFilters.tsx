import { Search } from "lucide-react";
import { AppointmentStatusType, AppointmentTypeType } from "@/lib/types";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: AppointmentStatusType | "all";
  setStatusFilter: (status: AppointmentStatusType | "all") => void;
  typeFilter: AppointmentTypeType | "all";
  setTypeFilter: (type: AppointmentTypeType | "all") => void;
}

export default function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}: SearchAndFiltersProps) {
  return (
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
                setStatusFilter(e.target.value as AppointmentStatusType | "all")
              }
              className="input w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={typeFilter as string}
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
  );
}
