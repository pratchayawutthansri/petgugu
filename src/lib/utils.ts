import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names with clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Date to Thai or English locale string
 */
export function formatDate(
  dateInput: string | Date | undefined,
  locale: 'th' | 'en' = 'th',
  includeTime = true
): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  return d.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', options);
}

/**
 * Relative time from now (e.g. "5 minutes ago", "5 นาทีที่แล้ว")
 */
export function formatTimeAgo(
  dateInput: string | Date | undefined,
  locale: 'th' | 'en' = 'th'
): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (locale === 'th') {
    if (diffSec < 45) return 'เมื่อสักครู่';
    if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
    if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;
    if (diffDay === 1) return 'เมื่อวานนี้';
    return `${diffDay} วันที่แล้ว`;
  } else {
    if (diffSec < 45) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'yesterday';
    return `${diffDay}d ago`;
  }
}

/**
 * Calculate distance between two lat/lng coordinates in meters (Haversine formula)
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format distance in meters to readable km or m
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Format battery level with appropriate color class
 */
export function getBatteryColor(level: number): string {
  if (level > 60) return 'text-success-600 bg-success-50 border-success-200';
  if (level > 25) return 'text-warning-600 bg-warning-50 border-warning-200';
  return 'text-danger-600 bg-danger-50 border-danger-200 animate-pulse-soft';
}

/**
 * Format signal strength percentage into label & color
 */
export function getSignalInfo(strength: number): { label: string; color: string; bars: number } {
  if (strength >= 75) {
    return { label: 'ยอดเยี่ยม (Excellent)', color: 'text-success-600', bars: 4 };
  }
  if (strength >= 50) {
    return { label: 'ดี (Good)', color: 'text-primary-600', bars: 3 };
  }
  if (strength >= 25) {
    return { label: 'พอใช้ (Fair)', color: 'text-warning-600', bars: 2 };
  }
  return { label: 'อ่อน (Weak)', color: 'text-danger-600', bars: 1 };
}
