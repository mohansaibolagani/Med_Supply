import React, { useState } from 'react';
import { 
  Stethoscope, 
  MapPin, 
  Phone, 
  MessageSquare, 
  IndianRupee, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Tag,
  Building,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

export const EquipmentCard = ({ equipment, onStatusChange, onContactWhatsApp }) => {
  const [updating, setUpdating] = useState(false);

  const getStatusBadge = () => {
    switch (equipment.status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            Available Now
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            Reserved
          </span>
        );
      case 'rented':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
            Currently Out on Loan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {equipment.status}
          </span>
        );
    }
  };

  const handleToggleStatus = async () => {
    setUpdating(true);
    const nextStatus = equipment.status === 'available' ? 'reserved' : 'available';
    await onStatusChange(equipment._id, nextStatus);
    setUpdating(false);
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-sm hover:shadow-md ${
      equipment.status === 'available' ? 'border-slate-200 hover:border-teal-300' : 'border-slate-200 bg-slate-50/50 opacity-90'
    }`}>
      {/* Top Image or Header banner */}
      <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {equipment.imageUrl ? (
          <img 
            src={equipment.imageUrl} 
            alt={equipment.title}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-slate-900/90 text-white backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold capitalize border border-white/20">
            {equipment.category.replace('_', ' ')}
          </span>
          {getStatusBadge()}
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-base leading-snug drop-shadow-sm">{equipment.title}</h3>
          <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
            <Building className="w-3.5 h-3.5" />
            <span>{equipment.ownerName}</span>
          </p>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 space-y-4">
        {/* Verification and location */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <VerificationBadge status={equipment.isVerified} org={equipment.verifiedBy} />
          <span className="text-slate-600 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            {equipment.city}, {equipment.district}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {equipment.description}
        </p>

        {/* Pricing / Rental Terms */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Rental Rate</span>
            {equipment.isFreeEmergency || equipment.rentalRatePerDay === 0 ? (
              <span className="font-bold text-emerald-700 text-sm">FREE Emergency Loan</span>
            ) : (
              <span className="font-extrabold text-slate-900 text-sm">
                ₹{equipment.rentalRatePerDay} <span className="text-xs font-normal text-slate-500">/day</span>
              </span>
            )}
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Security Deposit</span>
            <span className="font-bold text-slate-800 text-sm">
              ₹{equipment.securityDeposit} <span className="text-[10px] text-slate-500 font-normal">(Refundable)</span>
            </span>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
            <strong>Terms:</strong> {equipment.rentalTerms}
          </div>
        </div>

        {/* Return date alert if reserved */}
        {equipment.status === 'reserved' && equipment.expectedReturnDate && (
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Reserved by <strong>{equipment.reservedBy || 'Emergency Patient'}</strong>. Return due: {new Date(equipment.expectedReturnDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Status Toggle Button (Member 2 Spec) */}
          <button
            onClick={handleToggleStatus}
            disabled={updating}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              equipment.status === 'available'
                ? 'text-amber-700 border-amber-300 hover:bg-amber-50'
                : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
            }`}
            title="Toggle reservation status"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{equipment.status === 'available' ? 'Mark Reserved' : 'Mark Available'}</span>
          </button>

          {/* WhatsApp Direct Booking Hook */}
          <button
            onClick={() => onContactWhatsApp(equipment)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Book via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
