import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function getTodayDateString(): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.toISOString().split('T')[0]
}

export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'badge-pending'
    case 'completed':
      return 'badge-completed'
    case 'cancelled':
      return 'badge-cancelled'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'vaccination':
      return 'bg-blue-100 text-blue-800'
    case 'checkup':
      return 'bg-green-100 text-green-800'
    case 'surgery':
      return 'bg-red-100 text-red-800'
    case 'emergency':
      return 'bg-orange-100 text-orange-800'
    case 'grooming':
      return 'bg-purple-100 text-purple-800'
    case 'dental':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}