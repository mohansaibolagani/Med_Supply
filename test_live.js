const http = require('http');

// Helper for HTTP requests
function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: null, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runLiveTests() {
  console.log('================================================================');
  console.log('🏥 MEDSUPPLY SYSTEM LIVE VERIFICATION & END-TO-END TEST BENCH');
  console.log('================================================================\n');

  // Start backend server in-process
  require('./backend/server.js');

  // Wait 3.5 seconds for port listening and database connection
  await new Promise(r => setTimeout(r, 3500));

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      if (details) console.log(`     ↳ ${details}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      if (details) console.error(`     ↳ ${details}`);
      failed++;
    }
  }

  try {
    // TEST 1: Health & Workload Split Route
    console.log('--- Phase 1: System Health & Workload Split Verification ---');
    const health = await request({ host: 'localhost', port: 5000, path: '/', method: 'GET' });
    assert(health.status === 200, 'Root System Endpoint responds with 200 OK');
    assert(health.data?.service?.includes('MedSupply'), 'Service Identity matches MedSupply');
    assert(health.data?.teamWorkloadSplit?.member1 && health.data?.teamWorkloadSplit?.member2 && health.data?.teamWorkloadSplit?.member3, 
      '3-Member Workload Split Metadata Registered', 
      `Member 1: ${health.data?.teamWorkloadSplit?.member1?.role} | Member 2: ${health.data?.teamWorkloadSplit?.member2?.role} | Member 3: ${health.data?.teamWorkloadSplit?.member3?.role}`);

    // TEST 2: Auth Login & JWT Token
    console.log('\n--- Phase 2: Member 1 Authentication & JWT Middleware ---');
    const loginRes = await request({
      host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'patient@medsupply.org', password: 'demo123' });
    assert(loginRes.status === 200 && loginRes.data?.token, 'Demo User Login Successful & JWT Issued', `User: ${loginRes.data?.user?.name} (${loginRes.data?.user?.role})`);
    const token = loginRes.data?.token;

    // Verify protected route
    const meRes = await request({
      host: 'localhost', port: 5000, path: '/api/auth/me', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert(meRes.status === 200 && meRes.data?.user?.email === 'patient@medsupply.org', 'Protected Auth Route Verified with Bearer Token');

    // TEST 3: Emergency Feed & SOS Broadcast
    console.log('\n--- Phase 3: Emergency SOS Feed & Broadcast Lifecycle ---');
    const feedRes = await request({ host: 'localhost', port: 5000, path: '/api/emergency?status=ACTIVE', method: 'GET' });
    assert(feedRes.status === 200 && Array.isArray(feedRes.data?.data), 'Active Emergency Feed Queried Successfully', `Total Active Broadcasts: ${feedRes.data?.count}`);
    const critical = feedRes.data?.data?.find(r => r.urgencyLevel === 'CRITICAL');
    assert(critical !== undefined, 'Critical Priority (<2h) Emergency Cases Identified', `Patient: ${critical?.patientName} in ${critical?.hospitalName}`);

    // Create New Emergency SOS
    const newSOS = await request({
      host: 'localhost', port: 5000, path: '/api/emergency', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }, {
      requestType: 'blood',
      patientName: 'Test Patient (Trauma Care)',
      hospitalName: 'GGH Vijayawada Emergency Block 4',
      doctorInCharge: 'Dr. Ramesh (Chief Surgeon)',
      bloodGroup: 'O-',
      unitsRequired: 2,
      urgencyLevel: 'CRITICAL',
      requiredWithinHours: 2,
      city: 'Vijayawada',
      district: 'NTR District',
      attendantName: 'K. Kumar',
      attendantPhone: '+91 98480 11223',
      whatsappNumber: '919848011223',
      medicalSummary: 'Emergency trauma surgery in 2 hours. Rare O- blood urgently required.'
    });
    assert(newSOS.status === 201 && newSOS.data?.data?._id, 'New Emergency SOS Created & Dispatched', `Broadcast ID: ${newSOS.data?.data?._id}`);
    assert(Boolean(newSOS.data?.whatsappDirectLink), 'Direct WhatsApp Deep Link Action Hook Generated', newSOS.data?.whatsappDirectLink);

    // Resolve Emergency Request
    const sosId = newSOS.data?.data?._id;
    const resolveRes = await request({ host: 'localhost', port: 5000, path: `/api/emergency/${sosId}/resolve`, method: 'PATCH' });
    assert(resolveRes.status === 200 && resolveRes.data?.data?.status === 'FULFILLED', 'Emergency SOS Resolved & Fulfilled Successfully');

    // TEST 4: Blood Donors & 90-Day Cooldown
    console.log('\n--- Phase 4: Blood Donors Directory & 90-Day Cooldown Logic ---');
    const donorsRes = await request({ host: 'localhost', port: 5000, path: '/api/donors?bloodGroup=O-&city=Vijayawada', method: 'GET' });
    assert(donorsRes.status === 200 && donorsRes.data?.data?.length > 0, 'Blood Group (O-) & City (Vijayawada) Filter Successful', `Donors Found: ${donorsRes.data?.count}`);

    const targetDonor = donorsRes.data?.data[0];
    const eligibilityRes = await request({ host: 'localhost', port: 5000, path: `/api/donors/${targetDonor._id}/eligibility`, method: 'GET' });
    assert(eligibilityRes.status === 200, '90-Day Blood Donation Cooldown Computed', eligibilityRes.data?.message);

    // Toggle Availability
    const toggleRes = await request({ host: 'localhost', port: 5000, path: `/api/donors/${targetDonor._id}/toggle-availability`, method: 'PATCH' });
    assert(toggleRes.status === 200, 'Donor Availability Toggle Executed (Available <-> Resting)');

    // TEST 5: Medical Equipment Rental & Return Tracker
    console.log('\n--- Phase 5: Equipment Rentals & Dashboard Return Tracker ---');
    const eqRes = await request({ host: 'localhost', port: 5000, path: '/api/equipment?category=oxygen_concentrator', method: 'GET' });
    assert(eqRes.status === 200 && eqRes.data?.data?.length > 0, 'Oxygen Concentrators Catalog Queried', `Units Available: ${eqRes.data?.count}`);

    const testEq = eqRes.data?.data[0];
    // Reserve equipment with return date
    const reserveRes = await request({
      host: 'localhost', port: 5000, path: `/api/equipment/${testEq._id}/status`, method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    }, {
      status: 'reserved',
      reservedBy: 'Ayush ICU Referral',
      expectedReturnDate: new Date(Date.now() + 7 * 86400000).toISOString()
    });
    assert(reserveRes.status === 200 && reserveRes.data?.data?.status === 'reserved', 'Equipment Reserved with Expected Return Date', `Reserved By: ${reserveRes.data?.data?.reservedBy}`);

    // Mark Returned via Dashboard Controller
    const returnRes = await request({ host: 'localhost', port: 5000, path: `/api/dashboard/equipment/${testEq._id}/return`, method: 'PATCH' });
    assert(returnRes.status === 200 && returnRes.data?.data?.status === 'available', 'Equipment Loan Marked Returned and Reset to Available');

    // TEST 6: WhatsApp Gateway & Member 3 Ops Test Dispatch
    console.log('\n--- Phase 6: Member 3 WhatsApp Gateway Simulation ---');
    const dispatchRes = await request({
      host: 'localhost', port: 5000, path: '/api/notifications/test-dispatch', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      phone: '919848012345',
      message: '🚨 MedSupply Verification Test: WhatsApp action hook verified by Member 3 Ops Gateway!'
    });
    assert(dispatchRes.status === 200 && dispatchRes.data?.directLink, 'WhatsApp Gateway Test Dispatch Passed', `Deep Link: ${dispatchRes.data?.directLink?.substring(0, 45)}...`);

    // TEST 7: Dashboard Summary Metrics
    console.log('\n--- Phase 7: User Dashboard Aggregations ---');
    const dashRes = await request({ host: 'localhost', port: 5000, path: '/api/dashboard', method: 'GET' });
    assert(dashRes.status === 200 && dashRes.data?.data?.summaryStats, 'Dashboard Aggregations Calculated', 
      `Active SOS: ${dashRes.data?.data?.summaryStats?.activeRequests} | Ready Donors: ${dashRes.data?.data?.summaryStats?.readyDonors} | Units: ${dashRes.data?.data?.summaryStats?.availableEquipment}`);

    // Summary
    console.log('\n================================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    if (failed === 0) {
      console.log('🌟 100% OPERATIONAL! ALL REST ROUTES, SERVICES & CONTROLLERS VERIFIED.');
    } else {
      console.error(`⚠️ Detected ${failed} test failure(s).`);
    }
    console.log('================================================================\n');

    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runLiveTests();
