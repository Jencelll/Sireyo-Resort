/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, CalendarDays, Users, BarChart3, Settings, LogOut, Search, Bell, MapPin, ShoppingCart, X, Menu, Plus, HelpCircle, Globe, User, ShieldCheck
} from 'lucide-react';

import HomeView from './views/home';
import { DashboardView } from './views/dashboard';
import ReservationGrid from './components/ReservationGrid';
import GroundsListView from './views/grounds';
import GuestListView from './views/guests';
import RentalsView from './views/rentals';
import ReportsView from './views/reports';
import CalendarView from './views/calendar';
import SettingsView from './views/settings';
import LoginPage from './views/login';

import TopNavItem from './components/TopNavItem';
import NewBookingModal from './components/NewBookingModal';

import { Guest, Accommodation, ExtensionFee } from './types';
import { ACCOMMODATIONS, EXTENSION_FEES } from './constants';
import { createBooking, fetchAccommodations, fetchGuests, checkoutBooking } from './lib/api';

const App = () => {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'reservations' | 'calendar' | 'grounds' | 'guests' | 'rentals' | 'reports' | 'settings'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState({ id: 1, name: 'Admin Profile', role: 'Superuser', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz2UAMi04y7mGJ4qD0h80UPXBtMSkJUjzSrUBsdmS72a34kUlCfttHkal0XZWnFI8C422eTCdr42Bajn7A3z_xbEXSOZxzQExXK-gKK7oLRFxkp2LdIrQI352JTAsphccxzbFgTfKhm8yTFhpdE7iECU8pCt7-4OdUCE4AAMLjwy_zaaru2JkB6wOpvVCSlEtnthG5wUXZg3oS-KPawJy4he08ktbrDDERIMkoM03nL2ChEhSJDAoEQ25hhPhECBeNDdZ--zRiYj73' });

  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<any>(undefined);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: 'Marcus Chen', room: 'Cottage 1', guests: 2, type: 'OVERNIGHT', status: 'In-House', image: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Sarah Williams', room: 'Tent 1', guests: 4, type: 'DAYTOUR', status: 'Upcoming', image: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'James Wilson', room: 'Lubi 2', guests: 1, type: 'OVERNIGHT', status: 'Checked Out', image: 'https://i.pravatar.cc/150?u=3' },
  ]);

  const [accommodations, setAccommodations] = useState<Accommodation[]>(ACCOMMODATIONS);
  const [extensionFees, setExtensionFees] = useState<ExtensionFee[]>(EXTENSION_FEES);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadAccommodations = async (date: Date) => {
    try {
      const data = await fetchAccommodations(formatDate(date));
      setAccommodations(data);
    } catch (error) {
      console.error(error);
      setAccommodations(ACCOMMODATIONS);
    }
  };

  const loadGuests = async () => {
    try {
      const data = await fetchGuests();
      setGuests(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAccommodations(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    loadGuests();
  }, []);

  const handleOpenNewBooking = (initialData?: any, type?: string) => {
    if (typeof initialData === 'string') {
      setModalInitialData({ roomId: initialData, type });
    } else {
      setModalInitialData(initialData);
    }
    setIsNewBookingModalOpen(true);
  };

  const handleUpdateAccommodation = (id: string, field: keyof Accommodation, value: any) => {
    setAccommodations(accommodations.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
  };

  const handleUpdateExtensionFee = (id: string, field: keyof ExtensionFee, value: any) => {
    setExtensionFees(extensionFees.map(fee => fee.id === id ? { ...fee, [field]: value } : fee));
  };

  const handleUpdateGuest = (id: string, field: keyof Guest, value: any) => {
    setGuests(guests.map(guest => guest.id === id ? { ...guest, [field]: value } : guest));
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const handleCheckoutGuest = async (roomId: string, bookingId: string, bookingType: 'DAYTOUR' | 'OVERNIGHT' | 'EXTENDED STAY') => {
    // 1. Optimistic UI update for immediate feedback
    setAccommodations(prevAccommodations => 
      prevAccommodations.map(acc => {
        if (acc.id === roomId) {
          const accCopy = { ...acc };
          if (bookingType === 'DAYTOUR' && accCopy.daytourBooking?.id === bookingId) {
             accCopy.daytourBooking = undefined;
          } else if (bookingType === 'OVERNIGHT' && accCopy.overnightBooking?.id === bookingId) {
             accCopy.overnightBooking = undefined;
          } else if (bookingType === 'EXTENDED STAY' && accCopy.extendedBooking?.id === bookingId) {
             accCopy.extendedBooking = undefined;
          }
          return accCopy;
        }
        return acc;
      })
    );

    try {
      // 2. Perform checkout in background
      await checkoutBooking(bookingId);
      
      // 3. Reload from backend to ensure full synchronization
      loadAccommodations(selectedDate);
      loadGuests();
    } catch (err) {
      console.error('Checkout failed', err);
      // Revert optimistic update on failure by reloading true state
      loadAccommodations(selectedDate);
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden relative selection:bg-primary/20 selection:text-primary">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl" />
      </div>

      {/* Unified Dark Top Navbar */}
      <header className="h-14 px-4 lg:px-6 flex items-center justify-between bg-[#0a0a0a] text-white border-b border-white/5 relative z-40 shrink-0 shadow-2xl">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0 lg:flex-1">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-white/20 bg-white/5">
            <img src="/sireyoicon.png" alt="Sireyo" className="w-full h-full object-cover scale-110" />
          </div>
          <span className="font-headline font-bold text-base tracking-[0.12em] uppercase hidden xl:block">Sireyo</span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center h-full gap-2 xl:gap-4 overflow-x-auto justify-center mx-4 custom-scrollbar shrink-0">
          {[
            { icon: LayoutDashboard, label: 'Home', view: 'home' },
            { icon: BarChart3, label: 'Dashboard', view: 'dashboard' },
            { icon: CalendarDays, label: 'Reservations', view: 'reservations' },
          ].map((item) => (
            <TopNavItem 
              key={item.label}
              icon={item.icon} 
              label={item.label} 
              active={currentView === item.view} 
              onClick={() => setCurrentView(item.view as any)} 
              dark={true}
            />
          ))}
        </nav>

        {/* Right: Actions & Profile */}
        <div className="flex items-center justify-end gap-3 xl:gap-4 shrink-0 lg:flex-1">
          <button 
            onClick={() => handleOpenNewBooking()}
            className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-primary text-[#0a0a0a] rounded-full text-[11px] font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            <Plus size={14} strokeWidth={3} />
            New Booking
          </button>

          <div className="relative group hidden xl:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-44 bg-secondary border border-white/5 focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-full pl-9 pr-3 py-1.5 text-xs font-medium text-white placeholder:text-white/30"
            />
          </div>

          <div className="w-px h-7 bg-white/10 hidden lg:block mx-1" />

          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 px-2 py-1 pl-3 bg-transparent border border-white/20 hover:shadow-md transition-all rounded-full hover:bg-white/5"
              >
                <Menu className="w-5 h-5 text-white/80" />
                <div className="relative">
                  <img 
                    src={currentUser.image} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-[#0a0a0a]" />
                </div>
              </button>
              
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute right-0 top-full mt-3 w-64 bg-surface rounded-2xl shadow-xl border border-on-surface/10 overflow-hidden z-50 flex flex-col py-2"
                  >
                    {[
                        { icon: CalendarDays, label: 'Calendar', view: 'calendar' },
                        { icon: MapPin, label: 'Grounds', view: 'grounds' },
                        { icon: Users, label: 'Guests', view: 'guests' },
                        { icon: ShoppingCart, label: 'Rentals', view: 'rentals' },
                        ...(currentUser.role !== 'Staff' ? [{ icon: BarChart3, label: 'Reports', view: 'reports' }] : []),
                        { icon: Settings, label: 'Settings', view: 'settings' },
                    ].map(item => (
                        <button 
                           key={item.label}
                           onClick={() => {
                             setCurrentView(item.view as any);
                             setIsProfileMenuOpen(false);
                           }}
                           className={`flex items-center gap-3 px-5 py-3 text-sm font-medium hover:bg-on-surface/5 transition-colors w-full text-left ${currentView === item.view ? 'text-primary font-bold' : 'text-on-surface/80'}`}
                        >
                           <item.icon size={18} strokeWidth={currentView === item.view ? 2.5 : 2} />
                           {item.label}
                        </button>
                    ))}
                    <div className="border-t border-on-surface/10 my-2" />
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-error hover:bg-error/5 transition-colors w-full text-left"
                    >
                      <LogOut size={18} strokeWidth={2} />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-white/60 hover:text-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 w-80 bg-surface border-r border-on-surface/5 z-50 flex flex-col shadow-2xl lg:hidden"
          >
            <div className="p-6 border-b border-on-surface/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-on-primary font-headline font-bold">S</span>
                </div>
                <span className="font-headline font-medium text-lg">Sireyo</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-surface-container rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
              {[
                { icon: LayoutDashboard, label: 'Home', view: 'home' },
                { icon: BarChart3, label: 'Dashboard', view: 'dashboard' },
                { icon: CalendarDays, label: 'Reservations', view: 'reservations' },
                { icon: CalendarDays, label: 'Calendar', view: 'calendar' },
                { icon: MapPin, label: 'Grounds', view: 'grounds' },
                { icon: Users, label: 'Guests', view: 'guests' },
                { icon: ShoppingCart, label: 'Rentals', view: 'rentals' },
                ...(currentUser.role !== 'Staff' ? [{ icon: BarChart3, label: 'Reports', view: 'reports' }] : []),
                { icon: Settings, label: 'Settings', view: 'settings' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.view) setCurrentView(item.view as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${currentView === item.view ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <item.icon size={20} />
                  <span className="text-xs uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-on-surface/5">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-error bg-error/5 font-bold text-xs uppercase tracking-widest"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNewBookingModalOpen && (
          <NewBookingModal 
            isOpen={isNewBookingModalOpen} 
            onClose={() => setIsNewBookingModalOpen(false)} 
            initialData={modalInitialData}
            accommodations={accommodations}
            onAddBooking={async (data) => {
              const isWalkIn = data.bookingSource === 'WALK_IN';
              const formattedEta = data.eta ? new Date(`1970-01-01T${data.eta}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined;
              
              await createBooking({
                guestName: data.guestName,
                pax: Number(data.pax),
                type: data.type,
                accommodationId: data.roomId,
                isWalkIn,
                checkInDate: data.date,
                eta: formattedEta,
              });

              await loadAccommodations(selectedDate);
              await loadGuests();
              setIsNewBookingModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm"
              onClick={() => setIsLogoutModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface rounded-3xl shadow-2xl border border-white/5 w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut size={28} />
                </div>
                <h3 className="font-headline text-xl text-on-surface mb-2 tracking-tight">Ready to leave?</h3>
                <p className="text-sm text-on-surface-variant/80">
                  Are you sure you want to log out of the Sireyo Dashboard? You will need to log back in to access the system.
                </p>
              </div>
              <div className="p-4 bg-surface-container/50 border-t border-white/5 flex gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsLogoutModalOpen(false);
                    setIsAuthenticated(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20 transition-all"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative z-10 bg-surface/50 backdrop-blur-xl flex flex-col">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              <HomeView />
            </motion.div>
          ) : currentView === 'dashboard' ? (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              <DashboardView onOpenNewBooking={handleOpenNewBooking} accommodations={accommodations} guests={guests} />
            </motion.div>
          ) : currentView === 'reservations' ? (
            <motion.div key="reservations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              <ReservationGrid accommodations={accommodations} onNewBooking={handleOpenNewBooking} onViewGrounds={() => setCurrentView('grounds')} onCheckoutGuest={handleCheckoutGuest} selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </motion.div>
          ) : currentView === 'calendar' ? (
            <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              <CalendarView accommodations={accommodations} />
            </motion.div>
          ) : currentView === 'grounds' ? (
            <motion.div key="grounds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              <GroundsListView guests={guests} onUpdateGuest={handleUpdateGuest} onDeleteGuest={handleDeleteGuest} />
            </motion.div>
          ) : currentView === 'guests' ? (
            <motion.div key="guests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              <GuestListView guests={guests} onUpdateGuest={handleUpdateGuest} onDeleteGuest={handleDeleteGuest} />
            </motion.div>
          ) : currentView === 'rentals' ? (
            <motion.div key="rentals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              <RentalsView />
            </motion.div>
          ) : currentView === 'reports' ? (
            <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              {currentUser.role === 'Staff' ? (
                <div className="flex items-center justify-center h-full flex-col gap-4 text-center">
                  <ShieldCheck size={48} className="text-on-surface-variant/40" />
                  <h2 className="text-xl font-headline font-bold text-on-surface">Access Denied</h2>
                  <p className="text-on-surface-variant text-sm max-w-sm">Your current role tier does not have permission to view performance and financial reports.</p>
                </div>
              ) : (
                <ReportsView />
              )}
            </motion.div>
          ) : currentView === 'settings' ? (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto">
              <SettingsView accommodations={accommodations} onUpdateAccommodation={handleUpdateAccommodation} extensionFees={extensionFees} onUpdateExtensionFee={handleUpdateExtensionFee} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
