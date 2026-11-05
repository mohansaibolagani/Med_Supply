import React from 'react';
import { 
  AlertCircle, 
  MapPin, 
  Building2, 
  User, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Droplet, 
  Stethoscope,
  Share2,
  ExternalLink
} from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

export const EmergencyFeedCard = ({ request, onResolve, onOpenWhatsAppModal }) => {
  const isCritical = request.urgencyLevel === 'CRITICAL';
  const isHigh = request.urgencyLevel === 'HIGH';
  const isBlood = request.requestType === 'blood';
  const isFulfilled = request.status === 'FULFILLED';

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60);
    if (diff < 60) return `${Math.floor(diff)}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getUrgencyBadge = () => {
    if (isCritical) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white animate-pulse shadow-sm shadow-red-500/50">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          CRITICAL • REQ &lt; {request.requiredWithinHours}H
        </span>
      );
    }
    if (isHigh) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
          HIGH PRIORITY • REQ &lt; {request.requiredWithinHours}H
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
        MODERATE • 24H
      </span>
    );
  };

  return (
    <div className={`relative rounded-2xl bg-white border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
      isFulfilled
        ? 'opacity-70 border-slate-200 bg-slate-50/60'
        : isCritical
        ? 'border-red-300 ring-2 ring-red-500/20 hover:border-red-400'
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Top Banner */}
      <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-2 ${
        isFulfilled ? 'bg-slate-100' : isCritical ? 'bg-gradient-to-r from-red-50 via-rose-50 to-white border-red-100' : 'bg-slate-50/70 border-slate-100'
      }`}>
        <div className="flex items-center gap-2">
          {getUrgencyBadge()}
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(request.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <VerificationBadge status={request.verificationStatus} org={request.verifiedBy} />
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-xl text-white font-bold ${
                isBlood ? 'bg-gradient-to-br from-red-600 to-rose-700 shadow-md shadow-red-600/30' : 'bg-gradient-to-br from-teal-600 to-emerald-700 shadow-md shadow-teal-600/30'
              }`}>
                {isBlood ? <Droplet className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {isBlood ? (
                    <span>
                      Urgent Blood: <span className="text-red-600 font-extrabold text-xl">{request.bloodGroup}</span> ({request.unitsRequired} Unit{request.unitsRequired > 1 ? 's' : ''})
                    </span>
                  ) : (
                    <span>
                      Equipment: <span className="text-teal-700 capitalize font-extrabold">{request.equipmentCategory?.replace('_', ' ')}</span>
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Patient: <strong className="text-slate-800">{request.patientName}</strong></p>
              </div>
            </div>

            {/* Medical Summary */}
            <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-200/70 leading-relaxed font-normal">
              "{request.medicalSummary}"
            </p>

            {/* Hospital & Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">{request.hospitalName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-slate-700 font-medium">{request.city}, {request.district}</span>
              </div>
              {request.doctorInCharge && (
                <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-500">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Attending Doctor: <strong>{request.doctorInCharge}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar (WhatsApp Hook & Direct Contact) */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Attendant: {request.attendantName}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct Call Button */}
            <a
              href={`tel:${request.attendantPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Call Attendant</span>
            </a>

            {/* Direct WhatsApp Action Hook Button (Member 3 Spec) */}
            <button
              onClick={() => onOpenWhatsAppModal(request)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp SOS Action</span>
            </button>

            {/* Resolve / Fulfill Button */}
            {!isFulfilled && (
              <button
                onClick={() => onResolve(request._id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-dashed border-slate-300 hover:border-emerald-300 transition-colors"
                title="Mark request fulfilled if donor or equipment arranged"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark Arranged</span>
              </button>
            )}

            {isFulfilled && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Fulfilled & Safe
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
