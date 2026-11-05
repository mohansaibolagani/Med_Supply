const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const config = require('../config/config');
const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const Equipment = require('../models/Equipment');
const EmergencyRequest = require('../models/EmergencyRequest');
const DonationHistory = require('../models/DonationHistory');

const seedDatabase = async () => {
  try {
    console.log(`[Seed Script] Connecting to MongoDB: ${config.MONGODB_URI}`);
    await mongoose.connect(config.MONGODB_URI);
    console.log('[Seed Script] Connected. Clearing existing collections...');

    await User.deleteMany();
    await DonorProfile.deleteMany();
    await Equipment.deleteMany();
    await EmergencyRequest.deleteMany();
    await DonationHistory.deleteMany();

    console.log('[Seed Script] Seeding Demo Users...');
    const users = await User.create([
      {
        name: 'Dr. Suresh Varma',
        email: 'donor@medsupply.org',
        password: 'Password@123',
        phone: '+91 98480 12345',
        role: 'donor',
        city: 'Vijayawada',
        district: 'NTR District',
        isVerified: true,
        verificationOrg: 'GGH Vijayawada'
      },
      {
        name: 'Vaidya Diagnostic & Relief Trust',
        email: 'equipment@medsupply.org',
        password: 'Password@123',
        phone: '+91 866 2478900',
        role: 'equipment_owner',
        city: 'Vijayawada',
        district: 'NTR District',
        isVerified: true,
        verificationOrg: 'IMA District Chapter'
      },
      {
        name: 'Emergency Desk - Dr. Radhika',
        email: 'hospital@medsupply.org',
        password: 'Password@123',
        phone: '+91 863 2223344',
        role: 'hospital',
        city: 'Guntur',
        district: 'Guntur District',
        isVerified: true,
        verificationOrg: 'District Health Medical Dept'
      },
      {
        name: 'Rajesh Patient Attendant',
        email: 'patient@medsupply.org',
        password: 'Password@123',
        phone: '+91 98481 99881',
        role: 'patient',
        city: 'Vijayawada',
        district: 'NTR District',
        isVerified: true,
        verificationOrg: 'Community Verified'
      }
    ]);

    console.log('[Seed Script] Seeding Blood Donors...');
    await DonorProfile.create([
      {
        user: users[0]._id,
        fullName: 'Dr. Suresh Varma',
        bloodGroup: 'O-',
        phone: '+91 98480 12345',
        whatsappNumber: '919848012345',
        city: 'Vijayawada',
        district: 'NTR District',
        location: { type: 'Point', coordinates: [80.6480, 16.5062] },
        isAvailable: true,
        lastDonationDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
        donationCount: 14,
        isVerified: true,
        verifiedBy: 'Government General Hospital, Vijayawada',
        readyForEmergency: true,
        notes: 'Universal donor. Ready for critical emergency calls within 15 km.'
      },
      {
        fullName: 'Ananya Reddy',
        bloodGroup: 'A+',
        phone: '+91 98765 43210',
        whatsappNumber: '919876543210',
        city: 'Guntur',
        district: 'Guntur District',
        location: { type: 'Point', coordinates: [80.4365, 16.3067] },
        isAvailable: true,
        lastDonationDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
        donationCount: 6,
        isVerified: true,
        verifiedBy: 'Red Cross Society Guntur',
        readyForEmergency: true,
        notes: 'Available after 4 PM on weekdays, 24/7 on weekends.'
      },
      {
        fullName: 'K. Rajesh Kumar',
        bloodGroup: 'B+',
        phone: '+91 94401 55678',
        whatsappNumber: '919440155678',
        city: 'Vijayawada',
        district: 'NTR District',
        location: { type: 'Point', coordinates: [80.6200, 16.5100] },
        isAvailable: false,
        lastDonationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        donationCount: 9,
        isVerified: true,
        verifiedBy: 'Ramesh Hospitals Blood Bank',
        readyForEmergency: false,
        notes: 'Donated 30 days ago. Cooldown active.'
      },
      {
        fullName: 'P. Sai Praneeth',
        bloodGroup: 'AB+',
        phone: '+91 99887 76655',
        whatsappNumber: '919988776655',
        city: 'Tenali',
        district: 'Guntur District',
        location: { type: 'Point', coordinates: [80.6400, 16.2430] },
        isAvailable: true,
        lastDonationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        donationCount: 4,
        isVerified: true,
        verifiedBy: 'Sub-Divisional Hospital, Tenali',
        readyForEmergency: true,
        notes: 'Available for immediate platelet / plasma donation too.'
      },
      {
        fullName: 'Harika Chowdary',
        bloodGroup: 'O+',
        phone: '+91 91234 56780',
        whatsappNumber: '919123456780',
        city: 'Mangalagiri',
        district: 'Guntur District',
        location: { type: 'Point', coordinates: [80.5500, 16.4300] },
        isAvailable: true,
        lastDonationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        donationCount: 5,
        isVerified: true,
        verifiedBy: 'AIIMS Mangalagiri Volunteer Wing',
        readyForEmergency: true,
        notes: 'Located right next to AIIMS Mangalagiri emergency corridor.'
      },
      {
        fullName: 'M. Venkatesh Rao',
        bloodGroup: 'A-',
        phone: '+91 98855 44332',
        whatsappNumber: '919885544332',
        city: 'Hyderabad',
        district: 'Hyderabad District',
        location: { type: 'Point', coordinates: [78.4867, 17.3850] },
        isAvailable: true,
        lastDonationDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
        donationCount: 8,
        isVerified: true,
        verifiedBy: 'Osmania General Hospital',
        readyForEmergency: true,
        notes: 'Rare negative blood group donor. Ready on short notice.'
      }
    ]);

    console.log('[Seed Script] Seeding Urgent Medical Equipment...');
    const eq1 = await Equipment.create({
      owner: users[1]._id,
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
      imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&auto=format&fit=crop&q=80',
      location: { type: 'Point', coordinates: [80.6480, 16.5062] }
    });

    const eq2 = await Equipment.create({
      owner: users[1]._id,
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
      imageUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=800&auto=format&fit=crop&q=80',
      location: { type: 'Point', coordinates: [80.4365, 16.3067] }
    });

    const eq3 = await Equipment.create({
      owner: users[1]._id,
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
      imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
      location: { type: 'Point', coordinates: [80.6480, 16.5062] }
    });

    await Equipment.create({
      owner: users[1]._id,
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
      reservedBy: 'Ramesh Hospital ICU Dept',
      expectedReturnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isFreeEmergency: false,
      city: 'Guntur',
      district: 'Guntur District',
      address: 'Arundelpet, Main Road, Guntur',
      contactPhone: '+91 863 2345678',
      whatsappNumber: '918632345678',
      isVerified: true,
      verifiedBy: 'Apex Hospital Panel',
      imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&auto=format&fit=crop&q=80',
      location: { type: 'Point', coordinates: [80.4365, 16.3067] }
    });

    console.log('[Seed Script] Seeding Live Emergency Requests...');
    await EmergencyRequest.create([
      {
        requester: users[3]._id,
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
        location: { type: 'Point', coordinates: [80.6480, 16.5062] }
      },
      {
        requester: users[3]._id,
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
        location: { type: 'Point', coordinates: [80.4365, 16.3067] }
      },
      {
        requester: users[3]._id,
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
        location: { type: 'Point', coordinates: [80.4365, 16.3067] }
      }
    ]);

    console.log('[Seed Script] Seeding User Donation History & Equipment Returns...');
    await DonationHistory.create([
      {
        user: users[0]._id,
        recordType: 'blood_donation',
        bloodGroup: 'O-',
        unitsGiven: 1,
        hospitalOrCamp: 'GGH Vijayawada Emergency Blood Bank',
        recipientPatient: 'Emergency Accident Trauma Case',
        donationDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
        status: 'COMPLETED',
        verifiedByHospital: true,
        notes: 'Voluntary replacement donation for emergency ICU patient.'
      },
      {
        user: users[0]._id,
        recordType: 'blood_donation',
        bloodGroup: 'O-',
        unitsGiven: 1,
        hospitalOrCamp: 'Rotary Blood Bank Annual Camp',
        recipientPatient: 'Pediatric Thalassemia Reserve',
        donationDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
        status: 'COMPLETED',
        verifiedByHospital: true,
        notes: 'Certificate of appreciation awarded.'
      },
      {
        user: users[1]._id,
        recordType: 'equipment_lent',
        equipmentTitle: 'Karma Folding Wheelchair',
        equipmentId: eq3._id,
        borrowedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        expectedReturnDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE_LOAN',
        verifiedByHospital: true,
        notes: 'Lent to patient undergoing knee replacement recovery.'
      }
    ]);

    console.log('✅ [Seed Script] Seed data imported successfully into MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Script Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
