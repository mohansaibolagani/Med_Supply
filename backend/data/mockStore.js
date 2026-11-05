// In-Memory Mock Store for zero-dependency instant demo execution
// Mirrors Mongoose collections when MongoDB instance is offline or in test mode.

const initialDonors = [
  {
    _id: 'd1',
    fullName: 'Dr. Suresh Varma',
    bloodGroup: 'O-',
    phone: '+91 98480 12345',
    whatsappNumber: '919848012345',
    city: 'Vijayawada',
    district: 'NTR District',
    state: 'Andhra Pradesh',
    location: { type: 'Point', coordinates: [80.6480, 16.5062] },
    isAvailable: true,
    lastDonationDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(), // 95 days ago -> Eligible!
    donationCount: 14,
    isVerified: true,
    verifiedBy: 'Government General Hospital, Vijayawada',
    readyForEmergency: true,
    notes: 'Universal donor. Ready for critical emergency calls within 15 km.'
  },
  {
    _id: 'd2',
    fullName: 'Ananya Reddy',
    bloodGroup: 'A+',
    phone: '+91 98765 43210',
    whatsappNumber: '919876543210',
    city: 'Guntur',
    district: 'Guntur District',
    state: 'Andhra Pradesh',
    location: { type: 'Point', coordinates: [80.4365, 16.3067] },
    isAvailable: true,
    lastDonationDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
    donationCount: 6,
    isVerified: true,
    verifiedBy: 'Red Cross Society Guntur',
    readyForEmergency: true,
    notes: 'Available after 4 PM on weekdays, 24/7 on weekends.'
  },
  {
    _id: 'd3',
    fullName: 'K. Rajesh Kumar',
    bloodGroup: 'B+',
    phone: '+91 94401 55678',
    whatsappNumber: '919440155678',
    city: 'Vijayawada',
    district: 'NTR District',
    state: 'Andhra Pradesh',
    location: { type: 'Point', coordinates: [80.6200, 16.5100] },
    isAvailable: false, // Currently in cooldown
    lastDonationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago -> Cooldown
    donationCount: 9,
    isVerified: true,
    verifiedBy: 'Ramesh Hospitals Blood Bank',
    readyForEmergency: false,
    notes: 'Donated 30 days ago. Eligible again in 60 days.'
  },
  {
    _id: 'd4',
    fullName: 'P. Sai Praneeth',
    bloodGroup: 'AB+',
    phone: '+91 99887 76655',
    whatsappNumber: '919988776655',
    city: 'Tenali',
    district: 'Guntur District',
    state: 'Andhra Pradesh',
    location: { type: 'Point', coordinates: [80.6400, 16.2430] },
    isAvailable: true,
    lastDonationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    donationCount: 4,
    isVerified: true,
    verifiedBy: 'Sub-Divisional Hospital, Tenali',
    readyForEmergency: true,
    notes: 'Available for immediate platelet / plasma donation too.'
  },
  {
    _id: 'd5',
    fullName: 'Harika Chowdary',
    bloodGroup: 'O+',
    phone: '+91 91234 56780',
    whatsappNumber: '919123456780',
    city: 'Mangalagiri',
    district: 'Guntur District',
    state: 'Andhra Pradesh',
    location: { type: 'Point', coordinates: [80.5500, 16.4300] },
    isAvailable: true,
    lastDonationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    donationCount: 5,
    isVerified: true,
    verifiedBy: 'AIIMS Mangalagiri Volunteer Wing',
    readyForEmergency: true,
    notes: 'Located right next to AIIMS Mangalagiri emergency corridor.'
  },
  {
    _id: 'd6',
    fullName: 'M. Venkatesh Rao',
    bloodGroup: 'A-',
    phone: '+91 98855 44332',
    whatsappNumber: '919885544332',
    city: 'Hyderabad',
    district: 'Hyderabad District',
    state: 'Telangana',
    location: { type: 'Point', coordinates: [78.4867, 17.3850] },
    isAvailable: true,
    lastDonationDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    donationCount: 8,
    isVerified: true,
    verifiedBy: 'Osmania General Hospital',
    readyForEmergency: true,
    notes: 'Rare negative blood group donor. Ready on 30 min notice.'
  }
];

