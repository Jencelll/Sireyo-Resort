import React from 'react';

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  sparklineData?: number[];
  bgColor?: string;
  iconBgColor?: string;
  textColor?: string;
  valueColor?: string;
}

export interface Guest {
  id: string;
  name: string;
  room: string;
  guests: number;
  type: 'OVERNIGHT' | 'DAYTOUR' | 'EXTENDED STAY';
  image: string;
  email?: string;
  phone?: string;
  status?: 'In-House' | 'Checked Out' | 'Upcoming';
  lastVisit?: string;
}

export interface Booking {
  id: string;
  guestName: string;
  pax: number;
  minorCount?: number;
  advancePayment?: string;
  status: 'Checked In' | 'Confirmed' | 'Pending';
  paymentStatus: 'Paid Adv.' | 'No Adv.' | 'Partial';
  eta?: string;
  type: 'DAYTOUR' | 'OVERNIGHT' | 'EXTENDED STAY';
  isWalkIn?: boolean;
}

export interface RentalItem {
  id: string;
  name: string;
  daytourPrice: number;
  overnightPrice: number;
}

export interface RentalRecord {
  id: string;
  guestName: string;
  itemName: string;
  quantity: number;
  type: 'DAYTOUR' | 'OVERNIGHT';
  totalPrice: number;
  status: 'Active' | 'Returned';
  rentedAt: string;
}

export interface FeeItem {
  id: string;
  name: string;
  price: number;
  note?: string;
}

export interface ExtensionFee {
  id: string;
  accommodation: string;
  perHour: number | null;
  dayTourExtension: number;
  overnightExtension: number;
  note?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  capacity: string;
  location: string;
  daytourBooking?: Booking;
  overnightBooking?: Booking;
  extendedBooking?: Booking;
}
