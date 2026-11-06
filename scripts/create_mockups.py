import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('docs/screenshots', exist_ok=True)

def create_emergency_feed_mockup():
    img = Image.new('RGB', (1000, 600), color='#0F172A')
    draw = ImageDraw.Draw(img)
    
    # Top bar
    draw.rectangle([0, 0, 1000, 70], fill='#1E293B')
    draw.text((30, 22), "MedSupply • Live Emergency SOS Feed (Vijayawada & Guntur)", fill='#F8FAFC')
    draw.rectangle([820, 18, 970, 52], fill='#DC2626', outline='#EF4444', width=1)
    draw.text((840, 26), "🚨 3 CRITICAL", fill='#FFFFFF')
    
    # Card 1 (Critical)
    draw.rectangle([30, 90, 970, 310], fill='#1E293B', outline='#DC2626', width=2)
    # Urgency Badge
    draw.rectangle([50, 110, 240, 140], fill='#DC2626')
    draw.text((60, 117), "CRITICAL (< 2 HOURS)", fill='#FFFFFF')
    # Blood Group Pill
    draw.rectangle([250, 110, 360, 140], fill='#7F1D1D')
    draw.text((270, 117), "🩸 O+ POSITIVE", fill='#FECACA')
    # Hospital Badge
    draw.rectangle([370, 110, 550, 140], fill='#064E3B')
    draw.text((385, 117), "✓ GGH VIJAYAWADA", fill='#6EE7B7')
    
    draw.text((50, 155), "Patient: K. Ramesh Babu (Trauma Care ICU, Bed 14)", fill='#FFFFFF')
    draw.text((50, 185), "Required: 3 Units Whole Blood / PRBC for emergency pelvic fracture surgery", fill='#CBD5E1')
    draw.text((50, 215), "Contact: Dr. M. Rao (Attendant: +91 98480 12345) • Distance: 1.8 km", fill='#94A3B8')
    
    # WhatsApp Action Button
    draw.rectangle([50, 255, 300, 295], fill='#059669')
    draw.text((65, 267), "💬 WhatsApp Direct Action", fill='#FFFFFF')
    draw.rectangle([320, 255, 520, 295], fill='#334155')
    draw.text((345, 267), "📞 Call Hospital Ward", fill='#F8FAFC')
    
    # Card 2 (Urgent)
    draw.rectangle([30, 330, 970, 560], fill='#1E293B', outline='#D97706', width=2)
    draw.rectangle([50, 350, 240, 380], fill='#D97706')
    draw.text((60, 357), "URGENT (< 6 HOURS)", fill='#FFFFFF')
    draw.rectangle([250, 350, 360, 380], fill='#78350F')
    draw.text((270, 357), "🩸 AB- NEGATIVE", fill='#FDE68A')
    draw.rectangle([370, 350, 550, 380], fill='#064E3B')
    draw.text((385, 357), "✓ AIIMS MANGALAGIRI", fill='#6EE7B7')
    
    draw.text((50, 395), "Patient: S. Lakshmi (Oncology Ward, Bed 08)", fill='#FFFFFF')
    draw.text((50, 425), "Required: 2 Units Platelets for post-chemotherapy recovery", fill='#CBD5E1')
    draw.text((50, 455), "Contact: Attendant Venkat (+91 94401 67890) • Distance: 5.2 km", fill='#94A3B8')
    draw.rectangle([50, 495, 300, 535], fill='#059669')
    draw.text((65, 507), "💬 WhatsApp Direct Action", fill='#FFFFFF')

    img.save('docs/screenshots/screenshot_emergency_feed.png')
    print("Emergency feed mockup created")