const initialEquipment = [
  {
    _id: 'eq1',
    ownerName: 'Vaidya Diagnostic & Relief Trust',
    title: 'Philips EverFlo 5L Oxygen Concentrator',
    category: 'oxygen_concentrator',
    description: 'Continuous flow 0.5 to 5 LPM, 93% ± 3% purity. Serviced with new HEPA filter and nasal cannula accessories.',
    condition: 'Sanitized & Certified',
    rentalRatePerDay: 150,
    rentalRatePerMonth: 3500,
    securityDeposit: 2000,
    rentalTerms: 'Free for BPL/EWS families upon hospital referral; subsidized for seniors.',
    status: 'available',
    isFreeEmergency: false,
    city: 'Vijayawada',
    district: 'NTR District',
    address: 'Governorpet, Near Old Bus Stand, Vijayawada',
    contactPhone: '+91 866 2478900',
    whatsappNumber: '918662478900',
    isVerified: true,
    verifiedBy: 'Indian Medical Association (IMA) Vijayawada',
    expectedReturnDate: null,
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'eq2',
    ownerName: 'CarePlus Home Healthcare NGO',
    title: 'ResMed AirSense 10 AutoSet CPAP Machine',
    category: 'cpap_bipap',
    description: 'Auto-adjusting CPAP with HumidAir heated humidifier and ClimateLineAir tube. Sanitized UV-C chamber tested.',
    condition: 'Sanitized & Certified',
    rentalRatePerDay: 200,
    rentalRatePerMonth: 4500,
    securityDeposit: 3000,
    rentalTerms: 'Doctor prescription mandatory. Free sanitization kit included.',
    status: 'available',
    isFreeEmergency: false,
    city: 'Guntur',
    district: 'Guntur District',
    address: 'Kothapet, Near Collectorate, Guntur',
    contactPhone: '+91 863 2223344',
    whatsappNumber: '918632223344',
    isVerified: true,
    verifiedBy: 'Rotary Club Health Mission',
    expectedReturnDate: null,
    imageUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'eq3',
    ownerName: 'Seva Bharathi Medical Equipment Bank',
    title: 'Karma Lightweight Folding Wheelchair (Ergonomic)',
    category: 'wheelchair',
    description: 'Aircraft grade aluminum alloy frame, flip-back armrests, puncture-proof polyurethane tires, double hand brakes.',
    condition: 'Gently Used',
    rentalRatePerDay: 50,
    rentalRatePerMonth: 900,
    securityDeposit: 500,
    rentalTerms: 'Proof of address required. Immediate same-day pickup.',
    status: 'available',
    isFreeEmergency: true,
    city: 'Vijayawada',
    district: 'NTR District',
    address: 'Benz Circle, Ring Road, Vijayawada',
    contactPhone: '+91 94412 34567',
    whatsappNumber: '919441234567',
    isVerified: true,
    verifiedBy: 'District Disability Welfare Dept',
    expectedReturnDate: null,
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'eq4',
    ownerName: 'Apex Pulmonology Center',
    title: 'DeVilbiss 10L High Flow Oxygen Concentrator',
    category: 'oxygen_concentrator',
    description: 'Dual flow meter capable of up to 10 LPM, suited for post-ICU respiratory recovery.',
    condition: 'Sanitized & Certified',
    rentalRatePerDay: 300,
    rentalRatePerMonth: 6500,
    securityDeposit: 4000,
    rentalTerms: 'Deposit refunded on return inspection.',
    status: 'reserved',
    isFreeEmergency: false,
    city: 'Guntur',
    district: 'Guntur District',
    address: 'Arundelpet, Main Road, Guntur',
    contactPhone: '+91 863 2345678',
    whatsappNumber: '918632345678',
    isVerified: true,
    verifiedBy: 'Apex Hospital Panel',
    reservedBy: 'Ramesh Hospital ICU Dept',
    expectedReturnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'eq5',
    ownerName: 'LifeLine Rehabilitation Services',
    title: 'Electric 3-Function ICU Home Hospital Bed',
    category: 'hospital_bed',
    description: 'Motorized backrest, knee-rest, and height elevation with collateral side safety railings and IV stand.',
    condition: 'Good Working Condition',
    rentalRatePerDay: 250,
    rentalRatePerMonth: 5500,
    securityDeposit: 3500,
    rentalTerms: 'Doorstep delivery and assembly available at nominal charges.',
    status: 'available',
    isFreeEmergency: false,
    city: 'Vijayawada',
    district: 'NTR District',
    address: 'Moghalrajpuram, Vijayawada',
    contactPhone: '+91 866 2554433',
    whatsappNumber: '918662554433',
    isVerified: true,
    verifiedBy: 'Andhra Hospitals Network',
    expectedReturnDate: null,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'eq6',
    ownerName: 'Community Relief Center',
    title: 'Portable Electric Phlegm Suction Machine 20L',
    category: 'suction_machine',
    description: 'Oil-free piston pump, high negative pressure, large flux, transparent collection jar with overflow valve.',
    condition: 'Sanitized & Certified',
    rentalRatePerDay: 75,
    rentalRatePerMonth: 1200,
    securityDeposit: 1000,
    rentalTerms: 'Includes 2 sterile suction catheters.',
    status: 'available',
    isFreeEmergency: true,
    city: 'Tenali',
    district: 'Guntur District',
    address: 'Station Road, Tenali',
    contactPhone: '+91 98499 88776',
    whatsappNumber: '919849988776',
    isVerified: true,
    verifiedBy: 'Tenali Lions Club',
    expectedReturnDate: null,
    imageUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=800&auto=format&fit=crop&q=80'
  }
];

