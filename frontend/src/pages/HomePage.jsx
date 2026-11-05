import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Flame, 
  Droplet, 
  Stethoscope, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Activity, 
  AlertCircle,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { EmergencyFeedCard } from '../components/EmergencyFeedCard';

export const HomePage = ({ setActiveTab, onOpenEmergencyModal, onOpenDonorModal, onOpenEquipmentModal, onOpenWhatsAppModal }) => {
  const [criticalRequests, setCriticalRequests] = useState([]);
  const [stats, setStats] = useState({
    activeRequests: 4,
    criticalCases: 2,
    readyDonors: 18,
    availableEquipment: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedRes, dashRes] = await Promise.all([
          api.getEmergencyFeed({ status: 'ACTIVE' }),
          api.getDashboard()
        ]);

        if (feedRes.success && feedRes.data) {
          setCriticalRequests(feedRes.data.slice(0, 3));
        }

        if (dashRes.success && dashRes.data && dashRes.data.summaryStats) {
          setStats(dashRes.data.summaryStats);
        }
      } catch (err) {
        console.error('Home feed loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleResolve = async (id) => {
    await api.resolveEmergencyRequest(id);
    setCriticalRequests(prev => prev.filter(r => r._id !== id));
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            <span>Local Emergency Response Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Immediate Blood Donors & Urgent Medical Equipment.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Ending chaotic WhatsApp forwarding during crises. MedSupply directly connects patients with verified local blood donors, diagnostic centers, and oxygen/CPAP equipment owners across Vijayawada, Guntur & neighboring districts.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenEmergencyModal}
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
            >
              <Flame className="w-5 h-5 animate-bounce" />
              <span>Post Emergency SOS Request</span>
            </button>

            <button
              onClick={() => setActiveTab('donors')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Droplet className="w-5 h-5 text-red-400" />
              <span>Find Blood Donors</span>
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span>Urgent Equipment Rentals</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="block text-2xl sm:text-3xl font-black text-red-400">{stats.criticalCases || 2}</span>
            <span className="text-xs text-slate-400 font-medium">Critical Cases &lt; 2h</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="block text-2xl sm:text-3xl font-black text-rose-300">{stats.readyDonors || 18}+</span>
            <span className="text-xs text-slate-400 font-medium">Verified Active Donors</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="block text-2xl sm:text-3xl font-black text-teal-400">{stats.availableEquipment || 12}</span>
            <span className="text-xs text-slate-400 font-medium">Oxygen & ICU Units</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-400">100%</span>
            <span className="text-xs text-slate-400 font-medium">Direct WhatsApp SOS Action</span>
          </div>
        </div>
      </section>

      {/* Live Emergency Feed Teaser */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
            <h2 className="text-2xl font-black text-slate-900">Live Emergency Request Feed</h2>
          </div>
          <button
            onClick={() => setActiveTab('emergency')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group"
          >
            <span>View All Active SOS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {criticalRequests.map((req) => (
            <EmergencyFeedCard
              key={req._id}
              request={req}
              onResolve={handleResolve}
              onOpenWhatsAppModal={onOpenWhatsAppModal}
            />
          ))}
        </div>
      </section>

      {/* 3 Core Services Highlight */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Blood Directory */}
        <div className="rounded-3xl bg-gradient-to-b from-rose-50 to-white border border-rose-100 p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
            <Droplet className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Verified Blood Directory</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Filter active donors by blood group (including rare negative types) and district. Built-in 90-day cooldown tracker prevents donor burnout and ensures medical safety.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('donors')}
              className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1"
            >
              <span>Explore Donors Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Equipment Rental */}
        <div className="rounded-3xl bg-gradient-to-b from-teal-50 to-white border border-teal-100 p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Home-Care Equipment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Find certified oxygen concentrators, wheelchairs, and CPAP machines for post-hospital recovery. Transparent rental terms, security deposits, and free BPL options.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('equipment')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Browse Medical Equipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: WhatsApp Action Hooks */}
        <div className="rounded-3xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Direct WhatsApp Action</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            One-click pre-formatted emergency WhatsApp messages connect you straight to the patient attendant or diagnostic owner without manual copying or lost context.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('workload')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View Technical Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* University Banner */}
      <section className="rounded-3xl bg-slate-100 border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Academic Capstone & Class Training Deliverable
          </span>
          <h3 className="text-xl font-black text-slate-900">
            Built as a collaborative 3-Member Engineering Project
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Fully implemented with Express REST routes, MongoDB geospatial indexing, React Tailwind interface, and WhatsApp/SMS simulation engine.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('workload')}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 shadow-md flex items-center gap-2"
        >
          <span>View Member Workload Split & Viva Guide</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
