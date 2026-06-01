import React from 'react';
import { Accommodation, Booking } from '../types';

interface PrintableBookingSheetProps {
  accommodations: Accommodation[];
  selectedDate: Date;
}

const renderBookingCell = (booking?: Booking) => {
  if (!booking) return null;
  return (
    <div className="flex flex-col p-1 h-full">
      {booking.guestName && <span className="font-bold text-[11px] mb-0.5">{booking.guestName}</span>}
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-gray-700 leading-tight">
        {booking.advancePayment && <span>{booking.advancePayment} ADV</span>}
        {booking.pax && <span>{booking.pax} pax</span>}
        {booking.minorCount && <span>{booking.minorCount} minor</span>}
        {booking.eta && <span>ETA {booking.eta}</span>}
        {booking.isWalkIn && <span>Walk-in</span>}
      </div>
    </div>
  );
};

export const PrintableBookingSheet = ({ accommodations, selectedDate }: PrintableBookingSheetProps) => {
  const col1Names = ['Cottage 1', 'Cottage 2', 'Cottage 3', 'Cottage 4', 'Cottage 5 BR', 'Cottage 6 BR', 'Cottage 7 BR', 'Cottage 8 BR', 'Cottage 9 BR', 'Cottage 10 BR', 'Tent (Center)', 'Tent (Bamboo)'];
  const col2Names = ['Lubi Cottage 1', 'Lubi Cottage 2', 'Lubi Cottage 3', 'Lubi Cottage 4', 'Lubi Cottage 5', 'Lubi Cottage 6', 'Lubi Cottage 7', 'Lubi Cottage 8', 'Kubo Cottage 1', 'Kubo Cottage 2', 'Kubo Cottage 3', 'Family Cottage', 'Maypan Hall'];
  const col3Names = ['Payag 1', 'Payag 2', 'Mini Payag 1', 'Mini Payag 2', 'Mini Payag 3', 'Bahay Kubo 1', 'Bahay Kubo 2', 'Bahay Kubo 3', 'Bahay Kubo 4', 'Bahay Kubo 5', 'Bahay Kubo 6', 'Tiny House 1', 'Tiny House 2', 'Grounds Area (No Cottage)', 'Grounds Area (No Cottage)'];

  const getAcc = (name: string, index: number, arr: string[]) => {
    // Handle the duplicate Grounds Area by using its position (first or second instance)
    if (name === 'Grounds Area (No Cottage)') {
      const allGrounds = accommodations.filter(a => a.name === name);
      const isSecond = arr.indexOf(name) !== index;
      return isSecond ? allGrounds[1] || allGrounds[0] : allGrounds[0];
    }
    return accommodations.find(a => a.name === name);
  };

  const col1 = col1Names.map((name, i, arr) => getAcc(name, i, arr) || { id: `dummy-${i}`, name, capacity: '', location: '' } as Accommodation);
  const col2 = col2Names.map((name, i, arr) => getAcc(name, i, arr) || { id: `dummy-${i}`, name, capacity: '', location: '' } as Accommodation);
  const col3 = col3Names.map((name, i, arr) => getAcc(name, i, arr) || { id: `dummy-${i}`, name, capacity: '', location: '' } as Accommodation);

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const renderColumn = (colAccommodations: Accommodation[], colTitle: string) => {
    // Fill to 15 rows to match heights
    const maxRows = 15;
    const filledAccommodations = [...colAccommodations];
    while (filledAccommodations.length < maxRows) {
      filledAccommodations.push({ id: `filler-${filledAccommodations.length}`, name: '', capacity: '', location: '' } as Accommodation);
    }

    return (
      <div className="flex-1 flex flex-col border-r border-black last:border-r-0">
        <table className="w-full h-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="border-b-2 border-r border-black bg-gray-100 p-1.5 w-[90px] text-[11px] font-bold align-middle" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                {colTitle}
              </th>
              <th className="border-b-2 border-r border-black bg-[#8dc63f] text-black p-1.5 text-[14px] font-bold w-[calc((100%-90px)/2)]" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                Daytour
              </th>
              <th className="border-b-2 border-black bg-[#2980b9] text-white p-1.5 text-[14px] font-bold w-[calc((100%-90px)/2)]" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                Overnight
              </th>
            </tr>
          </thead>
          <tbody>
            {filledAccommodations.map((acc) => (
              <tr key={acc.id} className="border-b border-black last:border-b-0 h-[45px]">
                <td className="border-r border-black p-1.5 font-bold bg-gray-50 break-words align-middle" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                  {acc.name}
                </td>
                <td className="border-r border-black align-top break-words p-0 h-full">
                  {renderBookingCell(acc.daytourBooking)}
                </td>
                <td className="align-top break-words p-0 h-full">
                  {renderBookingCell(acc.overnightBooking)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 1cm;
            }
          }
        `}
      </style>
      <div className="print-only font-sans text-black bg-white w-[100vw] h-[100vh] flex flex-col p-4">
      <div className="text-xl font-bold mb-2 uppercase tracking-widest text-center border-b-2 border-black pb-2">
        Sireyo Daily Booking Sheet
      </div>
      <div className="flex flex-1 w-full border-2 border-black">
        {renderColumn(col1, formattedDate)}
        {renderColumn(col2, '')}
        {renderColumn(col3, '')}
      </div>
    </div>
    </>
  );
};
