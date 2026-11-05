import React from 'react';
import { HeartHandshake, PhoneCall, Shield, AlertTriangle, Github, Heart } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">Med<span className="text-red-500">Supply</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized community exchange bridging critical blood donor deficits and emergency medical equipment rentals for home-care recovery across Vijayawada, Guntur, and neighboring districts.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All 3 Services Operating Normally</span>
            </div>
          </div>

          {/* Col 2: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Government Emergency Helplines</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span>Ambulance & Trauma</span>
                <span className="font-mono font-bold text-red-400">108</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span>State Health Helpline</span>
                <span className="font-mono font-bold text-emerald-400">104</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span>National Blood Helpline</span>
                <span className="font-mono font-bold text-rose-400">1910</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Exchange Portals</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('emergency')} className="hover:text-white transition-colors">
                  🚨 Live Emergency Feed (Urgent SOS)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('donors')} className="hover:text-white transition-colors">
                  🩸 Blood Donor Directory & Cooldown
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('equipment')} className="hover:text-white transition-colors">
                  🩺 Oxygen & Medical Equipment Exchange
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                  📊 Personal Dashboard & Return Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Community Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Community Trust & Safety</h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Health Network</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                MedSupply connects genuine donors and verified home-care medical equipment owners with hospital referrals and transparent rental terms.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MedSupply Exchange Platform. All rights reserved. Emergency Relief Network.</p>
          <div className="flex items-center gap-2">
            <span>Built with precision for healthcare emergency relief</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
