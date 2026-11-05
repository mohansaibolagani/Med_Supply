import React, { useState } from 'react';
import { X, Droplet, User, Phone, MapPin, Calendar, HeartHandshake } from 'lucide-react';

export const DonorRegisterModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Vijayawada');
  const [district, setDistrict] = useState('NTR District');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [readyForEmergency, setReadyForEmergency] = useState(true);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !city || !district) {
      setError('Please provide all mandatory fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await onSubmitSuccess({
        fullName,
        bloodGroup,
        phone,
        city,
        district,
        lastDonationDate: lastDonationDate || null,
        readyForEmergency,
        notes
      });
      if (res && res.success) {
        onClose();
      } else if (res && res.message) {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Register as a Blood Donor</h2>
              <p className="text-xs text-rose-100">Join the verified local emergency donor bank</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-red-700 focus:ring-2 focus:ring-red-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone (WhatsApp) *</label>
            <input
              type="tel"
              placeholder="e.g. +91 98480 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500"
              required
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Last Donation Date (For 90-Day Cooldown Tracker)
            </label>
            <input
              type="date"
              value={lastDonationDate}
              onChange={(e) => setLastDonationDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
            <span className="text-[11px] text-slate-400">Leave blank if this is your first time donating.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Notes</label>
            <input
              type="text"
              placeholder="e.g. Available after 5 PM, weekends 24/7"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="emergency_ready"
              checked={readyForEmergency}
              onChange={(e) => setReadyForEmergency(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <label htmlFor="emergency_ready" className="text-xs text-slate-700 font-semibold cursor-pointer">
              I agree to receive urgent broadcast WhatsApp alerts for matching patients
            </label>
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
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md shadow-red-600/30"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
