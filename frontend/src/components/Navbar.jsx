import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Activity, 
  Droplet, 
  Stethoscope, 
  LayoutDashboard, 
  PlusCircle, 
  UserCheck, 
  Menu, 
  X, 
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenEmergencyModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const { user, logout, loginAsDemo } = useAuth();

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'emergency', label: 'Emergency Feed', icon: Flame, isUrgent: true },
    { id: 'donors', label: 'Blood Donors', icon: Droplet },
    { id: 'equipment', label: 'Urgent Equipment', icon: Stethoscope },
    { id: 'dashboard', label: 'Dashboard & Returns', icon: LayoutDashboard },
    { id: 'workload', label: 'Team Workload Split', icon: Award }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      {/* Top emergency announcement bar */}
      <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between shadow-inner">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span><strong>Urgent Medical Network:</strong> 108 Emergency Ambulance & Blood Dispatch Integration Active</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-rose-100">
            <span>Direct WhatsApp SOS Hooks Enabled</span>
            <span>•</span>
            <span>NTR & Guntur Districts Corridor</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Med<span className="text-red-600">Supply</span></span>
                <span className="bg-red-100 text-red-700 font-bold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">Exchange</span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-1 font-medium">Local Blood & Equipment Network</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-50 text-red-700 shadow-sm border border-rose-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : item.isUrgent ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.isUrgent && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* SOS Emergency Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>Post Emergency SOS</span>
            </button>

            {/* Quick Demo Switcher / User Profile */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold bg-white transition-all shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{user ? user.name.split(' ')[0] : 'Demo Roles'}</span>
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fast Demo Accounts (1-Click)</p>
                  </div>
                  <button
                    onClick={() => { loginAsDemo('patient@medsupply.org'); setDemoDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Emergency Requester</p>
                      <p className="text-[10px] text-slate-500">patient@medsupply.org</p>
                    </div>
                    <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold">Patient</span>
                  </button>
                  <button
                    onClick={() => { loginAsDemo('donor@medsupply.org'); setDemoDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Dr. Suresh Varma (O-)</p>
                      <p className="text-[10px] text-slate-500">Universal Donor</p>
                    </div>
                    <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold">Donor</span>
                  </button>
                  <button
                    onClick={() => { loginAsDemo('equipment@medsupply.org'); setDemoDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Vaidya Diagnostic Trust</p>
                      <p className="text-[10px] text-slate-500">Oxygen & CPAP Center</p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Provider</span>
                  </button>
                  {user && (
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => { logout(); setDemoDropdownOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-semibold"
                      >
                        Sign Out ({user.name})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenEmergencyModal}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
            >
              SOS
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive ? 'bg-rose-50 text-red-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => { loginAsDemo('donor@medsupply.org'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg text-center"
            >
              Demo: Donor
            </button>
            <button
              onClick={() => { loginAsDemo('equipment@medsupply.org'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg text-center"
            >
              Demo: Provider
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
