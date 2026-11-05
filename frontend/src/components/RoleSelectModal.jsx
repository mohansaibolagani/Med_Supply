import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Droplet, 
  Stethoscope, 
  ShieldAlert, 
  MapPin, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export const RoleSelectModal = ({ onSelectRole }) => {
  const { showRoleModal, setShowRoleModal, selectPersona, activePersona } = useAuth();
  const { requestLocation, locationStatus, detectedCity, detectedDistrict, coordinates } = useLocation();
  const [requestingLoc, setRequestingLoc] = useState(false);

  if (!showRoleModal) return null;

  const handleChoose = (role, defaultTab) => {
    selectPersona(role);
    if (onSelectRole) onSelectRole(role, defaultTab);
  };

  const handleDetectLocation = async () => {
    setRequestingLoc(true);
    try {
      await requestLocation();
    } catch (e) {
      console.warn('Location detection skipped or denied.');
    } finally {
      setRequestingLoc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close / Skip button */}
        <button
          onClick={() => setShowRoleModal(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Continue without selecting"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-slate-900 p-8 text-white text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-rose-200 bg-white/10 px-3 py-1 rounded-full mb-2">
            Welcome to MedSupply
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Who are you today?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-md mx-auto mt-1 leading-relaxed">
            Please choose your role so we can personalize your emergency exchange experience and show relevant tools.
          </p>
        </div>

        {/* Body Cards */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Location Access Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {detectedCity ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span>Location Detected:</span> <strong>{detectedCity}, {detectedDistrict}</strong>
                    </span>
                  ) : (
                    'Enable Location Access'
                  )}
                </p>
                <p className="text-[11px] text-slate-500">
                  {detectedCity 
                    ? 'Nearest blood donors and emergency equipment prioritized.'
                    : 'Permit browser GPS to auto-filter donors & hospitals near you.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={requestingLoc || locationStatus === 'granted'}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                locationStatus === 'granted'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/30'
              }`}
            >
              {requestingLoc ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Detecting...</span>
                </>
              ) : locationStatus === 'granted' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>GPS Active</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  <span>Allow GPS</span>
                </>
              )}
            </button>
          </div>

          {/* 3 Main Role Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Role 1: Blood Donor */}
            <div
              onClick={() => handleChoose('donor', 'donors')}
              className="group cursor-pointer rounded-2xl border-2 border-slate-200 hover:border-red-500 bg-white hover:bg-rose-50/50 p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 hover:scale-[1.02]"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 group-hover:scale-110 transition-transform">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-red-700">
                    Blood Donor
                  </h3>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mt-0.5">
                    Save Lives Locally
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Register availability, track my 90-day cooldown, and answer critical hospital emergency calls.
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-bold text-red-600 group-hover:text-red-700">
                <span>Continue as Donor</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Role 2: Equipment Provider */}
            <div
              onClick={() => handleChoose('provider', 'equipment')}
              className="group cursor-pointer rounded-2xl border-2 border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/50 p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 hover:scale-[1.02]"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-700">
                    Equipment Provider
                  </h3>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
                    Rent / Lend Home Care
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  List oxygen concentrators, wheelchairs, or CPAP units, manage rental terms, and track return dates.
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-bold text-teal-600 group-hover:text-teal-700">
                <span>Continue as Provider</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Role 3: Patient / Requester */}
            <div
              onClick={() => handleChoose('patient', 'emergency')}
              className="group cursor-pointer rounded-2xl border-2 border-slate-200 hover:border-rose-500 bg-white hover:bg-red-50/50 p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 hover:scale-[1.02]"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/30 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-red-700">
                    Patient / Attendant
                  </h3>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mt-0.5">
                    Emergency Help
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Urgent blood transfusion or medical rental needed for a patient. Post an emergency broadcast now.
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-bold text-rose-600 group-hover:text-rose-700">
                <span>Continue as Patient</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