def create_donor_directory_mockup():
    img = Image.new('RGB', (1000, 600), color='#0F172A')
    draw = ImageDraw.Draw(img)
    
    # Top bar
    draw.rectangle([0, 0, 1000, 70], fill='#1E293B')
    draw.text((30, 22), "MedSupply • Blood Donor Directory & 90-Day Clinical Cooldown", fill='#F8FAFC')
    draw.rectangle([780, 18, 970, 52], fill='#0D9488')
    draw.text((800, 26), "✓ GEOSPATIAL SEARCH", fill='#FFFFFF')
    
    # Donor 1 (Available)
    draw.rectangle([30, 90, 480, 560], fill='#1E293B', outline='#059669', width=2)
    draw.rectangle([50, 110, 130, 160], fill='#DC2626')
    draw.text((70, 122), "O+", fill='#FFFFFF')
    draw.text((150, 115), "V. Satyanarayana", fill='#FFFFFF')
    draw.text((150, 140), "Suryaraopeta, Vijayawada", fill='#94A3B8')
    
    draw.rectangle([50, 180, 250, 210], fill='#059669')
    draw.text((65, 187), "✓ ELIGIBLE TO DONATE", fill='#FFFFFF')
    
    draw.text((50, 240), "• Total Donations: 8 Times", fill='#CBD5E1')
    draw.text((50, 270), "• Last Donated: 14 Oct 2025", fill='#CBD5E1')
    draw.text((50, 300), "• Clinical Cooldown: COMPLETED (90+ Days)", fill='#34D399')
    draw.text((50, 330), "• Verification: Aadhaar & Blood Bank Stamp", fill='#CBD5E1')
    draw.text((50, 360), "• Phone: +91 98491 11223", fill='#94A3B8')
    
    draw.rectangle([50, 480, 460, 530], fill='#059669')
    draw.text((160, 497), "💬 Contact Donor via WhatsApp", fill='#FFFFFF')
    
    # Donor 2 (Cooldown Active)
    draw.rectangle([520, 90, 970, 560], fill='#1E293B', outline='#D97706', width=2)
    draw.rectangle([540, 110, 620, 160], fill='#DC2626')
    draw.text((560, 122), "B+", fill='#FFFFFF')
    draw.text((640, 115), "P. Ananya Sharma", fill='#FFFFFF')
    draw.text((640, 140), "Brodipet, Guntur", fill='#94A3B8')
    
    draw.rectangle([540, 180, 780, 210], fill='#B45309')
    draw.text((555, 187), "⏳ 90-DAY COOLDOWN ACTIVE", fill='#FEF3C7')
    
    draw.text((540, 240), "• Total Donations: 3 Times", fill='#CBD5E1')
    draw.text((540, 270), "• Last Donated: 18 Jan 2026", fill='#CBD5E1')
    draw.text((540, 300), "• Cooldown Remaining: 68 Days Left", fill='#FBBF24')
    draw.text((540, 330), "• Next Eligible: 18 April 2026", fill='#FCD34D')
    draw.text((540, 360), "• Health Protection: Automated Hold", fill='#CBD5E1')
    
    draw.rectangle([540, 480, 950, 530], fill='#334155')
    draw.text((640, 497), "Protected by 90-Day Medical Rule", fill='#94A3B8')

    img.save('docs/screenshots/screenshot_donor_directory.png')
    print("Donor directory mockup created")

def create_equipment_exchange_mockup():
    img = Image.new('RGB', (1000, 600), color='#0F172A')
    draw = ImageDraw.Draw(img)
    
    # Top bar
    draw.rectangle([0, 0, 1000, 70], fill='#1E293B')
    draw.text((30, 22), "MedSupply • Medical Equipment Urgent Rental Exchange", fill='#F8FAFC')
    draw.rectangle([760, 18, 970, 52], fill='#2563EB')
    draw.text((780, 26), "🩺 14 UNITS READY", fill='#FFFFFF')
    
    # Equipment 1
    draw.rectangle([30, 90, 480, 560], fill='#1E293B', outline='#2563EB', width=2)
    draw.rectangle([50, 110, 250, 140], fill='#1E40AF')
    draw.text((65, 117), "OXYGEN CONCENTRATOR", fill='#BFDBFE')
    
    draw.text((50, 155), "Philips EverFlo 10-Litre Unit", fill='#FFFFFF')
    draw.text((50, 185), "High-purity continuous oxygen therapy (93% +/- 3%)", fill='#94A3B8')
    
    draw.rectangle([50, 220, 220, 260], fill='#064E3B')
    draw.text((65, 232), "₹450 / Day Rental", fill='#6EE7B7')
    draw.rectangle([230, 220, 430, 260], fill='#334155')
    draw.text((245, 232), "Deposit: ₹2,000 (Refundable)", fill='#E2E8F0')
    
    draw.text((50, 280), "• Owner: Apollo Home-Care Diagnostics", fill='#CBD5E1')
    draw.text((50, 310), "• Location: Benz Circle, Vijayawada", fill='#CBD5E1')
    draw.text((50, 340), "• Sanitized & Bio-Cylinder Certified", fill='#34D399')
    draw.text((50, 370), "• Delivery Available: Yes (Within 45 Mins)", fill='#CBD5E1')
    
    draw.rectangle([50, 480, 460, 530], fill='#2563EB')
    draw.text((150, 497), "⚡ Book Urgent Rental", fill='#FFFFFF')
    
    # Equipment 2
    draw.rectangle([520, 90, 970, 560], fill='#1E293B', outline='#059669', width=2)
    draw.rectangle([540, 110, 750, 140], fill='#064E3B')
    draw.text((555, 117), "COMMUNITY WELFARE LOAN", fill='#A7F3D0')
    
    draw.text((540, 155), "Heavy-Duty Foldable Wheelchair", fill='#FFFFFF')
    draw.text((540, 185), "Chrome steel frame, ergonomic dual brakes", fill='#94A3B8')
    
    draw.rectangle([540, 220, 710, 260], fill='#047857')
    draw.text((555, 232), "FREE URGENT LOAN", fill='#FFFFFF')
    draw.rectangle([720, 220, 910, 260], fill='#334155')
    draw.text((735, 232), "Deposit: ₹0 (Waived)", fill='#E2E8F0')
    
    draw.text((540, 280), "• Sponsor: Rotary Club Guntur South", fill='#CBD5E1')
    draw.text((540, 310), "• Location: Arundelpet, Guntur", fill='#CBD5E1')
    draw.text((540, 340), "• Intended for: Post-Op / Senior Citizens", fill='#34D399')
    draw.text((540, 370), "• Status: Cleaned, Ready for Pickup", fill='#CBD5E1')
    
    draw.rectangle([540, 480, 950, 530], fill='#059669')
    draw.text((650, 497), "🤝 Request Free Loan", fill='#FFFFFF')

    img.save('docs/screenshots/screenshot_equipment_exchange.png')
    print("Equipment exchange mockup created")

