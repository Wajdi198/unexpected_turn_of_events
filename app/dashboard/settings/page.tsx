'use client';

import React, { useState, useEffect } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopBar } from '@/components/dashboard/TopBar';
import { 
  User, Shield, Bell, Info, Globe, Mail, 
  Lock, Check, ExternalLink, Github
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    critical: true,
    weekly: true,
    uploads: false,
    security: true
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('ucariq_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'network', name: 'Network', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'about', name: 'About', icon: Info },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Settings" subtitle="Manage your UCARiq preferences" />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-2xl border border-slate-800 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab.id 
                      ? "bg-slate-800 text-indigo-400 shadow-lg" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <tab.icon size={16} />
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 space-y-8">
                
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6 pb-8 border-b border-slate-800">
                      <div className={cn(
                        "w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl",
                        user?.bgColor || 'bg-indigo-600'
                      )}>
                        {user?.initials || 'SB'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{user?.name || 'Pr. Sami Ben Naceur'}</h3>
                        <p className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em]">{user?.role || 'Rectorate · UCAR'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 text-slate-500 italic">
                          <Mail size={16} />
                          {user?.name?.toLowerCase().replace(' ', '.') || 'sami.bn'}@ucar.tn
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Language</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>Français (Default)</option>
                          <option>English</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all active:scale-95">
                        Save Profile
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'network' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-lg font-bold text-white">Network Permissions</h3>
                       <p className="text-sm text-slate-500">Your account has authorized access to the following institutions.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                       {[
                         { name: 'ENIT', access: 'Full Access', color: 'text-emerald-400' },
                         { name: 'INSAT', access: 'Full Access', color: 'text-emerald-400' },
                         { name: 'IHEC', access: 'Read Only', color: 'text-slate-500' },
                         { name: 'SUPCOM', access: 'Read Only', color: 'text-slate-500' },
                         { name: 'ESPRIT (Affiliate)', access: 'Restricted', color: 'text-amber-500' },
                       ].map((inst, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all">
                            <div className="flex items-center gap-3">
                               <Globe size={16} className="text-slate-600" />
                               <span className="text-sm font-bold text-slate-200">{inst.name}</span>
                            </div>
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", inst.color)}>{inst.access}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                       {[
                         { id: 'critical', title: 'Critical Alert Emails', desc: 'Get notified instantly when a critical anomaly is detected.' },
                         { id: 'weekly', title: 'Weekly Executive Brief', desc: 'Receive the network-wide performance summary every Monday.' },
                         { id: 'uploads', title: 'Document Upload Alerts', desc: 'Notify me when deans upload new institutional documents.' },
                         { id: 'security', title: 'Security & Access Logs', desc: 'Real-time logging of all data access and exports.' },
                       ].map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                            <div className="space-y-0.5">
                               <div className="text-sm font-bold text-slate-200">{item.title}</div>
                               <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={notifications[item.id as keyof typeof notifications]}
                                onChange={() => setNotifications({...notifications, [item.id]: !notifications[item.id as keyof typeof notifications]})}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                         </div>
                       ))}
                    </div>
                    <div className="pt-4">
                      <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all active:scale-95">
                        Update Preferences
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-12 text-center py-8">
                     <div className="space-y-4">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                           <Shield size={40} className="text-indigo-400" />
                        </div>
                        <h2 className="text-4xl font-black text-white leading-none">UCAR<span className="text-indigo-500">iq</span></h2>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.3em]">Version 1.0 (MVP)</p>
                     </div>

                     <div className="max-w-md mx-auto space-y-6">
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Built for the <strong>HACK4UCAR 2025</strong> hackathon. 
                          Empowering the University of Carthage with modern data intelligence and AI reasoning.
                        </p>
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center gap-4">
                           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Team</div>
                           <div className="text-sm font-bold text-white italic">Unexpected Turn of Events</div>
                        </div>
                     </div>

                     <div className="flex items-center justify-center gap-6 pt-8 border-t border-slate-800">
                        <a href="#" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                           <Github size={16} />
                           Source Code
                        </a>
                        <a href="#" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                           <ExternalLink size={16} />
                           UCAR Official
                        </a>
                     </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
