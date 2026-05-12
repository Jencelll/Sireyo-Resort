import { Accommodation, RentalItem, RentalRecord, FeeItem, ExtensionFee } from '../types';

export const slideshowImages = [
  '/pool.jpg',
  '/pool day.jpg',
  '/poolagain.jpg',
  '/poolf.jpg',
  '/poolll.jpg',
  '/poolsideview.jpg',
  '/sireyo.jpg',
  '/sireyoview.jpg',
  '/sunrise.jpg',
  '/sunset pool.jpg',
  '/tent.jpg',
  '/tinyhouse.jpg',
  '/trees.jpg',
];

export const ACCOMMODATIONS: Accommodation[] = [
  // Column 1
  { id: 'c1', name: 'Cottage 1', capacity: 'Max 8 Pax', location: 'Main Area', daytourBooking: { id: 'b1', guestName: 'Melanie Malayo', pax: 8, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '300', eta: '07:00 AM', type: 'DAYTOUR' } },
  { id: 'c2', name: 'Cottage 2', capacity: 'Max 8 Pax', location: 'Main Area', daytourBooking: { id: 'b2', guestName: 'Ronalyn Padayao', pax: 3, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '450', eta: '07:00 AM', type: 'DAYTOUR' } },
  { id: 'c3', name: 'Cottage 3', capacity: 'Max 8 Pax', location: 'Main Area', daytourBooking: { id: 'b3', guestName: 'Raquel De Torres', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', eta: 'Walk-in', type: 'DAYTOUR' } },
  { id: 'c4', name: 'Cottage 4', capacity: 'Max 8 Pax', location: 'Main Area', daytourBooking: { id: 'b4', guestName: 'Pearl', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', type: 'DAYTOUR' } },
  { id: 'c5', name: 'Cottage 5 BR', capacity: 'Max 10 Pax', location: 'Main Area', daytourBooking: { id: 'b5', guestName: 'Ashley De Castro', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', eta: 'Walk-in', type: 'DAYTOUR' } },
  { id: 'c6', name: 'Cottage 6 BR', capacity: 'Max 10 Pax', location: 'Main Area' },
  { id: 'c7', name: 'Cottage 7 BR', capacity: 'Max 10 Pax', location: 'Main Area', daytourBooking: { id: 'b6', guestName: 'Rachealle Borcel', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', eta: 'Walk-in', type: 'DAYTOUR' } },
  { id: 'c8', name: 'Cottage 8 BR', capacity: 'Max 10 Pax', location: 'Main Area', daytourBooking: { id: 'b7', guestName: 'For Walk-In', pax: 0, status: 'Pending', paymentStatus: 'No Adv.', type: 'DAYTOUR' }, overnightBooking: { id: 'b8', guestName: 'For Walk-In', pax: 0, status: 'Pending', paymentStatus: 'No Adv.', type: 'OVERNIGHT' } },
  { id: 'c9', name: 'Cottage 9 BR', capacity: 'Max 10 Pax', location: 'Main Area', daytourBooking: { id: 'b9', guestName: 'Paula', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', eta: 'Walk-in', type: 'DAYTOUR' } },
  { id: 'c10', name: 'Cottage 10 BR', capacity: 'Max 10 Pax', location: 'Main Area', overnightBooking: { id: 'b10', guestName: 'Dave', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', eta: 'Walk-in', type: 'OVERNIGHT' } },
  { id: 't1', name: 'Tent (Center)', capacity: 'Max 4 Pax', location: 'Camping Area' },
  { id: 't2', name: 'Tent (Bamboo)', capacity: 'Max 4 Pax', location: 'Camping Area', daytourBooking: { id: 'b11', guestName: 'Marife Baluyot', pax: 1, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '700', type: 'DAYTOUR' } },

  // Column 2
  { id: 'l1', name: 'Lubi Cottage 1', capacity: 'Max 8 Pax', location: 'Lubi Area' },
  { id: 'l2', name: 'Lubi Cottage 2', capacity: 'Max 8 Pax', location: 'Lubi Area' },
  { id: 'l3', name: 'Lubi Cottage 3', capacity: 'Max 8 Pax', location: 'Lubi Area' },
  { id: 'l4', name: 'Lubi Cottage 4', capacity: 'Max 8 Pax', location: 'Lubi Area', daytourBooking: { id: 'b12', guestName: 'Christine', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', eta: 'Walk-in', type: 'DAYTOUR' } },
  { id: 'l5', name: 'Lubi Cottage 5', capacity: 'Max 8 Pax', location: 'Lubi Area', daytourBooking: { id: 'b13', guestName: 'Tina', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', type: 'DAYTOUR' } },
  { id: 'l6', name: 'Lubi Cottage 6', capacity: 'Max 8 Pax', location: 'Lubi Area' },
  { id: 'l7', name: 'Lubi Cottage 7', capacity: 'Max 8 Pax', location: 'Lubi Area' },
  { id: 'l8', name: 'Lubi Cottage 8', capacity: 'Max 8 Pax', location: 'Lubi Area', daytourBooking: { id: 'b14', guestName: 'Alyssa Obciana', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', eta: 'Walk-in', type: 'DAYTOUR' } },
  { id: 'k1', name: 'Kubo Cottage 1', capacity: 'Max 6 Pax', location: 'Kubo Area' },
  { id: 'k2', name: 'Kubo Cottage 2', capacity: 'Max 6 Pax', location: 'Kubo Area' },
  { id: 'k3', name: 'Kubo Cottage 3', capacity: 'Max 6 Pax', location: 'Kubo Area' },
  { id: 'fc', name: 'Family Cottage', capacity: 'Max 15 Pax', location: 'Main Area' },
  { id: 'mh', name: 'Maypan Hall', capacity: 'Max 50 Pax', location: 'Events Area', daytourBooking: { id: 'b15', guestName: 'Jeaneth Gonzales', pax: 7, minorCount: 11, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '3000', eta: '08:00 AM', type: 'DAYTOUR' } },

  // Column 3
  { id: 'p1', name: 'Payag 1', capacity: 'Max 12 Pax', location: 'VIP Area', overnightBooking: { id: 'b16', guestName: 'Gerlie Enriquez', pax: 30, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '28000', eta: '01:00 PM', type: 'OVERNIGHT' } },
  { id: 'p2', name: 'Payag 2', capacity: 'Max 12 Pax', location: 'VIP Area' },
  { id: 'mp1', name: 'Mini Payag 1', capacity: 'Max 6 Pax', location: 'Beach Front', daytourBooking: { id: 'b17', guestName: 'Sheena Padillo', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', eta: '12:00 NN Out', type: 'DAYTOUR' } },
  { id: 'mp2', name: 'Mini Payag 2', capacity: 'Max 6 Pax', location: 'Beach Front', overnightBooking: { id: 'b18', guestName: 'Lhen Santos', pax: 10, minorCount: 6, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '4000', eta: '04:00 PM', type: 'OVERNIGHT' } },
  { id: 'mp3', name: 'Mini Payag 3', capacity: 'Max 6 Pax', location: 'Beach Front', daytourBooking: { id: 'b19', guestName: 'Rosalinda Bacsal', pax: 7, minorCount: 1, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '1475', eta: '06:30 AM', type: 'DAYTOUR' } },
  { id: 'bk1', name: 'Bahay Kubo 1', capacity: 'Max 4 Pax', location: 'Authentic Area', daytourBooking: { id: 'b20', guestName: '12nn Out', pax: 0, status: 'Confirmed', paymentStatus: 'No Adv.', type: 'DAYTOUR' } },
  { id: 'bk2', name: 'Bahay Kubo 2', capacity: 'Max 4 Pax', location: 'Authentic Area', daytourBooking: { id: 'b21', guestName: 'Tess', pax: 1, status: 'Confirmed', paymentStatus: 'No Adv.', type: 'DAYTOUR' }, overnightBooking: { id: 'b22', guestName: 'Danice Evirne Gayacero', pax: 5, minorCount: 1, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '830', eta: '05:30 PM', type: 'OVERNIGHT' } },
  { id: 'bk3', name: 'Bahay Kubo 3', capacity: 'Max 4 Pax', location: 'Authentic Area', overnightBooking: { id: 'b23', guestName: 'Ethel Tugade', pax: 3, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '1300', eta: '02:30 PM', type: 'OVERNIGHT' } },
  { id: 'bk4', name: 'Bahay Kubo 4', capacity: 'Max 4 Pax', location: 'Authentic Area', overnightBooking: { id: 'b24', guestName: 'Jhaness Macasinag', pax: 2, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '1000', eta: '04:30 PM', type: 'OVERNIGHT' } },
  { id: 'bk5', name: 'Bahay Kubo 5', capacity: 'Max 4 Pax', location: 'Authentic Area' },
  { id: 'bk6', name: 'Bahay Kubo 6', capacity: 'Max 4 Pax', location: 'Authentic Area', daytourBooking: { id: 'b25', guestName: 'Mirasol Aguila', pax: 1, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '1000', type: 'DAYTOUR' } },
  { id: 'th1', name: 'Tiny House 1', capacity: 'Max 2 Pax', location: 'Modern Area' },
  { id: 'th2', name: 'Tiny House 2', capacity: 'Max 2 Pax', location: 'Modern Area' },
  { id: 'g1', name: 'Grounds Area (No Cottage)', capacity: 'No Guest Limit', location: 'Open Grounds', daytourBooking: { id: 'b26', guestName: 'Walk-in Group A', pax: 5, status: 'Checked In', paymentStatus: 'No Adv.', eta: 'Walk-in', type: 'DAYTOUR', isWalkIn: true } },
  { id: 'g2', name: 'Grounds Area (No Cottage)', capacity: 'No Guest Limit', location: 'Open Grounds', overnightBooking: { id: 'b27', guestName: 'Reserved Group B', pax: 3, status: 'Confirmed', paymentStatus: 'Paid Adv.', advancePayment: '500', eta: '06:00 PM', type: 'OVERNIGHT' } }
];

export const RENTAL_ITEMS: RentalItem[] = [
  { id: 'ri1', name: 'Table', daytourPrice: 250, overnightPrice: 350 },
  { id: 'ri2', name: 'Chair', daytourPrice: 10, overnightPrice: 10 },
  { id: 'ri3', name: 'Picnic Mat (Small)', daytourPrice: 50, overnightPrice: 50 },
  { id: 'ri4', name: 'Picnic Mat (Large)', daytourPrice: 100, overnightPrice: 100 },
  { id: 'ri5', name: 'Sleeping Mat', daytourPrice: 100, overnightPrice: 150 },
  { id: 'ri6', name: 'Extra Foam Bed (Single)', daytourPrice: 350, overnightPrice: 500 },
  { id: 'ri7', name: 'Air Bed (Single)', daytourPrice: 350, overnightPrice: 500 },
  { id: 'ri8', name: 'Air Bed (Double)', daytourPrice: 500, overnightPrice: 700 },
  { id: 'ri9', name: 'Hammock', daytourPrice: 150, overnightPrice: 250 },
  { id: 'ri10', name: 'Videoke', daytourPrice: 1000, overnightPrice: 1500 },
  { id: 'ri11', name: 'Personal Griller w/ 1 pack of Charcoal', daytourPrice: 150, overnightPrice: 150 },
  { id: 'ri12', name: 'Camping Cookware with Portable Stove & 1 Butane', daytourPrice: 300, overnightPrice: 400 },
  { id: 'ri13', name: 'Portable Stove w/ 1 Butane Gas', daytourPrice: 200, overnightPrice: 300 },
  { id: 'ri14', name: 'LPG with stove (Consumable)', daytourPrice: 500, overnightPrice: 800 },
  { id: 'ri15', name: 'Powerbank with Emergency Light', daytourPrice: 100, overnightPrice: 200 },
];

export const INITIAL_RENTALS: RentalRecord[] = [
  { id: 'rr1', guestName: 'Melanie Malayo', itemName: 'Table', quantity: 1, type: 'DAYTOUR', totalPrice: 250, status: 'Active', rentedAt: '2024-04-02T08:00:00Z' },
  { id: 'rr2', guestName: 'Melanie Malayo', itemName: 'Chair', quantity: 4, type: 'DAYTOUR', totalPrice: 40, status: 'Active', rentedAt: '2024-04-02T08:00:00Z' },
  { id: 'rr3', guestName: 'Gerlie Enriquez', itemName: 'Videoke', quantity: 1, type: 'OVERNIGHT', totalPrice: 1500, status: 'Active', rentedAt: '2024-04-02T13:00:00Z' },
];

export const CORKAGE_FEES: FeeItem[] = [
  { id: 'cf1', name: 'Catering service', price: 2000 },
  { id: 'cf2', name: 'Canopy tent (maximum size: 3x3)', price: 200 },
  { id: 'cf3', name: 'Gazebo or marquee tent', price: 300 },
  { id: 'cf4', name: 'Collapsible tent', price: 1000, note: 'Subject to approval' },
  { id: 'cf5', name: 'Table', price: 100, note: 'Camping table is free of charge' },
  { id: 'cf6', name: 'Additional Chair', price: 5, note: 'Up to 5 chairs per group are free' },
];

export const ELECTRICITY_CHARGES: FeeItem[] = [
  { id: 'ec1', name: 'Electric kettle', price: 50 },
  { id: 'ec2', name: 'Rice cooker', price: 100 },
  { id: 'ec3', name: 'Electric stove / induction cooker', price: 150 },
  { id: 'ec4', name: 'Air fryer', price: 200 },
  { id: 'ec5', name: 'Coffee maker', price: 200 },
  { id: 'ec6', name: 'Water dispenser', price: 200 },
  { id: 'ec7', name: 'Videoke', price: 300 },
  { id: 'ec8', name: 'Sound system', price: 500, note: 'Subject to approval' },
  { id: 'ec9', name: 'Big speaker / subwoofer', price: 300 },
  { id: 'ec10', name: 'Big dipper, laser lights, disco lights', price: 500 },
];

export const EXTENSION_FEES: ExtensionFee[] = [
  { id: 'ef1', accommodation: 'Entrance Fee', perHour: 20, dayTourExtension: 50, overnightExtension: 50 },
  { id: 'ef2', accommodation: 'Malay Golden Cottage', perHour: 50, dayTourExtension: 200, overnightExtension: 200 },
  { id: 'ef3', accommodation: 'Lubi Cottage', perHour: 50, dayTourExtension: 200, overnightExtension: 200 },
  { id: 'ef4', accommodation: 'Family Cottage', perHour: 150, dayTourExtension: 600, overnightExtension: 600 },
  { id: 'ef5', accommodation: 'Kubo Cottage', perHour: 150, dayTourExtension: 600, overnightExtension: 600 },
  { id: 'ef6', accommodation: 'Big Tent', perHour: 150, dayTourExtension: 500, overnightExtension: 500 },
  { id: 'ef7', accommodation: 'Maypan Hall', perHour: 300, dayTourExtension: 1500, overnightExtension: 1500 },
  { id: 'ef8', accommodation: 'Bahay Kubo', perHour: 300, dayTourExtension: 900, overnightExtension: 900, note: 'No additional entrance fee' },
  { id: 'ef9', accommodation: 'Mini Payag', perHour: 500, dayTourExtension: 1500, overnightExtension: 1500, note: 'No additional entrance fee' },
  { id: 'ef10', accommodation: 'Payag 1 & 2', perHour: 500, dayTourExtension: 2000, overnightExtension: 2000, note: 'No additional entrance fee' },
  { id: 'ef11', accommodation: 'Tiny House', perHour: 1000, dayTourExtension: 2000, overnightExtension: 2000, note: 'No additional entrance fee' },
  { id: 'ef12', accommodation: 'Tent Pitching', perHour: null, dayTourExtension: 50, overnightExtension: 50 },
];

export const ALL_ISSUABLE_ITEMS: RentalItem[] = [
  ...RENTAL_ITEMS,
  ...CORKAGE_FEES.map(f => ({ id: f.id, name: `[Corkage] ${f.name}`, daytourPrice: f.price, overnightPrice: f.price })),
  ...ELECTRICITY_CHARGES.map(f => ({ id: f.id, name: `[Electricity] ${f.name}`, daytourPrice: f.price, overnightPrice: f.price }))
];
export const REVENUE_DATA = [
  { day: 'MON', revenue: 45000, forecast: 40000 },
  { day: 'TUE', revenue: 52000, forecast: 45000 },
  { day: 'WED', revenue: 61000, forecast: 50000 },
  { day: 'THU', revenue: 48000, forecast: 55000 },
  { day: 'FRI', revenue: 72000, forecast: 65000 },
  { day: 'SAT', revenue: 85000, forecast: 80000 },
  { day: 'SUN', revenue: 68000, forecast: 70000 },
];
