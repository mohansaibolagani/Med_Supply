import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  PlusCircle, 
  MapPin, 
  RefreshCw, 
  AlertCircle, 
  Wind, 
  Activity, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { EquipmentCard } from '../components/EquipmentCard';
import { FilterBar } from '../components/FilterBar';

export const EquipmentPage = ({ onOpenEquipmentModal, onOpenWhatsAppModal }) => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [onlyFree, setOnlyFree] = useState(false);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedCity) params.city = selectedCity;
      if (selectedDistrict) params.district = selectedDistrict;
      if (onlyFree) params.isFreeEmergency = true;

      const res = await api.getEquipment(params);
      if (res.success && res.data) {
        let list = res.data;
        if (search) {
          const q = search.toLowerCase();
          list = list.filter(e => 
            e.title.toLowerCase().includes(q) ||
            e.category.toLowerCase().includes(q) ||
            e.city.toLowerCase().includes(q) ||
            e.ownerName.toLowerCase().includes(q)
          );
        }
        setEquipmentList(list);
      }
    } catch (err) {
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [selectedCategory, selectedStatus, selectedCity, selectedDistrict, onlyFree, search]);

  const handleStatusChange = async (id, newStatus) => {
    await api.updateEquipmentStatus(id, newStatus);
    fetchEquipment();
  };

  const handleContactWhatsApp = (equipment) => {
    onOpenWhatsAppModal(equipment, 'equipment');
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setOnlyFree(false);
  };

  const categories = [
    { id: 'all', label: 'All Equipment' },
    { id: 'oxygen_concentrator', label: 'Oxygen Concentrators' },
    { id: 'wheelchair', label: 'Wheelchairs' },
    { id: 'cpap_bipap', label: 'CPAP / BiPAP' },
    { id: 'hospital_bed', label: 'Hospital Beds' },
    { id: 'suction_machine', label: 'Suction Machines' }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-700/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-white/20">
              <Stethoscope className="w-5 h-5 text-white" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-200">Home Care & Post-ICU Relief</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Urgent Medical Equipment Exchange</h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl mt-1">
            Rent or borrow oxygen concentrators, wheelchairs, and CPAP machines with verified terms and return date tracking.
          </p>
        </div>

        <button
          onClick={onOpenEquipmentModal}
          className="px-5 py-3 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 font-black text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-teal-700" />
          <span>List Equipment</span>
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

      {/* Category Chips & Status Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyFree(!onlyFree)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              onlyFree
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {onlyFree ? '✓ Showing Free Emergency Loans' : 'Show Free Loans Only'}
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading verified medical equipment catalog...</p>
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No medical equipment matches this filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or list your equipment to support families in need today.
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
          {equipmentList.map((equipment) => (
            <EquipmentCard
              key={equipment._id}
              equipment={equipment}
              onStatusChange={handleStatusChange}
              onContactWhatsApp={handleContactWhatsApp}
            />
          ))}
        </div>
      )}
    </div>
  );
};
