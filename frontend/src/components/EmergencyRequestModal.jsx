import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Droplet, 
  Stethoscope, 
  MapPin, 
  Building, 
  Phone, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2,
  Compass
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export const EmergencyRequestModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const { detectedCity, detectedDistrict, coordinates } = useLocation();
  const [requestType, setRequestType] = useState('blood');
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [equipmentCategory, setEquipmentCategory] = useState('oxygen_concentrator');
  const [urgencyLevel, setUrgencyLevel] = useState('CRITICAL');
  const [requiredWithinHours, setRequiredWithinHours] = useState(2);
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [doctorInCharge, setDoctorInCharge] = useState('');
  const [city, setCity] = useState(detectedCity || 'Vijayawada');
  const [district, setDistrict] = useState(detectedDistrict || 'NTR District');

  useEffect(() => {
    if (detectedCity) setCity(detectedCity);
    if (detectedDistrict) setDistrict(detectedDistrict);
  }, [detectedCity, detectedDistrict]);
  const [attendantName, setAttendantName] = useState('');
  const [attendantPhone, setAttendantPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [medicalSummary, setMedicalSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!patientName || !hospitalName || !attendantName || !attendantPhone || !medicalSummary) {
      setError('Please fill in all mandatory emergency fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        requestType,
        patientName,
        hospitalName,
        doctorInCharge,
        bloodGroup: requestType === 'blood' ? bloodGroup : null,
        unitsRequired: requestType === 'blood' ? Number(unitsRequired) : 1,
        equipmentCategory: requestType === 'equipment' ? equipmentCategory : null,
        urgencyLevel,
        requiredWithinHours: Number(requiredWithinHours),
        city,
        district,
        attendantName,
        attendantPhone,
        whatsappNumber: whatsappNumber || attendantPhone,
        medicalSummary,
        coordinates: coordinates ? [coordinates.lng, coordinates.lat] : [80.6480, 16.5062]
      };

      const res = await onSubmitSuccess(payload);
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
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-red-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <ShieldAlert className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Post Live Emergency SOS Request</h2>
              <p className="text-xs text-rose-100">Dispatches instant alert to nearby donors & equipment centers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Request Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Emergency Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRequestType('blood')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  requestType === 'blood'
                    ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Droplet className="w-4 h-4 text-red-600" />
                <span>Urgent Blood Transfusion</span>
              </button>
              <button
                type="button"
                onClick={() => setRequestType('equipment')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  requestType === 'equipment'
                    ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>Urgent Medical Equipment</span>
              </button>
            </div>
          </div>

          {/* Conditional Specs */}
          {requestType === 'blood' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group Needed *</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                    <option key={bg} value={bg}>{bg} Blood Group</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Units Required *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={unitsRequired}
                  onChange={(e) => setUnitsRequired(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment Category *</label>
              <select
                value={equipmentCategory}
                onChange={(e) => setEquipmentCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="oxygen_concentrator">Oxygen Concentrator (5L / 10L)</option>
                <option value="wheelchair">Folding / Reclining Wheelchair</option>
                <option value="cpap_bipap">CPAP / BiPAP Machine</option>
                <option value="hospital_bed">ICU / Adjustable Hospital Bed</option>
                <option value="suction_machine">Phlegm Suction Machine</option>
                <option value="pulse_oximeter">High Accuracy Pulse Oximeter</option>
              </select>
            </div>
          )}

          {/* Urgency & Time Window */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency Priority</label>
              <select
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="CRITICAL">🔴 CRITICAL (&lt; 2 Hours)</option>
                <option value="HIGH">🟠 HIGH (&lt; 6 Hours)</option>
                <option value="MODERATE">🔵 MODERATE (Today)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Needed Within (Hours)</label>
              <input
                type="number"
                min="1"
                max="48"
                value={requiredWithinHours}
                onChange={(e) => setRequiredWithinHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
              />
            </div>
          </div>

          {/* Patient & Hospital Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name & Age *</label>
              <input
                type="text"
                placeholder="e.g. Venkata Rao (Age 58)"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic Name *</label>
              <input
                type="text"
                placeholder="e.g. GGH Vijayawada Emergency Ward"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          {/* Location Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          {/* Attendant & WhatsApp Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Attendant Name *</label>
              <input
                type="text"
                placeholder="e.g. Sai Krishna (Son)"
                value={attendantName}
                onChange={(e) => setAttendantName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Attendant Phone *</label>
              <input
                type="tel"
                placeholder="e.g. +91 98481 99881"
                value={attendantPhone}
                onChange={(e) => setAttendantPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          {/* Medical Situation Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical Situation Summary *
            </label>
            <textarea
              rows={3}
              placeholder="Provide concise details: surgery scheduled, current SpO2 level, urgent transfusion need..."
              value={medicalSummary}
              onChange={(e) => setMedicalSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md shadow-red-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Dispatched...' : 'Broadcast SOS Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
