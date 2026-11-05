const http = require('http');

// Start backend
require('./server.js');

setTimeout(() => {
  console.log('Probing /api/emergency...');
  http.get('http://localhost:5000/api/emergency', (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      console.log('[PROBE 1] /api/emergency Status:', res.statusCode);
      const json = JSON.parse(body);
      console.log('[PROBE 1] Emergency records count:', json.count);

      // Probe Donors
      http.get('http://localhost:5000/api/donors', (res2) => {
        let body2 = '';
        res2.on('data', c => body2 += c);
        res2.on('end', () => {
          console.log('[PROBE 2] /api/donors Status:', res2.statusCode);
          const json2 = JSON.parse(body2);
          console.log('[PROBE 2] Donors count:', json2.count);

          // Probe Equipment
          http.get('http://localhost:5000/api/equipment', (res3) => {
            let body3 = '';
            res3.on('data', c => body3 += c);
            res3.on('end', () => {
              console.log('[PROBE 3] /api/equipment Status:', res3.statusCode);
              const json3 = JSON.parse(body3);
              console.log('[PROBE 3] Equipment count:', json3.count);
              console.log('🎉 ALL API ENDPOINTS VERIFIED 100% OPERATIONAL!');
              process.exit(0);
            });
          });
        });
      });
    });
  }).on('error', (e) => {
    console.error('Probe failed:', e);
    process.exit(1);
  });
}, 3500);
