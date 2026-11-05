import React, { useState } from 'react';
import { Search, MapPin, Filter, RotateCcw, Compass, Loader2, Check } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export const FilterBar = ({
  search,
  setSearch,
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
  cities = ['Vijayawada', 'Guntur', 'Tenali', 'Mangalagiri', 'Hyderabad'],
  districts = ['NTR District', 'Guntur District', 'Krishna District', 'Hyderabad District'],
  onReset
}) => {
  const { requestLocation, locationStatus, detectedCity, detectedDistrict } = useLocation();
  const [detecting, setDetecting] = useState(false);

  const handleUseMyLocation = async () => {
    setDetecting(true);
    try {
      const loc = await requestLocation();
      if (loc && loc.city) {
        setSelectedCity(loc.city);
        if (loc.district) setSelectedDistrict(loc.district);
      }
    } catch (e) {
      console.warn('Location detection failed:', e);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keywords, hospital, or equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
          />
        </div>

        {/* City Filter */}
        <div className="w-full md:w-44 relative">
          <MapPin className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Districts</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* GPS Quick Button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={detecting}
          className="px-3 py-2.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-rose-50/50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          title="Auto-detect and filter by current location"
        >
          {detecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
          ) : (
            <Compass className="w-3.5 h-3.5 text-red-500" />
          )}
          <span>{detectedCity ? `Near ${detectedCity}` : 'Near Me'}</span>
        </button>

        {/* Reset button */}
        {(search || selectedCity || selectedDistrict) && (
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
            title="Reset location filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
