import { Accommodation, Guest } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const buildUrl = (path: string) => {
  if (!API_BASE) return path;
  return `${API_BASE}${path}`;
};

export const fetchAccommodations = async (date: string): Promise<Accommodation[]> => {
  const response = await fetch(buildUrl(`/api/accommodations?date=${encodeURIComponent(date)}`));
  if (!response.ok) {
    throw new Error('Failed to load accommodations');
  }
  return response.json();
};

export const fetchGuests = async (): Promise<Guest[]> => {
  const response = await fetch(buildUrl('/api/guests'));
  if (!response.ok) {
    throw new Error('Failed to load guests');
  }
  return response.json();
};

export const fetchCalendarBookings = async (accommodationId: string) => {
  const response = await fetch(buildUrl(`/api/accommodations/${accommodationId}/calendar`));
  if (!response.ok) {
    throw new Error('Failed to load calendar bookings');
  }
  return response.json();
};

export const fetchAnalytics = async () => {
  const response = await fetch(buildUrl('/api/reports/analytics'));
  if (!response.ok) {
    throw new Error('Failed to load analytics data');
  }
  return response.json();
};

export interface CreateBookingPayload {
  guestName: string;
  pax: number;
  type: 'DAYTOUR' | 'OVERNIGHT' | 'EXTENDED STAY';
  accommodationId: string;
  isWalkIn: boolean;
  checkInDate: string;
  eta?: string;
}

export const createBooking = async (payload: CreateBookingPayload) => {
  const response = await fetch(buildUrl('/api/bookings'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guest_name: payload.guestName,
      pax: payload.pax,
      type: payload.type,
      accommodation_id: Number(payload.accommodationId),
      is_walk_in: payload.isWalkIn,
      check_in_date: payload.checkInDate,
      eta: payload.eta,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create booking');
  }

  return response.json();
};

export const checkoutBooking = async (bookingId: string) => {
  const response = await fetch(buildUrl(`/api/bookings/${bookingId}/checkout`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to checkout booking');
  }

  return response.json();
};
