import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const VerificationBadge = ({ status, org, size = 'sm' }) => {
  const isLarge = size === 'md';

  if (status === 'VERIFIED_HOSPITAL' || status === true) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 ${isLarge ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'}`}>
        <ShieldCheck className={isLarge ? "w-4 h-4 text-emerald-600" : "w-3.5 h-3.5 text-emerald-600"} />
        <span>Hospital Verified {org ? `• ${org}` : ''}</span>
      </span>
    );
  }

  if (status === 'COMMUNITY_VERIFIED') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border border-blue-200 bg-blue-50 text-blue-800 ${isLarge ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'}`}>
        <CheckCircle2 className={isLarge ? "w-4 h-4 text-blue-600" : "w-3.5 h-3.5 text-blue-600"} />
        <span>Community Verified {org ? `• ${org}` : ''}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border border-amber-200 bg-amber-50 text-amber-800 ${isLarge ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'}`}>
      <Clock className={isLarge ? "w-4 h-4 text-amber-600" : "w-3.5 h-3.5 text-amber-600"} />
      <span>Pending Verification</span>
    </span>
  );
};
