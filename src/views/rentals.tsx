import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Check, Plus, Trash2, ShieldCheck, ShoppingCart, X } from 'lucide-react';
import { RentalItem, RentalRecord, FeeItem } from '../types';
import { RENTAL_ITEMS, CORKAGE_FEES, ELECTRICITY_CHARGES, INITIAL_RENTALS } from '../constants';

const NewRentalModal = ({ isOpen, onClose, onAdd, items, initialItemId }: { isOpen: boolean, onClose: () => void, onAdd: (rental: Omit<RentalRecord, 'id' | 'rentedAt'>) => void, items: RentalItem[], initialItemId?: string | null }) => {
  const [guestName, setGuestName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(initialItemId || items[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<'DAYTOUR' | 'OVERNIGHT'>('DAYTOUR');

  const selectedItem = items.find(i => i.id === selectedItemId);
  const totalPrice = selectedItem ? (type === 'DAYTOUR' ? selectedItem.daytourPrice : selectedItem.overnightPrice) * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedItem) return;
    onAdd({ guestName, itemName: selectedItem.name, quantity, type, totalPrice, status: 'Active' });
    onClose();
    setGuestName('');
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-surface w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-on-surface/5">
        <div className="p-8 border-b border-on-surface/5 flex justify-between items-center bg-surface-container-low">
          <div><h3 className="text-2xl font-headline font-medium text-on-surface">New Rental</h3><p className="text-xs text-on-surface-variant mt-1 font-medium tracking-wide uppercase opacity-60">Equipment Issuance</p></div>
          <button onClick={onClose} className="p-2 hover:bg-on-surface/5 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Guest Name</label><input type="text" required value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Enter guest name..." className="w-full bg-surface-container border border-on-surface/5 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Item</label><select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all appearance-none">{items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
            <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Quantity</label><input type="number" min="1" required value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full bg-surface-container border border-on-surface/5 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all" /></div>
          </div>
          <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Rental Type</label><div className="flex gap-2 p-1 bg-surface-container rounded-2xl"><button type="button" onClick={() => setType('DAYTOUR')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'DAYTOUR' ? 'bg-primary text-on-surface shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-on-surface/5'}`}>Daytour</button><button type="button" onClick={() => setType('OVERNIGHT')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'OVERNIGHT' ? 'bg-primary text-on-surface shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-on-surface/5'}`}>Overnight</button></div></div>
          <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex justify-between items-center"><div><p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Total Amount</p><p className="text-2xl font-headline font-medium text-primary">₱{totalPrice.toLocaleString()}</p></div><ShoppingCart className="text-primary opacity-20" size={32} /></div>
          <button type="submit" className="w-full bg-primary text-on-surface py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Confirm Issuance</button>
        </form>
      </motion.div>
    </div>
  );
};

const RentalsView = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'active' | 'fees'>('inventory');
  const [rentals, setRentals] = useState<RentalRecord[]>(INITIAL_RENTALS);
  const [inventory, setInventory] = useState<RentalItem[]>(RENTAL_ITEMS);
  const [corkageFees, setCorkageFees] = useState<FeeItem[]>(CORKAGE_FEES);
  const [electricityCharges, setElectricityCharges] = useState<FeeItem[]>(ELECTRICITY_CHARGES);
  const [isEditingInventory, setIsEditingInventory] = useState(false);
  const [isEditingFees, setIsEditingFees] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preselectedItemId, setPreselectedItemId] = useState<string | null>(null);

  const allIssuableItems: RentalItem[] = [
    ...inventory,
    ...corkageFees.map(f => ({ id: f.id, name: `[Corkage] ${f.name}`, daytourPrice: f.price, overnightPrice: f.price })),
    ...electricityCharges.map(f => ({ id: f.id, name: `[Electricity] ${f.name}`, daytourPrice: f.price, overnightPrice: f.price }))
  ];

  const handleAddRental = (newRental: Omit<RentalRecord, 'id' | 'rentedAt'>) => {
    const record: RentalRecord = { ...newRental, id: `rr-${Date.now()}`, rentedAt: new Date().toISOString() };
    setRentals([record, ...rentals]);
    setActiveTab('active');
  };

  const handleReturn = (id: string) => setRentals(rentals.map(r => r.id === id ? { ...r, status: 'Returned' } : r));
  const openAddModal = (itemId?: string) => { if (itemId) setPreselectedItemId(itemId); setIsModalOpen(true); };
  
  const handleUpdateFee = (type: 'corkage' | 'electricity', id: string, field: keyof FeeItem, value: string | number) => {
    if (type === 'corkage') setCorkageFees(corkageFees.map(f => f.id === id ? { ...f, [field]: value } : f));
    else setElectricityCharges(electricityCharges.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleAddFee = (type: 'corkage' | 'electricity') => {
    const newFee: FeeItem = { id: `${type === 'corkage' ? 'cf' : 'ec'}-${Date.now()}`, name: 'New Item', price: 0 };
    if (type === 'corkage') setCorkageFees([...corkageFees, newFee]);
    else setElectricityCharges([...electricityCharges, newFee]);
  };

  const handleDeleteFee = (type: 'corkage' | 'electricity', id: string) => {
    if (type === 'corkage') setCorkageFees(corkageFees.filter(f => f.id !== id));
    else setElectricityCharges(electricityCharges.filter(f => f.id !== id));
  };

  const handleUpdateInventory = (id: string, field: keyof RentalItem, value: string | number) => setInventory(inventory.map(item => item.id === id ? { ...item, [field]: value } : item));
  const handleAddInventoryItem = () => setInventory([...inventory, { id: `ri-${Date.now()}`, name: 'New Equipment', daytourPrice: 0, overnightPrice: 0 }]);
  const handleDeleteInventoryItem = (id: string) => setInventory(inventory.filter(item => item.id !== id));

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div><h2 className="font-headline font-medium text-4xl lg:text-5xl text-on-surface tracking-tight">Available for Rent</h2><p className="text-on-surface-variant mt-2 font-medium tracking-wide">Manage resort equipment and guest rentals</p></div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 bg-surface-container p-1 rounded-xl">
            <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'inventory' ? 'bg-primary text-on-surface shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-on-surface'}`}>Inventory</button>
            <button onClick={() => setActiveTab('active')} className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'active' ? 'bg-primary text-on-surface shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-on-surface'}`}>Active Rentals</button>
            <button onClick={() => setActiveTab('fees')} className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'fees' ? 'bg-primary text-on-surface shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-on-surface'}`}>Fees & Corkage</button>
          </div>
          {activeTab === 'inventory' ? <button onClick={() => setIsEditingInventory(!isEditingInventory)} className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${isEditingInventory ? 'bg-tertiary text-on-tertiary shadow-lg shadow-tertiary/20' : 'bg-surface-container-highest text-on-surface hover:bg-on-surface/5'}`}>{isEditingInventory ? <Check size={16} /> : <Edit3 size={16} />} {isEditingInventory ? 'Save Changes' : 'Edit Inventory'}</button> : activeTab === 'fees' ? <button onClick={() => setIsEditingFees(!isEditingFees)} className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${isEditingFees ? 'bg-tertiary text-on-tertiary shadow-lg shadow-tertiary/20' : 'bg-surface-container-highest text-on-surface hover:bg-on-surface/5'}`}>{isEditingFees ? <Check size={16} /> : <Edit3 size={16} />} {isEditingFees ? 'Save Changes' : 'Edit Fees'}</button> : <button onClick={() => openAddModal()} className="bg-primary text-on-surface px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-all"><Plus size={16} strokeWidth={3} /> New Rental</button>}
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel overflow-hidden rounded-[2.5rem] border border-on-surface/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead><tr className="bg-surface-container-highest/50 border-b border-on-surface/5"><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Items</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Daytour</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Overnight</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant text-right">Action</th></tr></thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-on-surface/5 hover:bg-on-surface/[0.02] transition-colors group">
                    <td className="px-8 py-4 font-medium text-on-surface">{isEditingInventory ? <input type="text" value={item.name} onChange={(e) => handleUpdateInventory(item.id, 'name', e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none" /> : item.name}</td>
                    <td className="px-8 py-4 text-on-surface-variant font-mono text-sm">{isEditingInventory ? <div className="flex items-center gap-2"><span className="text-xs">₱</span><input type="number" value={item.daytourPrice} onChange={(e) => handleUpdateInventory(item.id, 'daytourPrice', parseInt(e.target.value) || 0)} className="w-24 bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none" /></div> : `₱${item.daytourPrice.toLocaleString()}`}</td>
                    <td className="px-8 py-4 text-on-surface-variant font-mono text-sm">{isEditingInventory ? <div className="flex items-center gap-2"><span className="text-xs">₱</span><input type="number" value={item.overnightPrice} onChange={(e) => handleUpdateInventory(item.id, 'overnightPrice', parseInt(e.target.value) || 0)} className="w-24 bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none" /></div> : `₱${item.overnightPrice.toLocaleString()}`}</td>
                    <td className="px-8 py-4 text-right">{isEditingInventory ? <button onClick={() => handleDeleteInventoryItem(item.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"><Trash2 size={18} /></button> : <button onClick={() => openAddModal(item.id)} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all duration-300 hover:scale-110"><Plus size={18} /></button>}</td>
                  </tr>
                ))}
                {isEditingInventory && <tr><td colSpan={4} className="px-8 py-4 text-center"><button onClick={handleAddInventoryItem} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-2 mx-auto"><Plus size={14} /> Add New Equipment</button></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-surface-container-highest/30 border-t border-on-surface/5"><div className="flex gap-4 items-start"><div className="p-2 bg-primary/10 rounded-lg text-primary"><ShieldCheck size={20} /></div><p className="text-xs text-on-surface-variant leading-relaxed max-w-3xl"><span className="font-bold text-primary uppercase tracking-widest mr-2">Security Deposit Required:</span> A security deposit is required before renting the items. It helps cover any loss, damage, late returns, or missing parts. The deposit will be refunded once the items are returned in good condition and on time.</p></div></div>
        </motion.div>
      ) : activeTab === 'active' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel overflow-hidden rounded-[2.5rem] border border-on-surface/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead><tr className="bg-surface-container-highest/50 border-b border-on-surface/5"><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Guest</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Item</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Qty</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Total</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Status</th><th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant text-right">Action</th></tr></thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id} className="border-b border-on-surface/5 hover:bg-on-surface/[0.02] transition-colors">
                    <td className="px-8 py-5"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">{rental.guestName.charAt(0)}</div><span className="font-medium text-on-surface">{rental.guestName}</span></div></td>
                    <td className="px-8 py-5 text-on-surface-variant">{rental.itemName}</td>
                    <td className="px-8 py-5 text-on-surface-variant">{rental.quantity}</td>
                    <td className="px-8 py-5 text-on-surface-variant font-mono text-sm">₱{rental.totalPrice.toLocaleString()}</td>
                    <td className="px-8 py-5"><span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${rental.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-on-surface/10 text-on-surface-variant'}`}>{rental.status}</span></td>
                    <td className="px-8 py-5 text-right">{rental.status === 'Active' && <button onClick={() => handleReturn(rental.id)} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline transition-all">Return Item</button>}</td>
                  </tr>
                ))}
                {rentals.length === 0 && <tr><td colSpan={6} className="px-8 py-20 text-center"><div className="flex flex-col items-center gap-4 opacity-30"><ShoppingCart size={48} strokeWidth={1} /><p className="text-sm font-medium">No active rentals found</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-on-surface/5">
            <div className="p-8 border-b border-on-surface/5 bg-surface-container-highest/30 flex justify-between items-center"><div><h3 className="text-xl font-headline font-medium text-on-surface">Corkage Fees</h3><p className="text-xs text-on-surface-variant mt-1 font-medium tracking-wide">Outside services and equipment</p></div>{isEditingFees && <button onClick={() => handleAddFee('corkage')} className="p-2 bg-primary/10 text-primary rounded-lg hover:scale-110 transition-all"><Plus size={18} /></button>}</div>
            <div className="divide-y divide-on-surface/5">
              {corkageFees.map((fee) => (
                <div key={fee.id} className="p-6 flex justify-between items-start hover:bg-on-surface/[0.02] transition-colors group">
                  <div className="flex-1 mr-4">{isEditingFees ? <div className="space-y-2"><input type="text" value={fee.name} onChange={(e) => handleUpdateFee('corkage', fee.id, 'name', e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none" /><input type="text" value={fee.note || ''} placeholder="Note (optional)" onChange={(e) => handleUpdateFee('corkage', fee.id, 'note', e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-[10px] focus:ring-1 focus:ring-primary outline-none" /></div> : <><p className="font-medium text-on-surface text-sm">{fee.name}</p>{fee.note && <p className="text-[10px] text-on-surface-variant mt-1 italic">{fee.note}</p>}</>}</div>
                  <div className="flex items-center gap-4">{isEditingFees ? <div className="flex items-center gap-2"><span className="text-xs text-on-surface-variant">₱</span><input type="number" value={fee.price} onChange={(e) => handleUpdateFee('corkage', fee.id, 'price', parseInt(e.target.value) || 0)} className="w-24 bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-sm font-mono focus:ring-1 focus:ring-primary outline-none" /><button onClick={() => handleDeleteFee('corkage', fee.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"><Trash2 size={16} /></button></div> : <><p className="font-mono text-sm text-primary font-bold">₱{fee.price.toLocaleString()}</p><button onClick={() => openAddModal(fee.id)} className="p-2 bg-primary/10 text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><Plus size={14} /></button></>}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-on-surface/5">
            <div className="p-8 border-b border-on-surface/5 bg-surface-container-highest/30 flex justify-between items-center"><div><h3 className="text-xl font-headline font-medium text-on-surface">Electricity Charges</h3><p className="text-xs text-on-surface-variant mt-1 font-medium tracking-wide">Usage fees for personal appliances</p></div>{isEditingFees && <button onClick={() => handleAddFee('electricity')} className="p-2 bg-primary/10 text-primary rounded-lg hover:scale-110 transition-all"><Plus size={18} /></button>}</div>
            <div className="divide-y divide-on-surface/5">
              {electricityCharges.map((fee) => (
                <div key={fee.id} className="p-6 flex justify-between items-start hover:bg-on-surface/[0.02] transition-colors group">
                  <div className="flex-1 mr-4">{isEditingFees ? <div className="space-y-2"><input type="text" value={fee.name} onChange={(e) => handleUpdateFee('electricity', fee.id, 'name', e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none" /><input type="text" value={fee.note || ''} placeholder="Note (optional)" onChange={(e) => handleUpdateFee('electricity', fee.id, 'note', e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-[10px] focus:ring-1 focus:ring-primary outline-none" /></div> : <><p className="font-medium text-on-surface text-sm">{fee.name}</p>{fee.note && <p className="text-[10px] text-on-surface-variant mt-1 italic">{fee.note}</p>}</>}</div>
                  <div className="flex items-center gap-4">{isEditingFees ? <div className="flex items-center gap-2"><span className="text-xs text-on-surface-variant">₱</span><input type="number" value={fee.price} onChange={(e) => handleUpdateFee('electricity', fee.id, 'price', parseInt(e.target.value) || 0)} className="w-24 bg-surface-container border border-on-surface/5 rounded-lg px-3 py-1.5 text-sm font-mono focus:ring-1 focus:ring-primary outline-none" /><button onClick={() => handleDeleteFee('electricity', fee.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"><Trash2 size={16} /></button></div> : <><p className="font-mono text-sm text-primary font-bold">₱{fee.price.toLocaleString()}</p><button onClick={() => openAddModal(fee.id)} className="p-2 bg-primary/10 text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><Plus size={14} /></button></>}</div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-surface-container-highest/30 border-t border-on-surface/5"><p className="text-[10px] text-on-surface-variant leading-relaxed italic">* Extension cords are available upon request and subject to availability.<br/>* Some appliances or equipment may be restricted or subject to approval.</p></div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isModalOpen && <NewRentalModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setPreselectedItemId(null); }} onAdd={handleAddRental} items={allIssuableItems} initialItemId={preselectedItemId} />}
      </AnimatePresence>
    </div>
  );
};

export default RentalsView;
