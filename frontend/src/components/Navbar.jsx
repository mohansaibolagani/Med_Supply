import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Droplet, 
  Stethoscope, 
  LayoutDashboard, 
  UserCheck, 
  Menu, 
  X, 
  ShieldAlert, 
  Flame, 
  MapPin, 
  Compass, 
  LogIn, 
  UserPlus, 
  LogOut, 
  ChevronDown,
  User,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenEmergencyModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout, activePersona, setShowRoleModal } = useAuth();
  const { detectedCity, detectedDistrict, requestLocation, locationStatus } = useLocation();

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'emergency', label: 'Emergency Feed', icon: Flame, isUrgent: true },
    { id: 'donors', label: 'Blood Donors', icon: Droplet },
    { id: 'equipment', label: 'Urgent Equipment', icon: Stethoscope },
    { id: 'dashboard', label: 'Dashboard & Returns', icon: LayoutDashboard }
  ];

  const getPersonaLabel = () => {
    switch (activePersona) {
      case 'donor':
        return { text: 'Blood Donor', color: 'bg-red-50 text-red-700 border-red-200' };
      case 'provider':
        return { text: 'Equipment Provider', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'patient':
        return { text: 'Emergency Patient', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { text: 'Select Role', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const persona = getPersonaLabel();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      {/* Top emergency announcement bar */}
      <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white text-xs py-1.5 px-4 font-medium shadow-inner">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span><strong>Urgent Medical Network:</strong> 108 Emergency Ambulance & Blood Dispatch Integration Active</span>
          </div>

          {/* Location status trigger in top bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={requestLocation}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold transition-colors"
              title="Click to detect current location"
            >
              <MapPin className="w-3 h-3 text-rose-200" />
              <span>{detectedCity ? `${detectedCity}, ${detectedDistrict}` : '📍 Detect My Location'}</span>
            </button>
            <span className="hidden sm:inline text-rose-200">•</span>
            <span className="hidden sm:inline text-rose-100 text-[11px]">NTR & Guntur Districts</span>
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
          <nav className="hidden lg:flex items-center gap-1">
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

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Persona Switcher Pill */}
            <button
              onClick={() => setShowRoleModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all hover:shadow-sm ${persona.color}`}
              title="Click to change your persona (Donor / Provider / Patient)"
            >
              <span>I am: <strong>{persona.text}</strong></span>
              <span className="text-[10px] underline ml-1 text-slate-400 hover:text-slate-700">Switch</span>
            </button>

            {/* SOS Emergency Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>Post SOS</span>
            </button>

            {/* User Auth: Sign In / Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-bold text-slate-800 transition-colors shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => { handleNavClick('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>My Dashboard & Returns</span>
                    </button>

                    <button
                      onClick={() => { setShowRoleModal(true); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Switch Active Persona</span>
                    </button>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('auth_login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleNavClick('auth_signup')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all hover:scale-[1.02]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          {/* Persona selector in mobile */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span>Role: <strong>{persona.text}</strong></span>
            <button
              onClick={() => { setShowRoleModal(true); setMobileMenuOpen(false); }}
              className="font-bold text-red-600 underline text-[11px]"
            >
              Change
            </button>
          </div>

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

          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 rounded-xl"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavClick('auth_login')}
                  className="flex-1 py-2 text-xs font-bold border border-slate-300 rounded-xl text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('auth_signup')}
                  className="flex-1 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl text-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
