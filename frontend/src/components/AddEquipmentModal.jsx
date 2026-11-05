import React, { useState, useEffect } from 'react';
import { X, Stethoscope, Building, Tag, IndianRupee, MapPin, Phone } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export const AddEquipmentModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const { detectedCity, detectedDistrict, coordinates } = useLocation();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('oxygen_concentrator');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Sanitized & Certified');
  const [rentalRatePerDay, setRentalRatePerDay] = useState(150);
  const [securityDeposit, setSecurityDeposit] = useState(2000);
  const [rentalTerms, setRentalTerms] = useState('Govt ID proof required. Subsidized for underprivileged families.');
  const [isFreeEmergency, setIsFreeEmergency] = useState(false);
  const [city, setCity] = useState(detectedCity || 'Vijayawada');
  const [district, setDistrict] = useState(detectedDistrict || 'NTR District');

  useEffect(() => {
    if (detectedCity) setCity(detectedCity);
    if (detectedDistrict) setDistrict(detectedDistrict);
  }, [detectedCity, detectedDistrict]);
  const [ownerName, setOwnerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !city || !district || !contactPhone) {
      setError('Please provide all mandatory equipment fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await onSubmitSuccess({
        title,
        category,
        description,
        condition,
        rentalRatePerDay: isFreeEmergency ? 0 : Number(rentalRatePerDay),
        securityDeposit: Number(securityDeposit),
        rentalTerms,
        isFreeEmergency,
        city,
        district,
        ownerName: ownerName || 'Community Equipment Bank',
        contactPhone,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&auto=format&fit=crop&q=80',
        coordinates: coordinates ? [coordinates.lng, coordinates.lat] : [80.6480, 16.5062]
      });
      if (res && res.success) {
        onClose();
      } else if (res && res.message) {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-teal-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">List Medical Equipment for Rental</h2>
              <p className="text-xs text-teal-100">Offer oxygen concentrators, wheelchairs, or ICU beds to patients</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment Model & Name *</label>
            <input
              type="text"
              placeholder="e.g. Philips EverFlo 5L Oxygen Concentrator"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500"
              >
                <option value="oxygen_concentrator">Oxygen Concentrator</option>
                <option value="wheelchair">Wheelchair (Folding/Reclining)</option>
                <option value="cpap_bipap">CPAP / BiPAP Machine</option>
                <option value="hospital_bed">Hospital Bed (ICU / Semi)</option>
                <option value="suction_machine">Phlegm Suction Machine</option>
                <option value="nebulizer">Medical Nebulizer</option>
                <option value="pulse_oximeter">Pulse Oximeter</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sanitary Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              >
                <option value="Sanitized & Certified">Sanitized & Certified</option>
                <option value="Brand New">Brand New</option>
                <option value="Gently Used">Gently Used</option>
                <option value="Good Working Condition">Good Working Condition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={2}
              placeholder="Specifications: flow rate, accessories included, cleanliness protocol..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Rental Rate (₹)</label>
              <input
                type="number"
                disabled={isFreeEmergency}
                value={rentalRatePerDay}
                onChange={(e) => setRentalRatePerDay(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="free_loan"
              checked={isFreeEmergency}
              onChange={(e) => setIsFreeEmergency(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded"
            />
            <label htmlFor="free_loan" className="text-xs text-slate-700 font-bold cursor-pointer">
              Mark as 100% FREE emergency loan for BPL / crisis patients
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rental Terms & Requirements</label>
            <input
              type="text"
              value={rentalTerms}
              onChange={(e) => setRentalTerms(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Owner / Center Name *</label>
              <input
                type="text"
                placeholder="e.g. CarePlus Relief NGO"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone (WhatsApp) *</label>
              <input
                type="tel"
                placeholder="e.g. +91 94412 34567"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-md shadow-teal-700/30"
            >
              {loading ? 'Publishing...' : 'List Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
