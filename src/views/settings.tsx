import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Bed, Clock, Users, ShieldCheck, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { Accommodation, ExtensionFee } from '../types';
import { getAccommodationIcon } from '../components/ReservationGrid';

export const SettingsView = ({ accommodations, onUpdateAccommodation, extensionFees, onUpdateExtensionFee, onAddExtensionFee }: { accommodations: Accommodation[], onUpdateAccommodation: (id: string, field: keyof Accommodation, value: any) => void, extensionFees: ExtensionFee[], onUpdateExtensionFee: (id: string, field: keyof ExtensionFee, value: any) => void, onAddExtensionFee: () => void }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Staff');

  const [generalSettings, setGeneralSettings] = useState(() => {
    const saved = localStorage.getItem('sireyo_general_settings');
    return saved ? JSON.parse(saved) : {
      resortName: 'Sireyo Sanctuary',
      location: 'Pagbilao, Quezon',
      contactEmail: 'hello@sireyo.com',
      phoneNumber: '+63 912 345 6789',
      daytourCheckIn: '08:00',
      overnightCheckIn: '18:00'
    };
  });

  const handleSaveGeneral = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call / save to backend
    setTimeout(() => {
      localStorage.setItem('sireyo_general_settings', JSON.stringify(generalSettings));
      setIsSaving(false);
      setSaveSuccess(true);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const [staff, setStaff] = useState([
    { id: 1, name: 'Admin Profile', role: 'Superuser', status: 'Active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz2UAMi04y7mGJ4qD0h80UPXBtMSkJUjzSrUBsdmS72a34kUlCfttHkal0XZWnFI8C422eTCdr42Bajn7A3z_xbEXSOZxzQExXK-gKK7oLRFxkp2LdIrQI352JTAsphccxzbFgTfKhm8yTFhpdE7iECU8pCt7-4OdUCE4AAMLjwy_zaaru2JkB6wOpvVCSlEtnthG5wUXZg3oS-KPawJy4he08ktbrDDERIMkoM03nL2ChEhSJDAoEQ25hhPhECBeNDdZ--zRiYj73' }
  ]);

  const handleInviteStaff = () => {
    if (!newStaffName.trim() || !newStaffUsername.trim() || !newStaffPassword.trim()) return;
    const newStaff = {
      id: Date.now(),
      name: newStaffName,
      username: newStaffUsername,
      role: newStaffRole,
      status: 'Active',
      image: 'https://i.pravatar.cc/150?u=' + Date.now()
    };
    setStaff([...staff, newStaff]);
    setIsInviteModalOpen(false);
    setNewStaffName('');
    setNewStaffUsername('');
    setNewStaffPassword('');
    setNewStaffRole('Staff');
  };

  const handleRemoveStaff = (id: number) => {
    if (staff.length > 1) {
       setStaff(staff.filter(s => s.id !== id));
    } else {
       alert("Cannot remove the last superuser.");
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'accommodations', label: 'Accommodations', icon: Bed },
    { id: 'extension-fees', label: 'Extension Fees', icon: Clock },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8 lg:mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <h2 className="font-headline font-medium text-3xl lg:text-5xl text-on-surface tracking-tight">System Settings</h2>
          <p className="text-on-surface-variant font-medium mt-2 tracking-wide text-xs lg:text-base">Configure your sanctuary's operational parameters</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-primary text-on-surface font-bold shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container'}`}>
              <tab.icon size={18} /><span className="text-xs uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-9 glass-panel p-8 lg:p-12 rounded-[2.5rem] border border-on-surface/5 shadow-xl min-h-[600px]">
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div>
                <h3 className="text-xl font-headline font-medium text-on-surface mb-6">Resort Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Resort Name</label><input type="text" value={generalSettings.resortName} onChange={e => setGeneralSettings({...generalSettings, resortName: e.target.value})} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Location</label><input type="text" value={generalSettings.location} onChange={e => setGeneralSettings({...generalSettings, location: e.target.value})} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Contact Email</label><input type="email" value={generalSettings.contactEmail} onChange={e => setGeneralSettings({...generalSettings, contactEmail: e.target.value})} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Phone Number</label><input type="text" value={generalSettings.phoneNumber} onChange={e => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all" /></div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-headline font-medium text-on-surface mb-6">Operational Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Daytour Check-in</label><input type="time" value={generalSettings.daytourCheckIn} onChange={e => setGeneralSettings({...generalSettings, daytourCheckIn: e.target.value})} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Overnight Check-in</label><input type="time" value={generalSettings.overnightCheckIn} onChange={e => setGeneralSettings({...generalSettings, overnightCheckIn: e.target.value})} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all" /></div>
                </div>
              </div>
              <div className="pt-6 border-t border-on-surface/5 flex items-center justify-end gap-4">
                {saveSuccess && <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-xs font-bold text-primary uppercase tracking-widest">Settings Saved!</motion.span>}
                <button onClick={handleSaveGeneral} disabled={isSaving} className={`px-8 py-3 bg-primary text-on-surface rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all ${isSaving ? 'opacity-70 cursor-wait' : ''}`}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'accommodations' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-headline font-medium text-on-surface">Unit Management</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"><Plus size={14} /> Add New Unit</button>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {accommodations.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-on-surface/5 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-surface-container-highest rounded-xl text-primary shrink-0">{getAccommodationIcon(acc.name, 18)}</div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1"><label className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/40">Unit Name</label><input type="text" value={acc.name} onChange={(e) => onUpdateAccommodation(acc.id, 'name', e.target.value)} className="w-full bg-transparent border-none p-0 text-sm font-bold text-on-surface focus:ring-0" /></div>
                        <div className="space-y-1"><label className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/40">Capacity</label><input type="text" value={acc.capacity} onChange={(e) => onUpdateAccommodation(acc.id, 'capacity', e.target.value)} className="w-full bg-transparent border-none p-0 text-[10px] text-on-surface-variant/60 uppercase tracking-widest focus:ring-0" /></div>
                        <div className="space-y-1"><label className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/40">Location</label><input type="text" value={acc.location} onChange={(e) => onUpdateAccommodation(acc.id, 'location', e.target.value)} className="w-full bg-transparent border-none p-0 text-[10px] text-on-surface-variant/60 uppercase tracking-widest focus:ring-0" /></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4"><button className="p-2 text-on-surface-variant hover:text-error transition-colors"><Trash2 size={16} /></button></div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'extension-fees' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-headline font-medium text-on-surface">Extension Fees</h3>
                  <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-widest">Manage additional stay charges</p>
                </div>
                <button
                  onClick={onAddExtensionFee}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="overflow-x-auto -mx-8 lg:-mx-12 px-8 lg:px-12">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-on-surface/5">
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Accommodation</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 text-center">Per Hour</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 text-center">Day Tour (Extended Until 10:00 PM)</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 text-center">Overnight (Extended Until 4:00 PM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-on-surface/5">
                    {extensionFees.map((fee) => (
                      <tr key={fee.id} className="group hover:bg-surface-container/30 transition-colors">
                        <td className="py-4"><div className="flex flex-col"><span className="text-sm font-bold text-on-surface">{fee.accommodation}</span>{fee.note && <span className="text-[9px] text-on-surface-variant/60 italic">{fee.note}</span>}</div></td>
                        <td className="py-4"><div className="flex items-center justify-center gap-1">{fee.perHour !== null ? <><span className="text-xs text-on-surface-variant">₱</span><input type="number" value={fee.perHour} onChange={(e) => onUpdateExtensionFee(fee.id, 'perHour', parseInt(e.target.value) || 0)} className="w-16 bg-transparent border-none p-0 text-sm font-mono text-center focus:ring-0 font-bold" /></> : <span className="text-on-surface-variant/30">—</span>}</div></td>
                        <td className="py-4"><div className="flex items-center justify-center gap-1"><span className="text-xs text-on-surface-variant">₱</span><input type="number" value={fee.dayTourExtension} onChange={(e) => onUpdateExtensionFee(fee.id, 'dayTourExtension', parseInt(e.target.value) || 0)} className="w-20 bg-transparent border-none p-0 text-sm font-mono text-center focus:ring-0 font-bold" /></div></td>
                        <td className="py-4"><div className="flex items-center justify-center gap-1"><span className="text-xs text-on-surface-variant">₱</span><input type="number" value={fee.overnightExtension} onChange={(e) => onUpdateExtensionFee(fee.id, 'overnightExtension', parseInt(e.target.value) || 0)} className="w-20 bg-transparent border-none p-0 text-sm font-mono text-center focus:ring-0 font-bold" /></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-headline font-medium text-on-surface">Staff & Permissions</h3>
                <button 
                  onClick={() => setIsInviteModalOpen(true)} 
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  <UserPlus size={14} />Invite Staff
                </button>
              </div>
              <div className="space-y-4">
                {staff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-on-surface/5 group transition-all hover:bg-surface-container-highest cursor-pointer">
                    <div className="flex items-center gap-4">
                      <img src={member.image} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover" alt={member.name} />
                      <div>
                        <p className="text-sm font-bold text-on-surface">{member.name}</p>
                        <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleRemoveStaff(member.id); }} 
                         className="text-error opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-error/10 hover:rounded-full"
                         title="Remove Staff"
                       >
                         <Trash2 size={16} />
                       </button>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${member.status === 'Active' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary/10 text-secondary'}`}>
                          {member.status}
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h3 className="text-xl font-headline font-medium text-on-surface mb-6">Security Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-surface-container rounded-2xl border border-on-surface/5">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Two-Factor Authentication</p>
                      <p className="text-xs text-on-surface-variant/60 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer" onClick={() => alert("2FA settings will be available soon.")}>
                      <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-surface-container rounded-2xl border border-on-surface/5">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Session Timeout</p>
                      <p className="text-xs text-on-surface-variant/60 mt-1">Automatically log out after inactivity</p>
                    </div>
                    <select className="bg-surface-container-highest border border-on-surface/5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest">
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>4 Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-container-low border border-on-surface/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsInviteModalOpen(false)} className="absolute top-4 right-4 p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"><X size={20} /></button>
            <h3 className="text-xl font-headline font-medium text-on-surface mb-6">Invite New Staff</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Staff Name</label>
                <input type="text" placeholder="John Doe" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all font-medium placeholder:text-on-surface-variant/30" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Username</label>
                <input type="text" placeholder="johndoe" value={newStaffUsername} onChange={e => setNewStaffUsername(e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all font-medium placeholder:text-on-surface-variant/30" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Password</label>
                <input type="password" placeholder="••••••••" value={newStaffPassword} onChange={e => setNewStaffPassword(e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all font-medium placeholder:text-on-surface-variant/30" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Role</label>
                <select value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)} className="w-full bg-surface-container border border-on-surface/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 transition-all font-medium appearance-none">
                  <option value="Staff">Staff</option>
                  <option value="Manager">Manager</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setIsInviteModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-all">Cancel</button>
              <button 
                onClick={handleInviteStaff} 
                disabled={!newStaffName.trim() || !newStaffUsername.trim() || !newStaffPassword.trim()} 
                className="px-6 py-3 bg-primary text-on-surface rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
