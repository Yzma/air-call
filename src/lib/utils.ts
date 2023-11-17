import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateTimePeriod(time: Date) {
  return time.getHours() >= 12 ? 'PM' : 'AM'
}

export function getDateTime(time: Date) {
  const minutes = time.getMinutes()
  return `${time.getHours() % 12 || 12}:${(minutes < 10 ? '0' : '') + minutes}`
}

export function convertSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours} hours : ${minutes} minutes`
  } else if (minutes > 0) {
    return `${minutes} minutes`
  } else {
    return `${seconds} seconds`
  }
}