const initialEmergencyRequests = [
  {
    _id: 'em1',
    requestType: 'blood',
    patientName: 'K. Venkata Rao (Age 58)',
    hospitalName: 'Government General Hospital (GGH), Vijayawada',
    doctorInCharge: 'Dr. M. Srinivasa Rao (Cardiology)',
    bloodGroup: 'O-',
    unitsRequired: 2,
    urgencyLevel: 'CRITICAL',
    requiredWithinHours: 2,
    city: 'Vijayawada',
    district: 'NTR District',
    hospitalAddress: 'Emergency Trauma Ward 3, GGH, Gunadala Road, Vijayawada',
    attendantName: 'K. Sai Krishna (Son)',
    attendantPhone: '+91 98481 99881',
    whatsappNumber: '919848199881',
    verificationStatus: 'VERIFIED_HOSPITAL',
    verifiedBy: 'Chief Medical Officer - GGH Vijayawada',
    medicalSummary: 'Emergency open-heart bypass surgery scheduled in 2 hours. Rare O-negative blood units urgently needed.',
    status: 'ACTIVE',
    responsesCount: 3,
    whatsappBroadcastSent: true,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 mins ago
  },
  {
    _id: 'em2',
    requestType: 'equipment',
    patientName: 'Lakshmi Devi (Age 72)',
    hospitalName: 'Home Care (Discharged from NRI Hospital)',
    doctorInCharge: 'Dr. P. Radhika (Pulmonologist)',
    equipmentCategory: 'oxygen_concentrator',
    urgencyLevel: 'CRITICAL',
    requiredWithinHours: 3,
    city: 'Guntur',
    district: 'Guntur District',
    hospitalAddress: 'House No 4-12, Pattabhipuram, Guntur',
    attendantName: 'G. Ramesh (Son-in-law)',
    attendantPhone: '+91 99490 12388',
    whatsappNumber: '919949012388',
    verificationStatus: 'COMMUNITY_VERIFIED',
    verifiedBy: 'Guntur Pulmonology Care Network',
    medicalSummary: 'SpO2 dropping below 82% after discharge from severe pneumonia. Urgent 5L or 10L oxygen concentrator required immediately.',
    status: 'ACTIVE',
    responsesCount: 2,
    whatsappBroadcastSent: true,
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    _id: 'em3',
    requestType: 'blood',
    patientName: 'Priya Sharma (Age 26)',
    hospitalName: 'Ramesh Hospitals, Guntur',
    doctorInCharge: 'Dr. C. Anitha (Obstetrics)',
    bloodGroup: 'B-',
    unitsRequired: 3,
    urgencyLevel: 'HIGH',
    requiredWithinHours: 5,
    city: 'Guntur',
    district: 'Guntur District',
    hospitalAddress: 'Maternity Ward, Ramesh Hospitals, Collector Office Road',
    attendantName: 'Vikram Sharma (Husband)',
    attendantPhone: '+91 97000 44556',
    whatsappNumber: '919700044556',
    verificationStatus: 'VERIFIED_HOSPITAL',
    verifiedBy: 'Blood Bank Officer - Ramesh Hospitals',
    medicalSummary: 'Severe postpartum hemorrhage (PPH) during emergency C-section delivery. Urgent B-Negative whole blood or PRBC required.',
    status: 'ACTIVE',
    responsesCount: 1,
    whatsappBroadcastSent: true,
    createdAt: new Date(Date.now() - 140 * 60 * 1000).toISOString()
  },
  {
    _id: 'em4',
    requestType: 'equipment',
    patientName: 'T. Subrahmanyam (Age 64)',
    hospitalName: 'Ayush Hospitals, Vijayawada',
    doctorInCharge: 'Dr. N. Kalyan (Neurosurgeon)',
    equipmentCategory: 'wheelchair',
    urgencyLevel: 'MODERATE',
    requiredWithinHours: 24,
    city: 'Vijayawada',
    district: 'NTR District',
    hospitalAddress: 'Flat 302, Sri Krishna Apts, Benz Circle, Vijayawada',
    attendantName: 'T. Bhavani (Wife)',
    attendantPhone: '+91 98492 33441',
    whatsappNumber: '919849233441',
    verificationStatus: 'COMMUNITY_VERIFIED',
    verifiedBy: 'Ayush Rehab Department',
    medicalSummary: 'Post-stroke rehab patient needing reclining or high-back wheelchair for daily physiotherapy movement.',
    status: 'ACTIVE',
    responsesCount: 0,
    whatsappBroadcastSent: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'em5',
    requestType: 'blood',
    patientName: 'Master Abhiram (Age 8)',
    hospitalName: 'Rainbow Children Hospital, Vijayawada',
    doctorInCharge: 'Dr. S. K. Roy (Pediatric Hematology)',
    bloodGroup: 'A+',
    unitsRequired: 1,
    urgencyLevel: 'HIGH',
    requiredWithinHours: 6,
    city: 'Vijayawada',
    district: 'NTR District',
    hospitalAddress: 'Rainbow Children Hospital, Currency Nagar, Vijayawada',
    attendantName: 'V. Ramanjaneyulu (Father)',
    attendantPhone: '+91 94900 88221',
    whatsappNumber: '919490088221',
    verificationStatus: 'VERIFIED_HOSPITAL',
    verifiedBy: 'Pediatric Blood Bank Coordinator',
    medicalSummary: 'Thalassemia major regular transfusion schedule delayed due to low hospital bank inventory.',
    status: 'FULFILLED',
    resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    responsesCount: 5,
    whatsappBroadcastSent: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const initialDonationHistory = [
  {
    _id: 'dh1',
    recordType: 'blood_donation',
    bloodGroup: 'O-',
    unitsGiven: 1,
    hospitalOrCamp: 'GGH Vijayawada Emergency Blood Bank',
    recipientPatient: 'Emergency Accident Trauma Case',
    donationDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    nextEligibleDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'COMPLETED',
    verifiedByHospital: true,
    notes: 'Voluntary replacement donation for emergency ICU patient.'
  },
  {
    _id: 'dh2',
    recordType: 'blood_donation',
    bloodGroup: 'O-',
    unitsGiven: 1,
    hospitalOrCamp: 'Rotary Blood Bank Annual Camp',
    recipientPatient: 'Pediatric Thalassemia Reserve',
    donationDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'COMPLETED',
    verifiedByHospital: true,
    notes: 'Certificate of appreciation awarded.'
  },
  {
    _id: 'dh3',
    recordType: 'equipment_lent',
    equipmentTitle: 'Karma Folding Wheelchair',
    equipmentId: 'eq3',
    borrowedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    expectedReturnDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE_LOAN',
    verifiedByHospital: true,
    notes: 'Lent to patient undergoing knee replacement recovery.'
  },
  {
    _id: 'dh4',
    recordType: 'equipment_lent',
    equipmentTitle: 'DeVilbiss 10L Oxygen Concentrator',
    equipmentId: 'eq4',
    borrowedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expectedReturnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE_LOAN',
    verifiedByHospital: true,
    notes: 'Hospital ICU referral reservation.'
  }
];

const initialUsers = [
  {
    _id: 'u1',
    name: 'Dr. Suresh Varma',
    email: 'donor@medsupply.org',
    password: '$2a$10$wT7RcmZ0yXW9w6k6bVdCcuuX0Bw8dO90zWlA9v7Nkqz5K1H8X5Q7a', // demo123
    phone: '+91 98480 12345',
    role: 'donor',
    city: 'Vijayawada',
    district: 'NTR District',
    isVerified: true,
    verificationOrg: 'GGH Vijayawada'
  },
  {
    _id: 'u2',
    name: 'Vaidya Diagnostic & Relief Trust',
    email: 'equipment@medsupply.org',
    password: '$2a$10$wT7RcmZ0yXW9w6k6bVdCcuuX0Bw8dO90zWlA9v7Nkqz5K1H8X5Q7a', // demo123
    phone: '+91 866 2478900',
    role: 'equipment_owner',
    city: 'Vijayawada',
    district: 'NTR District',
    isVerified: true,
    verificationOrg: 'IMA District Chapter'
  },
  {
    _id: 'u3',
    name: 'Emergency Desk - Dr. Radhika',
    email: 'hospital@medsupply.org',
    password: '$2a$10$wT7RcmZ0yXW9w6k6bVdCcuuX0Bw8dO90zWlA9v7Nkqz5K1H8X5Q7a', // demo123
    phone: '+91 863 2223344',
    role: 'hospital',
    city: 'Guntur',
    district: 'Guntur District',
    isVerified: true,
    verificationOrg: 'District Medical & Health Department'
  },
  {
    _id: 'u4',
    name: 'Rajesh Patient Attendant',
    email: 'patient@medsupply.org',
    password: '$2a$10$wT7RcmZ0yXW9w6k6bVdCcuuX0Bw8dO90zWlA9v7Nkqz5K1H8X5Q7a', // demo123
    phone: '+91 98481 99881',
    role: 'patient',
    city: 'Vijayawada',
    district: 'NTR District',
    isVerified: true,
    verificationOrg: 'Community Verified'
  }
];

class MockStore {
  constructor() {
    this.donors = [...initialDonors];
    this.equipment = [...initialEquipment];
    this.emergencyRequests = [...initialEmergencyRequests];
    this.donationHistory = [...initialDonationHistory];
    this.users = [...initialUsers];
  }

  // Donors
  getDonors(filter = {}) {
    let list = [...this.donors];
    if (filter.bloodGroup) {
      list = list.filter(d => d.bloodGroup.toUpperCase() === filter.bloodGroup.toUpperCase());
    }
    if (filter.city) {
      list = list.filter(d => d.city.toLowerCase().includes(filter.city.toLowerCase()));
    }
    if (filter.district) {
      list = list.filter(d => d.district.toLowerCase().includes(filter.district.toLowerCase()));
    }
    if (filter.isAvailable !== undefined) {
      const isAvail = filter.isAvailable === 'true' || filter.isAvailable === true;
      list = list.filter(d => d.isAvailable === isAvail);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(d =>
        d.fullName.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.bloodGroup.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getDonorById(id) {
    return this.donors.find(d => d._id === id);
  }

  addDonor(donorData) {
    const newDonor = {
      _id: 'd_' + Date.now(),
      donationCount: 0,
      isVerified: false,
      readyForEmergency: true,
      createdAt: new Date().toISOString(),
      ...donorData
    };
    this.donors.unshift(newDonor);
    return newDonor;
  }

  updateDonor(id, updateData) {
    const idx = this.donors.findIndex(d => d._id === id);
    if (idx === -1) return null;
    this.donors[idx] = { ...this.donors[idx], ...updateData, updatedAt: new Date().toISOString() };
    return this.donors[idx];
  }

  toggleDonorAvailability(id) {
    const donor = this.getDonorById(id);
    if (!donor) return null;
    donor.isAvailable = !donor.isAvailable;
    donor.updatedAt = new Date().toISOString();
    return donor;
  }

  deleteDonor(id) {
    const idx = this.donors.findIndex(d => d._id === id);
    if (idx === -1) return false;
    this.donors.splice(idx, 1);
    return true;
  }

  // Equipment
  getEquipment(filter = {}) {
    let list = [...this.equipment];
    if (filter.category && filter.category !== 'all') {
      list = list.filter(e => e.category === filter.category);
    }
    if (filter.city) {
      list = list.filter(e => e.city.toLowerCase().includes(filter.city.toLowerCase()));
    }
    if (filter.district) {
      list = list.filter(e => e.district.toLowerCase().includes(filter.district.toLowerCase()));
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter(e => e.status === filter.status);
    }
    if (filter.isFreeEmergency !== undefined) {
      const isFree = filter.isFreeEmergency === 'true' || filter.isFreeEmergency === true;
      list = list.filter(e => e.isFreeEmergency === isFree);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.district.toLowerCase().includes(q) ||
        e.ownerName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getEquipmentById(id) {
    return this.equipment.find(e => e._id === id);
  }

  addEquipment(equipmentData) {
    const newEquipment = {
      _id: 'eq_' + Date.now(),
      status: 'available',
      isVerified: true,
      verifiedBy: 'Community Health Portal',
      createdAt: new Date().toISOString(),
      ...equipmentData
    };
    this.equipment.unshift(newEquipment);
    return newEquipment;
  }

  updateEquipment(id, updateData) {
    const idx = this.equipment.findIndex(e => e._id === id);
    if (idx === -1) return null;
    this.equipment[idx] = { ...this.equipment[idx], ...updateData, updatedAt: new Date().toISOString() };
    return this.equipment[idx];
  }

  toggleEquipmentStatus(id, newStatus, extra = {}) {
    const eq = this.getEquipmentById(id);
    if (!eq) return null;
    eq.status = newStatus || (eq.status === 'available' ? 'reserved' : 'available');
    if (extra.reservedBy !== undefined) eq.reservedBy = extra.reservedBy;
    if (extra.expectedReturnDate !== undefined) eq.expectedReturnDate = extra.expectedReturnDate;
    eq.updatedAt = new Date().toISOString();
    return eq;
  }

  deleteEquipment(id) {
    const idx = this.equipment.findIndex(e => e._id === id);
    if (idx === -1) return false;
    this.equipment.splice(idx, 1);
    return true;
  }

  // Emergency Requests
  getEmergencyRequests(filter = {}) {
    let list = [...this.emergencyRequests];
    if (filter.status && filter.status !== 'all') {
      list = list.filter(r => r.status === filter.status);
    }
    if (filter.urgencyLevel && filter.urgencyLevel !== 'all') {
      list = list.filter(r => r.urgencyLevel === filter.urgencyLevel);
    }
    if (filter.requestType && filter.requestType !== 'all') {
      list = list.filter(r => r.requestType === filter.requestType);
    }
    if (filter.bloodGroup && filter.bloodGroup !== 'all') {
      list = list.filter(r => r.bloodGroup === filter.bloodGroup);
    }
    if (filter.city) {
      list = list.filter(r => r.city.toLowerCase().includes(filter.city.toLowerCase()));
    }
    if (filter.district) {
      list = list.filter(r => r.district.toLowerCase().includes(filter.district.toLowerCase()));
    }
    // Sort critical and latest first
    list.sort((a, b) => {
      if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
      if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
      const urgencyRank = { CRITICAL: 3, HIGH: 2, MODERATE: 1 };
      const diff = (urgencyRank[b.urgencyLevel] || 0) - (urgencyRank[a.urgencyLevel] || 0);
      if (diff !== 0) return diff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return list;
  }

  getEmergencyRequestById(id) {
    return this.emergencyRequests.find(r => r._id === id);
  }

  addEmergencyRequest(reqData) {
    const newReq = {
      _id: 'em_' + Date.now(),
      status: 'ACTIVE',
      responsesCount: 0,
      whatsappBroadcastSent: false,
      verificationStatus: reqData.verificationStatus || 'COMMUNITY_VERIFIED',
      verifiedBy: reqData.verifiedBy || 'Citizen Emergency Desk',
      createdAt: new Date().toISOString(),
      ...reqData
    };
    this.emergencyRequests.unshift(newReq);
    return newReq;
  }

  updateEmergencyRequest(id, updateData) {
    const idx = this.emergencyRequests.findIndex(r => r._id === id);
    if (idx === -1) return null;
    this.emergencyRequests[idx] = { ...this.emergencyRequests[idx], ...updateData, updatedAt: new Date().toISOString() };
    return this.emergencyRequests[idx];
  }

  resolveEmergencyRequest(id) {
    const req = this.getEmergencyRequestById(id);
    if (!req) return null;
    req.status = 'FULFILLED';
    req.resolvedAt = new Date().toISOString();
    return req;
  }

  // Donation and Return History
  getDashboardData() {
    return {
      donationHistory: this.donationHistory,
      activeLoans: this.equipment.filter(e => e.status === 'rented' || e.status === 'reserved'),
      myEmergencyRequests: this.emergencyRequests,
      summaryStats: {
        totalDonations: this.donationHistory.filter(h => h.recordType === 'blood_donation').length,
        activeRequests: this.emergencyRequests.filter(r => r.status === 'ACTIVE').length,
        criticalCases: this.emergencyRequests.filter(r => r.status === 'ACTIVE' && r.urgencyLevel === 'CRITICAL').length,
        availableEquipment: this.equipment.filter(e => e.status === 'available').length,
        readyDonors: this.donors.filter(d => d.isAvailable).length
      }
    };
  }

  addDonationRecord(record) {
    const newRecord = {
      _id: 'dh_' + Date.now(),
      donationDate: new Date().toISOString(),
      status: 'COMPLETED',
      verifiedByHospital: true,
      ...record
    };
    this.donationHistory.unshift(newRecord);
    return newRecord;
  }
}

const mockStore = new MockStore();

module.exports = mockStore;