def create_user_dashboard_mockup():
    img = Image.new('RGB', (1000, 600), color='#0F172A')
    draw = ImageDraw.Draw(img)
    
    # Top bar
    draw.rectangle([0, 0, 1000, 70], fill='#1E293B')
    draw.text((30, 22), "MedSupply • Attendant Dashboard & Active Return Tracker", fill='#F8FAFC')
    draw.rectangle([780, 18, 970, 52], fill='#7C3AED')
    draw.text((800, 26), "👤 MOHAN SAI (ADMIN)", fill='#FFFFFF')
    
    # Active Rental Return Tracker Card
    draw.rectangle([30, 90, 970, 310], fill='#1E293B', outline='#7C3AED', width=2)
    draw.rectangle([50, 110, 260, 140], fill='#6D28D9')
    draw.text((65, 117), "ACTIVE RENTAL IN PROGRESS", fill='#EDE9FE')
    
    draw.text((50, 155), "Item: ResMed AirSense 10 Auto CPAP Machine (Serial #MS-CP-902)", fill='#FFFFFF')
    draw.text((50, 185), "Rented To: Patient K. Venkata Rao (Pulmonology Ward, Kamineni Hospital)", fill='#CBD5E1')
    draw.text((50, 215), "Loan Date: 20 Jan 2026 • Return Deadline: 20 Feb 2026 (14 Days Remaining)", fill='#A78BFA')
    
    draw.rectangle([50, 255, 300, 295], fill='#059669')
    draw.text((80, 267), "✓ Mark Returned & Release Deposit", fill='#FFFFFF')
    draw.rectangle([320, 255, 500, 295], fill='#334155')
    draw.text((345, 267), "Extend Rental Period", fill='#F8FAFC')
    
    # Stats row
    stats = [
        ("Total Emergency SOS Broadcasts", "24 Requests", "#DC2626"),
        ("Verified Donors Available", "42 Donors", "#059669"),
        ("Medical Equipments in Fleet", "18 Units", "#2563EB")
    ]
    for idx, (title, val, color) in enumerate(stats):
        x1 = 30 + idx * 320
        x2 = x1 + 300
        draw.rectangle([x1, 330, x2, 560], fill='#1E293B', outline=color, width=2)
        draw.text((x1 + 20, 360), title, fill='#94A3B8')
        draw.text((x1 + 20, 420), val, fill='#FFFFFF')
        draw.rectangle([x1 + 20, 490, x2 - 20, 530], fill=color)
        draw.text((x1 + 50, 502), "View Detailed Logs", fill='#FFFFFF')

    img.save('docs/screenshots/screenshot_user_dashboard.png')
    print("User dashboard mockup created")

if __name__ == '__main__':
    create_emergency_feed_mockup()
    create_donor_directory_mockup()
    create_equipment_exchange_mockup()
    create_user_dashboard_mockup()
    print("All mockups generated successfully!")
