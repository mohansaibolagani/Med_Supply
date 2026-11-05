import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  PlusCircle, 
  MapPin, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  Award, 
  CheckCircle2,
  Heart
} from 'lucide-react';
import { api } from '../services/api';
import { DonorCard } from '../components/DonorCard';
import { FilterBar } from '../components/FilterBar';

export const DonorsPage = ({ onOpenDonorModal, onOpenWhatsAppModal }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBloodGroup !== 'all') params.bloodGroup = selectedBloodGroup;
      if (selectedCity) params.city = selectedCity;
      if (selectedDistrict) params.district = selectedDistrict;
      if (onlyAvailable) params.isAvailable = true;

      const res = await api.getDonors(params);
      if (res.success && res.data) {
        let list = res.data;
        if (search) {
          const q = search.toLowerCase();
          list = list.filter(d => 
            d.fullName.toLowerCase().includes(q) ||
            d.city.toLowerCase().includes(q) ||
            d.district.toLowerCase().includes(q) ||
            d.bloodGroup.toLowerCase().includes(q)
          );
        }
        setDonors(list);
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup, selectedCity, selectedDistrict, onlyAvailable, search]);

  const handleToggleAvailability = async (id) => {
    await api.toggleDonorAvailability(id);
    fetchDonors();
  };

  const handleContactWhatsApp = (donor) => {
    onOpenWhatsAppModal(donor, 'donor');
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedBloodGroup('all');
    setOnlyAvailable(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-700/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-white/20">
              <Droplet className="w-5 h-5 text-white" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-200">Verified Voluntary Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Emergency Blood Donor Directory</h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl mt-1">
            Browse verified donors filtered by blood group and district. Real-time availability toggles and 90-day cooldown tracking.
          </p>
        </div>

        <button
          onClick={onOpenDonorModal}
          className="px-5 py-3 rounded-2xl bg-white text-red-700 hover:bg-rose-50 font-black text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-red-600" />
          <span>Register as Donor</span>
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

      {/* Blood Group Chips & Availability Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">Blood Group:</span>
          {['all', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedBloodGroup === bg
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {bg === 'all' ? 'All Types' : bg}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              onlyAvailable
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyAvailable ? 'bg-white animate-ping' : 'bg-slate-400'}`}></span>
            <span>{onlyAvailable ? 'Showing Ready Donors Only' : 'Show All Donors'}</span>
          </button>
        </div>
      </div>

      {/* Donors Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Retrieving matching donors...</p>
        </div>
      ) : donors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No donors found with these filters</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try choosing a different city or blood group, or be the first to register as a donor in this district!
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
          {donors.map((donor) => (
            <DonorCard
              key={donor._id}
              donor={donor}
              onToggleAvailability={handleToggleAvailability}
              onContactWhatsApp={handleContactWhatsApp}
            />
          ))}
        </div>
      )}
    </div>
  );
};
