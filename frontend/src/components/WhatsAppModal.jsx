import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, ExternalLink, ShieldCheck, Sparkles, Send } from 'lucide-react';

export const WhatsAppModal = ({ isOpen, onClose, targetData, type = 'emergency' }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !targetData) return null;

  const getCleanPhone = (phone) => {
    return (phone || '').replace(/[^0-9]/g, '');
  };

  const phone = targetData.whatsappNumber || targetData.attendantPhone || targetData.phone || targetData.contactPhone || '919848012345';
  const cleanPhone = getCleanPhone(phone);

  let formattedText = '';
  let title = 'WhatsApp Action Hook';

  if (type === 'emergency') {
    title = '🚨 Emergency Blood & Equipment WhatsApp SOS';
    if (targetData.requestType === 'blood') {
      formattedText = 
`🚨 *MEDSUPPLY EMERGENCY BLOOD SOS* 🚨
--------------------------------------
*Patient:* ${targetData.patientName}
*Blood Group Required:* ${targetData.bloodGroup} (${targetData.unitsRequired || 1} Unit)
*Hospital:* ${targetData.hospitalName}
*Location:* ${targetData.city}, ${targetData.district}
*Urgency Level:* 🔴 ${targetData.urgencyLevel} (Within ${targetData.requiredWithinHours || 2} hrs)
*Attendant Phone:* ${targetData.attendantPhone}

*Situation:* ${targetData.medicalSummary}

⚠️ If you or anyone you know can donate immediately, please respond right away!
Shared via MedSupply Emergency Network`;
    } else {
      formattedText = 
`⚡ *MEDSUPPLY URGENT MEDICAL EQUIPMENT REQUEST* ⚡
--------------------------------------
*Patient:* ${targetData.patientName}
*Equipment Needed:* ${targetData.equipmentCategory?.replace('_', ' ').toUpperCase()}
*Hospital/Address:* ${targetData.hospitalName}, ${targetData.city}
*Urgency Level:* 🟠 ${targetData.urgencyLevel}
*Attendant Phone:* ${targetData.attendantPhone}

*Requirement Details:* ${targetData.medicalSummary}

Please respond if you have an available unit for immediate rental or emergency loan.
Shared via MedSupply Emergency Network`;
    }
  } else if (type === 'equipment') {
    title = '🏥 Urgent Equipment Rental Inquiry';
    formattedText = 
`🏥 *MEDSUPPLY EQUIPMENT RENTAL INQUIRY*
--------------------------------------
Hello *${targetData.ownerName}*,
I am reaching out regarding the *${targetData.title}* listed on MedSupply.

*Category:* ${targetData.category?.replace('_', ' ').toUpperCase()}
*Location:* ${targetData.city}, ${targetData.district}
*Rental Rate:* ₹${targetData.rentalRatePerDay}/day (Deposit: ₹${targetData.securityDeposit})
*Listed Condition:* ${targetData.condition}

Is this equipment available for immediate pickup/dispatch today? Thank you!`;
  } else {
    title = '🩸 Blood Donor Emergency Outreach';
    formattedText = 
`🩸 *MEDSUPPLY DIRECT DONOR OUTREACH*
--------------------------------------
Hello *${targetData.fullName}*,
We noticed your registered *${targetData.bloodGroup}* blood donor profile on MedSupply in *${targetData.city}*.

We have an urgent patient requirement at a local hospital. Are you currently available to donate?
Thank you for your life-saving service!`;
  }

  const encodedUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(encodedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="text-xs text-emerald-100">Instant Verified Healthcare Response Channel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Recipient WhatsApp</span>
              <span className="font-mono font-bold text-slate-800 text-sm">+{cleanPhone}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct Action Hook
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pre-Filled Message Template
              </label>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto border border-slate-800">
              {formattedText}
            </pre>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Clicking below opens WhatsApp Web or the WhatsApp Mobile App directly with this pre-filled message addressed to the attendant.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Launch WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
