import React, { useState } from 'react';
import { 
  Droplet, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Award, 
  Check, 
  Clock, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

export const DonorCard = ({ donor, onToggleAvailability, onContactWhatsApp }) => {
  const [loadingToggle, setLoadingToggle] = useState(false);

  // 90-day cooldown calculation
  const getEligibility = () => {
    if (!donor.lastDonationDate) return { isEligible: true, daysRemaining: 0, text: 'Immediately Eligible' };
    const diff = (Date.now() - new Date(donor.lastDonationDate).getTime()) / (1000 * 3600 * 24);
    const daysSince = Math.floor(diff);
    if (daysSince >= 90) {
      return { isEligible: true, daysRemaining: 0, text: `Eligible (Donated ${daysSince}d ago)` };
    }
    const daysRemaining = 90 - daysSince;
    return { isEligible: false, daysRemaining, text: `Cooldown: ${daysRemaining} days left` };
  };

  const eligibility = getEligibility();

  const handleToggle = async () => {
    setLoadingToggle(true);
    await onToggleAvailability(donor._id);
    setLoadingToggle(false);
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-sm hover:shadow-md ${
      donor.isAvailable ? 'border-slate-200 hover:border-rose-300' : 'border-slate-200 bg-slate-50/50 opacity-80'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Blood Group Badge */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center shadow-md shadow-red-600/30">
              <span className="text-lg font-black leading-none">{donor.bloodGroup}</span>
              <span className="text-[10px] font-semibold text-rose-200">Blood</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{donor.fullName}</h3>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{donor.city}, {donor.district}</span>
              </p>
            </div>
          </div>

          {/* Availability Toggle Button */}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleToggle}
              disabled={loadingToggle}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                donor.isAvailable
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title="Click to toggle availability status"
            >
              <span className={`w-2 h-2 rounded-full ${donor.isAvailable ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'}`}></span>
              <span>{donor.isAvailable ? 'Available' : 'Resting'}</span>
            </button>
            <span className="text-[10px] text-slate-400 font-medium">Click to toggle</span>
          </div>
        </div>

        {/* Verification & Eligibility status */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <VerificationBadge status={donor.isVerified} org={donor.verifiedBy} />
          
          <div className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${
            eligibility.isEligible ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{eligibility.text}</span>
          </div>
        </div>

        {/* Donor stats & notes */}
        <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Verified Past Donations:</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              {donor.donationCount} Lives Helped
            </span>
          </div>
          {donor.notes && (
            <p className="text-[11px] text-slate-500 italic">"{donor.notes}"</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <a
            href={`tel:${donor.phone}`}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-600" />
            <span>Call</span>
          </a>

          <button
            onClick={() => onContactWhatsApp(donor)}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
