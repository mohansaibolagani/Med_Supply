import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  PlusCircle, 
  Filter, 
  MapPin, 
  Search, 
  Droplet, 
  Stethoscope, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { EmergencyFeedCard } from '../components/EmergencyFeedCard';
import { FilterBar } from '../components/FilterBar';

export const EmergencyFeedPage = ({ onOpenEmergencyModal, onOpenWhatsAppModal }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE');

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedUrgency !== 'all') params.urgencyLevel = selectedUrgency;
      if (selectedType !== 'all') params.requestType = selectedType;
      if (selectedBloodGroup !== 'all') params.bloodGroup = selectedBloodGroup;
      if (selectedCity) params.city = selectedCity;
      if (selectedDistrict) params.district = selectedDistrict;

      const res = await api.getEmergencyFeed(params);
      if (res.success && res.data) {
        let list = res.data;
        if (search) {
          const q = search.toLowerCase();
          list = list.filter(r => 
            r.patientName.toLowerCase().includes(q) ||
            r.hospitalName.toLowerCase().includes(q) ||
            r.city.toLowerCase().includes(q) ||
            r.medicalSummary.toLowerCase().includes(q)
          );
        }
        setRequests(list);
      }
    } catch (err) {
      console.error('Error fetching emergency feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedStatus, selectedUrgency, selectedType, selectedBloodGroup, selectedCity, selectedDistrict, search]);

  const handleResolve = async (id) => {
    await api.resolveEmergencyRequest(id);
    fetchFeed();
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedUrgency('all');
    setSelectedType('all');
    setSelectedBloodGroup('all');
    setSelectedStatus('ACTIVE');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-600/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-white/20">
              <Flame className="w-5 h-5 text-white animate-bounce" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-200">Real-Time Medical SOS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Emergency Request Feed</h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl mt-1">
            Urgent broadcast requests with verification badges and instant WhatsApp deep links for immediate response.
          </p>
        </div>

        <button
          onClick={onOpenEmergencyModal}
          className="px-5 py-3 rounded-2xl bg-white text-red-700 hover:bg-rose-50 font-black text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-red-600" />
          <span>Post Emergency SOS</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        onReset={handleReset}
      />

      {/* Quick Category & Urgency Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Type Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Type:</span>
          {['all', 'blood', 'equipment'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedType === t
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t === 'all' ? 'All Emergencies' : t === 'blood' ? 'Blood Requests' : 'Equipment Requests'}
            </button>
          ))}
        </div>

        {/* Urgency Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Urgency:</span>
          {[
            { id: 'all', label: 'All Urgencies' },
            { id: 'CRITICAL', label: '🔴 Critical (< 2h)' },
            { id: 'HIGH', label: '🟠 High (< 6h)' },
            { id: 'MODERATE', label: '🔵 Moderate' }
          ].map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUrgency(u.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedUrgency === u.id
                  ? 'bg-red-600 text-white font-bold shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Blood Group Filter if blood selected */}
      {(selectedType === 'blood' || selectedType === 'all') && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">Blood Group:</span>
          {['all', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedBloodGroup === bg
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              {bg === 'all' ? 'All Groups' : bg}
            </button>
          ))}
        </div>
      )}

      {/* Active Requests Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading live emergency broadcasts...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No active emergency requests in this view</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All current urgent blood and equipment requests for this location and category are currently arranged or fulfilled.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <EmergencyFeedCard
              key={request._id}
              request={request}
              onResolve={handleResolve}
              onOpenWhatsAppModal={onOpenWhatsAppModal}
            />
          ))}
        </div>
      )}
    </div>
  );
};
