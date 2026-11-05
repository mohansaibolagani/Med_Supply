import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

// Known reference cities in region for reverse geocoding approximation
const REGION_HUBS = [
  { city: 'Vijayawada', district: 'NTR District', lat: 16.5062, lng: 80.6480 },
  { city: 'Guntur', district: 'Guntur District', lat: 16.3067, lng: 80.4365 },
  { city: 'Mangalagiri', district: 'Guntur District', lat: 16.4300, lng: 80.5500 },
  { city: 'Tenali', district: 'Guntur District', lat: 16.2430, lng: 80.6400 },
  { city: 'Hyderabad', district: 'Hyderabad District', lat: 17.3850, lng: 78.4867 },
  { city: 'Visakhapatnam', district: 'Visakhapatnam District', lat: 17.6868, lng: 83.2185 }
];

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const LocationProvider = ({ children }) => {
  const [coordinates, setCoordinates] = useState(null); // { lat, lng }
  const [detectedCity, setDetectedCity] = useState('');
  const [detectedDistrict, setDetectedDistrict] = useState('');
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'loading' | 'granted' | 'denied' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationStatus('error');
        setErrorMessage('Geolocation is not supported by your browser.');
        reject(new Error('Geolocation not supported'));
        return;
      }

      setLocationStatus('loading');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });

          // Find closest reference city
          let closest = REGION_HUBS[0];
          let minDistance = Infinity;
          for (const hub of REGION_HUBS) {
            const d = getDistanceKm(lat, lng, hub.lat, hub.lng);
            if (d < minDistance) {
              minDistance = d;
              closest = hub;
            }
          }

          // If within 80 km of a hub, associate with hub city; otherwise use coordinates
          setDetectedCity(closest.city);
          setDetectedDistrict(closest.district);
          setLocationStatus('granted');
          setErrorMessage('');

          resolve({
            lat,
            lng,
            city: closest.city,
            district: closest.district,
            distanceToHubKm: Math.round(minDistance)
          });
        },
        (error) => {
          setLocationStatus('denied');
          let msg = 'Location access denied or unavailable.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. You can manually select your city.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location information is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out.';
          }
          setErrorMessage(msg);
          // Fallback to default hub
          setDetectedCity('Vijayawada');
          setDetectedDistrict('NTR District');
          setCoordinates({ lat: 16.5062, lng: 80.6480 });
          resolve({
            lat: 16.5062,
            lng: 80.6480,
            city: 'Vijayawada',
            district: 'NTR District',
            fallback: true
          });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  const manualSetCity = (city, district) => {
    setDetectedCity(city);
    if (district) setDetectedDistrict(district);
  };

  return (
    <LocationContext.Provider value={{
      coordinates,
      detectedCity,
      detectedDistrict,
      locationStatus,
      errorMessage,
      requestLocation,
      manualSetCity,
      isLocationGranted: locationStatus === 'granted'
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
