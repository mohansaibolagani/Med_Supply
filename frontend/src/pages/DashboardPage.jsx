import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  Droplet, 
  Stethoscope, 
  AlertCircle,
  PlusCircle,
  FileCheck,
  ShieldCheck,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    donationHistory: [],
    activeLoans: [],
    summaryStats: {
      totalDonations: 0,
      activeRequests: 0,
      criticalCases: 0,
      availableEquipment: 0,
      readyDonors: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newLog, setNewLog] = useState({
    recordType: 'blood_donation',
    bloodGroup: 'O-',
    unitsGiven: 1,
    hospitalOrCamp: 'GGH Vijayawada Emergency Blood Bank',
    recipientPatient: 'Emergency Trauma Patient',
    notes: 'Voluntary emergency replacement donation'
  });

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleReturnEquipment = async (id) => {
    await api.returnEquipment(id);
    fetchDashboard();
  };

  const handleCreateLog = async (e) => {
    e.preventDefault();
    await api.recordDonation(newLog);
    setShowLogModal(false);
    fetchDashboard();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-white/10">
              <LayoutDashboard className="w-5 h-5 text-red-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Unified Medical Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user ? user.name : 'Emergency Volunteer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Real-time tracking of past blood donations, equipment loan returns, and verified contributor history.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log New Donation Record</span>
        </button>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Past Blood Donations</span>
            <Droplet className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">
            {data.donationHistory?.filter(d => d.recordType === 'blood_donation').length || 0}
          </span>
          <span className="text-xs text-emerald-600 font-semibold block mt-1">Verified on Record</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Equipment Out</span>
            <Stethoscope className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">
            {data.activeLoans?.length || 0}
          </span>
          <span className="text-xs text-amber-600 font-semibold block mt-1">Return Due Tracked</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Donor Badges</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-slate-900">3</span>
          <span className="text-xs text-slate-500 font-medium block mt-1">Hospital Certified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Lives Directly Impacted</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-slate-900">14+</span>
          <span className="text-xs text-rose-600 font-semibold block mt-1">Emergency Relief</span>
        </div>
      </div>

      {/* Section 1: Equipment Return Tracker (Member 2 Spec) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Active Medical Equipment Loans & Return Dates</h2>
              <p className="text-xs text-slate-500">Track equipment currently reserved or rented with expected return countdowns</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-teal-800 rounded-full border border-teal-200">
            {data.activeLoans?.length || 0} Units Out
          </span>
        </div>

        {data.activeLoans?.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No overdue or pending equipment returns</p>
            <p className="text-xs text-slate-500">All medical units in the inventory are currently returned and available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Equipment Item</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Borrower / Reserved By</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Expected Return Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.activeLoans?.map((eq) => (
                  <tr key={eq._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {eq.title}
                      <span className="block text-[11px] text-slate-500 capitalize">{eq.category.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                        {eq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {eq.reservedBy || 'Ramesh Hospital ICU Referral'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {eq.city}, {eq.district}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-red-600 flex items-center gap-1.5 pt-4">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{eq.expectedReturnDate ? new Date(eq.expectedReturnDate).toLocaleDateString() : 'Due in 5 days'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleReturnEquipment(eq._id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02]"
                      >
                        Mark Returned
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Section 2: Past Blood Donations & 90-Day Cooldown (Member 1 & 2 Spec) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-red-800 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Verified Past Blood Donations Log</h2>
              <p className="text-xs text-slate-500">Record of emergency replacements, blood camps, and cooldown status</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.donationHistory?.map((hist) => (
            <div key={hist._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                    {hist.bloodGroup || 'O-'}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{hist.hospitalOrCamp}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(hist.donationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Recipient: <strong>{hist.recipientPatient || 'Emergency Patient'}</strong> ({hist.unitsGiven || 1} Unit)
              </p>
              {hist.notes && (
                <p className="text-[11px] text-slate-500 italic">"{hist.notes}"</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Log Past Blood Donation</h3>
            <form onSubmit={handleCreateLog} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={newLog.bloodGroup}
                  onChange={(e) => setNewLog({ ...newLog, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-red-600"
                >
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Blood Camp Name</label>
                <input
                  type="text"
                  value={newLog.hospitalOrCamp}
                  onChange={(e) => setNewLog({ ...newLog, hospitalOrCamp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Case Details</label>
                <input
                  type="text"
                  value={newLog.recipientPatient}
                  onChange={(e) => setNewLog({ ...newLog, recipientPatient: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
