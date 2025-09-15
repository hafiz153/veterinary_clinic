'use client'

import { Edit, Trash2, Clock, User, Calendar } from 'lucide-react'
import { Appointment } from '@/lib/types'
import { formatTime, formatDateTime, getStatusColor, getTypeColor } from '@/lib/utils'

interface AppointmentCardProps {
  appointment: Appointment
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
}

export default function AppointmentCard({ appointment, onEdit, onDelete }: AppointmentCardProps) {
  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        // Trigger a refresh by calling onEdit with the updated appointment
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="card-content">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.petName}
                </h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <User size={16} />
                  {appointment.ownerName}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`badge ${getStatusColor(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                <span className={`badge ${getTypeColor(appointment.type)}`}>
                  {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                </span>
              </div>
            </div>

            {/* Time and Duration */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>
                  {formatTime(new Date(appointment.startAt))} - {formatTime(new Date(appointment.endAt))}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{appointment.duration} minutes</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {appointment.vet && (
                <div>
                  <span className="font-medium text-gray-700">Veterinarian:</span>
                  <span className="ml-1 text-gray-600">{appointment.vet.name}</span>
                </div>
              )}
              {appointment.room && (
                <div>
                  <span className="font-medium text-gray-700">Room:</span>
                  <span className="ml-1 text-gray-600">{appointment.room.name}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {appointment.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            {appointment.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  className="btn-success text-xs"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
              </>
            )}
            {appointment.status === 'completed' && (
              <button
                onClick={() => handleStatusUpdate('pending')}
                className="btn-secondary text-xs"
              >
                Mark Pending
              </button>
            )}
            {appointment.status === 'cancelled' && (
              <button
                onClick={() => handleStatusUpdate('pending')}
                className="btn-secondary text-xs"
              >
                Reactivate
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(appointment)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
              title="Edit appointment"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(appointment.id)}
              className="p-2 text-gray-600 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
              title="Delete appointment"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}