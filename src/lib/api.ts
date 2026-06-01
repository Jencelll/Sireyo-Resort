import { Accommodation, Guest } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const buildUrl = (path: string) => {
  if (!API_BASE) return path;
  return `${API_BASE}${path}`;
};

// Helper to safely parse JSON even if the backend prepends PHP warnings/HTML
const parseJsonResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    const firstBracket = text.indexOf('[');
    const firstBrace = text.indexOf('{');
    const lastBracket = text.lastIndexOf(']');
    const lastBrace = text.lastIndexOf('}');
    
    let startIdx = -1;
    let endIdx = -1;
    
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      startIdx = firstBracket;
      endIdx = lastBracket;
    } else if (firstBrace !== -1) {
      startIdx = firstBrace;
      endIdx = lastBrace;
    }
    
    if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
      try {
        return JSON.parse(text.substring(startIdx, endIdx + 1));
      } catch (e) {
        throw err; 
      }
    }
    throw err;
  }
};

export const fetchAccommodations = async (date: string): Promise<Accommodation[]> => {
  const response = await fetch(buildUrl(`/api/accommodations?date=${encodeURIComponent(date)}`), {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to load accommodations');
  }
  return parseJsonResponse(response);
};

export const fetchGuests = async (): Promise<Guest[]> => {
  const response = await fetch(buildUrl('/api/guests'), {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to load guests');
  }
  return parseJsonResponse(response);
};

export const fetchCalendarBookings = async (accommodationId: string) => {
  const response = await fetch(buildUrl(`/api/accommodations/${accommodationId}/calendar`), {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to load calendar bookings');
  }
  return parseJsonResponse(response);
};

export const fetchAnalytics = async () => {
  const response = await fetch(buildUrl('/api/reports/analytics'), {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to load analytics data');
  }
  return parseJsonResponse(response);
};

export interface CreateBookingPayload {
  guestName: string;
  contactNumber?: string;
  address?: string;
  pax: number;
  minorCount?: number;
  type: 'DAYTOUR' | 'OVERNIGHT' | 'EXTENDED STAY';
  accommodationId: string;
  isWalkIn: boolean;
  advancePayment?: string;
  paymentMethod?: string;
  referenceNo?: string;
  checkInDate: string;
  checkOutDate?: string;
  checkOutTime?: string;
  eta?: string;
  specialRequest?: string;
  remarks?: string;
}

export const createBooking = async (payload: CreateBookingPayload) => {
  const accommodationId = Number(payload.accommodationId);
  const response = await fetch(buildUrl('/api/bookings'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      guest_name: payload.guestName,
      contact_number: payload.contactNumber,
      address: payload.address,
      pax: payload.pax,
      minor_count: payload.minorCount,
      type: payload.type,
      accommodation_id: Number.isFinite(accommodationId) ? accommodationId : payload.accommodationId,
      is_walk_in: payload.isWalkIn,
      advance_payment: payload.advancePayment,
      payment_method: payload.paymentMethod,
      reference_no: payload.referenceNo,
      check_in_date: payload.checkInDate,
      check_out_date: payload.checkOutDate,
      check_out_time: payload.checkOutTime,
      eta: payload.eta,
      special_request: payload.specialRequest,
      remarks: payload.remarks,
    }),
  });

  if (!response.ok) {
    let message = 'Failed to create booking';
    try {
      const errorBody = await parseJsonResponse(response);
      if (errorBody?.message) {
        message = errorBody.message;
      }
      // Laravel validation errors have an "errors" object with field-specific messages
      if (errorBody?.errors) {
        const firstFieldErrors = Object.values(errorBody.errors)[0];
        if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
          message = firstFieldErrors[0] as string;
        }
      }
    } catch {
      // response wasn't JSON, keep default message
    }
    throw new Error(message);
  }

  return parseJsonResponse(response);
};

export const checkoutBooking = async (
  bookingId: string,
  payload?: { checkOutDate?: string; checkOutTime?: string }
) => {
  const response = await fetch(buildUrl(`/api/bookings/${bookingId}/checkout`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: payload ? JSON.stringify({
      check_out_date: payload.checkOutDate,
      check_out_time: payload.checkOutTime,
    }) : undefined,
  });

  if (!response.ok) {
    throw new Error('Failed to checkout booking');
  }

  return parseJsonResponse(response);
};

export const fetchRentalItems = async () => {
  const response = await fetch(buildUrl('/api/rental-items'), {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch rental items');
  return parseJsonResponse(response);
};

export const createRentalItem = async (payload: any) => {
  const response = await fetch(buildUrl('/api/rental-items'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create rental item');
  return parseJsonResponse(response);
};

export const updateRentalItem = async (id: string, payload: any) => {
  const response = await fetch(buildUrl(`/api/rental-items/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update rental item');
  return parseJsonResponse(response);
};

export const deleteRentalItem = async (id: string) => {
  const response = await fetch(buildUrl(`/api/rental-items/${id}`), {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete rental item');
  return parseJsonResponse(response);
};

export const fetchRentals = async () => {
  const response = await fetch(buildUrl('/api/rentals'), {
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch rentals');
  return parseJsonResponse(response);
};

export const createRental = async (payload: any) => {
  const response = await fetch(buildUrl('/api/rentals'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create rental');
  return parseJsonResponse(response);
};

export const returnRental = async (id: string) => {
  const response = await fetch(buildUrl(`/api/rentals/${id}/return`), {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to return rental');
  return parseJsonResponse(response);
};
