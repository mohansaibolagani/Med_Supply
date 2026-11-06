import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# Define color palette
C_NAVY_DARK = RGBColor(15, 23, 42)       # Slate 900
C_NAVY_CARD = RGBColor(30, 41, 59)       # Slate 800
C_WHITE = RGBColor(255, 255, 255)
C_LIGHT_BG = RGBColor(248, 250, 252)    # Slate 50
C_TEXT_DARK = RGBColor(15, 23, 42)      # Primary text
C_TEXT_MUTED = RGBColor(100, 116, 139)  # Slate 500
C_BORDER = RGBColor(226, 232, 240)      # Slate 200
C_RED = RGBColor(220, 38, 38)           # Emergency Red
C_RED_LIGHT = RGBColor(254, 242, 242)   # Red 50
C_TEAL = RGBColor(13, 148, 136)         # Teal 600
C_TEAL_LIGHT = RGBColor(240, 253, 250)  # Teal 50
C_BLUE = RGBColor(37, 99, 235)          # Blue 600
C_BLUE_LIGHT = RGBColor(239, 246, 255)  # Blue 50
C_GREEN = RGBColor(5, 150, 105)         # Green 600
C_GREEN_LIGHT = RGBColor(236, 253, 245) # Green 50
C_AMBER = RGBColor(217, 119, 6)         # Amber 600
C_AMBER_LIGHT = RGBColor(254, 243, 199) # Amber 50

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def set_slide_bg(slide, color=C_LIGHT_BG):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, number_str, category_str, title_str, subtitle_str):
        # Header Box
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.2))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Number & Category Pill
        p0 = tf.paragraphs[0]
        p0.text = f"{number_str} • {category_str.upper()}"
        p0.font.name = "Arial"
        p0.font.size = Pt(11)
        p0.font.bold = True
        p0.font.color.rgb = C_RED

        # Main Title
        p1 = tf.add_paragraph()
        p1.text = title_str
        p1.font.name = "Arial"
        p1.font.size = Pt(22)
        p1.font.bold = True
        p1.font.color.rgb = C_NAVY_DARK
        p1.space_before = Pt(3)

        # Subtitle
        p2 = tf.add_paragraph()
        p2.text = subtitle_str
        p2.font.name = "Arial"
        p2.font.size = Pt(12)
        p2.font.color.rgb = C_TEXT_MUTED
        p2.space_before = Pt(2)

        # Divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = C_BORDER
        line.line.fill.background()

    # =========================================================================
    # SLIDE 1: Title & Team Details
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1, C_NAVY_DARK)

    # Hero Accent Card
    card_hero = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(2.8))
    card_hero.fill.solid()
    card_hero.fill.fore_color.rgb = C_NAVY_CARD
    card_hero.line.color.rgb = C_RED
    card_hero.line.width = Pt(2)

    tf_hero = card_hero.text_frame
    tf_hero.word_wrap = True
    tf_hero.margin_left = Inches(0.4)
    tf_hero.margin_top = Inches(0.3)

    p = tf_hero.paragraphs[0]
    p.text = "🚨 ACADEMIC CAPSTONE PRESENTATION • CLASS TRAINING PROJECT 2026"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_RED

    p = tf_hero.add_paragraph()
    p.text = "MedSupply: Local Blood & Urgent Medical Equipment Exchange"
    p.font.name = "Arial"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_before = Pt(6)

    p = tf_hero.add_paragraph()
    p.text = "A Localized Emergency Healthcare Platform Connecting Blood Donors, Hospitals, and Urgent Home-Care Rentals (Oxygen Concentrators, CPAP, Wheelchairs) Across Vijayawada, Guntur & Neighboring Districts"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_before = Pt(6)

    # 3 Member Workload Split Cards
    members = [
        ("MEMBER 1: BACKEND & APIS", "Lead API Engineer", [
            "• Express RESTful routes (/emergency, /donors, /equipment)",
            "• MongoDB 2dsphere geospatial indexing ($near queries)",
            "• Compound indexing on { bloodGroup, isAvailable, city }",
            "• JWT Authentication & Role-Based Middleware"
        ], C_BLUE),
        ("MEMBER 2: FRONTEND UI & UX", "Lead Frontend Engineer", [
            "• Responsive React 18 SPA built with Vite & Tailwind",
            "• Live Emergency Request Feed with visual urgency badges",
            "• Interactive modals (SOS broadcast, donor register, rental)",
            "• One-click Status Toggles (Available vs In-Use / Reserved)"
        ], C_GREEN),
        ("MEMBER 3: VERIFICATION & OPS", "Verification & DevOps Lead", [
            "• WhatsApp Web & Meta Cloud API deep action hooks",
            "• Automated SOS broadcast simulation & delivery logs",
            "• 25+ record database seed dataset with mock store",
            "• Render cloud deployment, render.yaml & documentation"
        ], C_AMBER)
    ]

    for idx, (m_title, m_role, m_bullets, border_col) in enumerate(members):
        left = Inches(0.8 + idx * 4.0)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(3.8), Inches(3.733), Inches(3.1))
        card.fill.solid()
        card.fill.fore_color.rgb = C_NAVY_CARD
        card.line.color.rgb = border_col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = m_title
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = border_col

        p = tf.add_paragraph()
        p.text = m_role
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_before = Pt(2)

        for bullet in m_bullets:
            p = tf.add_paragraph()
            p.text = bullet
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = RGBColor(226, 232, 240)
            p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 2: Introduction and Problem Statement
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)
    add_header(s2, "02", "Context & Problem", "Introduction & Problem Statement", "The Critical Need for Localized Real-Time Emergency Coordination")

    # Left Column: The Healthcare Crisis / Problem
    card_p = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.7), Inches(5.1))
    card_p.fill.solid()
    card_p.fill.fore_color.rgb = C_RED_LIGHT
    card_p.line.color.rgb = C_RED
    card_p.line.width = Pt(1)

    tf_p = card_p.text_frame
    tf_p.word_wrap = True
    tf_p.margin_left = tf_p.margin_top = Inches(0.3)

    p = tf_p.paragraphs[0]
    p.text = "⚠️ THE CURRENT BOTTLENECK"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_RED

    points_p = [
        ("Chaotic, Unverified Messaging Groups:", "Blood and medical equipment requisitions are scattered across informal WhatsApp and Telegram groups with high noise, duplicate forwards, and zero clinical verification."),
        ("Critical Golden-Hour Transfusion Delays:", "Acute emergencies (road accidents, trauma surgeries, postpartum hemorrhages) fail to match donors in time due to lack of localized blood-group filtering."),
        ("Exorbitant Post-ICU Equipment Friction:", "Patients discharged from ICUs need home-care equipment (oxygen concentrators, CPAPs, wheelchairs) immediately. Finding reliable rentals or community loans is tedious."),
        ("Zero Return Tracking & Donor Exhaustion:", "Equipment owners lose track of return dates; blood donors are contacted repeatedly without respecting mandatory 90-day clinical cooldown periods.")
    ]

    for title, desc in points_p:
        p = tf_p.add_paragraph()
        p.text = f"• {title} "
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_DARK
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = C_NAVY_DARK

    # Right Column: The Ground Reality & Solution Vision
    card_s = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.7), Inches(5.1))
    card_s.fill.solid()
    card_s.fill.fore_color.rgb = C_GREEN_LIGHT
    card_s.line.color.rgb = C_GREEN
    card_s.line.width = Pt(1)

    tf_s = card_s.text_frame
    tf_s.word_wrap = True
    tf_s.margin_left = tf_s.margin_top = Inches(0.3)

    p = tf_s.paragraphs[0]
    p.text = "💡 THE MEDSUPPLY INTERVENTION"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_GREEN

    points_s = [
        ("Verified District-Level Geo-Exchange:", "Targeted deployment tailored for Vijayawada, Guntur, and NTR districts, bridging hospital wards directly with nearby screened donors."),
        ("One-Click WhatsApp Emergency Hooks:", "Eliminates phone number transcription errors by generating pre-filled, one-touch WhatsApp action links with patient, ward, and contact details."),
        ("90-Day Clinical Donor Safety Engine:", "Automated date calculations safeguard donor health by enforcing a 90-day cooldown hold before reactivating availability in searches."),
        ("Transparent Equipment Lifecycle Management:", "Empowers local providers and charity clubs to list units with transparent daily rates, security deposits, and real-time return countdown tracking.")
    ]

    for title, desc in points_s:
        p = tf_s.add_paragraph()
        p.text = f"• {title} "
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_DARK
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = C_NAVY_DARK

    # =========================================================================
    # SLIDE 3: Project Objectives
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)
    add_header(s3, "03", "Goals & Deliverables", "Project Objectives", "Concrete Engineering Targets Built for Life-Saving Impact")

    objs = [
        ("1. Real-Time Emergency SOS Broadcast", "Deploy a high-priority emergency broadcast engine classifying urgent cases (< 2 hrs vs < 6 hrs) with hospital verification stamps and live urgency badges.", C_RED, C_RED_LIGHT),
        ("2. Geospatial Donor Matching & Cooldown", "Implement MongoDB compound indexing on blood groups and locations, integrated with an automatic 90-day clinical cooldown algorithm to protect donor health.", C_TEAL, C_TEAL_LIGHT),
        ("3. Medical Equipment Rental Marketplace", "Provide a transparent listing & reservation platform for oxygen concentrators, wheelchairs, and CPAPs with refundable deposits and free welfare loans.", C_BLUE, C_BLUE_LIGHT),
        ("4. Seamless WhatsApp & Mobile Action Hooks", "Integrate instant WhatsApp Web/App action triggers (`wa.me`) passing structured clinical case context to remove friction between donors and attendants.", C_GREEN, C_GREEN_LIGHT),
        ("5. Zero-Downtime Deployment & Offline Resiliency", "Architect a dual-engine persistence layer (MongoDB Atlas + In-Memory Mock Store fallback) containerized with Docker and deployed live on Render.", C_NAVY_DARK, RGBColor(241, 245, 249))
    ]

    for idx, (title, desc, color_border, color_bg) in enumerate(objs):
        top = Inches(1.9 + idx * 1.0)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.733), Inches(0.88))
        card.fill.solid()
        card.fill.fore_color.rgb = color_bg
        card.line.color.rgb = color_border
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.12)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color_border

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_NAVY_DARK
        p.space_before = Pt(2)

    # =========================================================================
    # SLIDE 4: Technologies and Tools Used (MERN Stack)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)
    add_header(s4, "04", "Technology Stack", "Technologies & Tools Used (MERN Stack)", "Modern, High-Performance Full-Stack Web Architecture")

    tech_columns = [
        ("FRONTEND TIER", C_BLUE, [
            ("React 18 (SPA):", "Component-driven reactive UI with hooks & state management"),
            ("Vite 6:", "Lightning-fast HMR and optimized production bundling"),
            ("Tailwind CSS 3.4:", "Utility-first responsive styling and custom animations"),
            ("Lucide React:", "Clean, accessible clinical icons for healthcare actions"),
            ("HTML5 Geolocation:", "Browser-level GPS coordinate detection for proximity")
        ]),
        ("BACKEND API TIER", C_GREEN, [
            ("Node.js (v24):", "Non-blocking asynchronous event-driven server runtime"),
            ("Express.js 4:", "RESTful routing, middleware pipelines, error handling"),
            ("JWT (JSON Web Tokens):", "Stateless, secure role-based session authentication"),
            ("BcryptJS:", "Salted password hashing for HIPAA/data protection"),
            ("Morgan & CORS:", "HTTP request logging and cross-origin security")
        ]),
        ("DATABASE TIER", C_TEAL, [
            ("MongoDB 7+:", "Scalable NoSQL document store for rapid JSON iteration"),
            ("Mongoose ODM:", "Strict schema validation, types, and lifecycle hooks"),
            ("2dsphere Geospatial Index:", "Rapid spatial distance queries ($near queries)"),
            ("Compound Indexing:", "Sub-millisecond queries on bloodGroup + city + status"),
            ("Resilient In-Memory Store:", "100% operational offline fallback mock engine")
        ]),
        ("DEVOPS & INTEGRATIONS", C_NAVY_DARK, [
            ("Render Cloud Platform:", "Automated Blueprint deployment via render.yaml"),
            ("WhatsApp Action Hooks:", "Deep URL linking (`wa.me`) for immediate messaging"),
            ("Meta WhatsApp API:", "Webhook simulator for emergency broadcast testing"),
            ("Docker & Compose:", "Containerized multi-tier isolation and portability"),
            ("Git & GitHub:", "Version control with CI/CD triggers on main branch")
        ])
    ]

    for idx, (col_title, col_color, items) in enumerate(tech_columns):
        left = Inches(0.8 + idx * 3.0)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.9), Inches(2.8), Inches(5.1))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = col_color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = col_title
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = col_color

        for label, val in items:
            p = tf.add_paragraph()
            p.text = label + " "
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.bold = True
            p.font.color.rgb = C_NAVY_DARK
            p.space_before = Pt(6)
            run = p.add_run()
            run.text = val
            run.font.bold = False
            run.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 5: System Architecture and Workflow
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)
    add_header(s5, "05", "Architecture & Flow", "System Architecture & Emergency Workflow", "End-to-End Request Pipeline from Patient SOS to Donor Action")

    # Architecture Overview Card (Upper)
    card_arch = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(11.733), Inches(2.2))
    card_arch.fill.solid()
    card_arch.fill.fore_color.rgb = C_WHITE
    card_arch.line.color.rgb = C_BORDER
    card_arch.line.width = Pt(1)

    tf_a = card_arch.text_frame
    tf_a.word_wrap = True
    tf_a.margin_left = tf_a.margin_top = Inches(0.25)

    p = tf_a.paragraphs[0]
    p.text = "🏛️ 3-TIER SYSTEM ARCHITECTURE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK

    tiers = [
        ("CLIENT TIER (Browser)", "React 18 SPA • Tailwind CSS • HTML5 Geolocation • Modal Workflows • Unmuted Intro Briefing", C_BLUE),
        ("API GATEWAY TIER (Express)", "RESTful Endpoints • JWT Auth Middleware • CORS & Morgan • Dual Route Prefix Resolution (/api & /)", C_GREEN),
        ("DATA & SERVICE TIER", "MongoDB Atlas / In-Memory Mock Store • 2dsphere Geo-Index • 90-Day Cooldown Calc • WhatsApp Engine", C_AMBER)
    ]
    for idx, (t_name, t_desc, t_col) in enumerate(tiers):
        p = tf_a.add_paragraph()
        p.text = f"• [{t_name}]: "
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = t_col
        p.space_before = Pt(4)
        run = p.add_run()
        run.text = t_desc
        run.font.bold = False
        run.font.color.rgb = C_NAVY_DARK

    # 5-Step Workflow Cards (Lower)
    steps = [
        ("STEP 1", "SOS Submission", "Patient attendant or hospital posts emergency request (Blood units, urgency < 2h, hospital ward).", C_RED),
        ("STEP 2", "Geo & Group Query", "Backend executes compound index search for matching blood group & district radius.", C_TEAL),
        ("STEP 3", "Broadcast Dispatch", "Emergency feed updates in real-time; alert broadcast simulated across donor network.", C_BLUE),
        ("STEP 4", "WhatsApp Action", "Prospective donor clicks 1-touch WhatsApp action hook with auto-populated case context.", C_GREEN),
        ("STEP 5", "Fulfillment & Log", "Attendant marks SOS fulfilled; donor records donation to trigger 90-day cooldown.", C_NAVY_DARK)
    ]

    for idx, (step_num, step_name, step_desc, step_color) in enumerate(steps):
        left = Inches(0.8 + idx * 2.4)
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(4.3), Inches(2.25), Inches(2.7))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = step_color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.18)

        p = tf.paragraphs[0]
        p.text = step_num
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = step_color

        p = tf.add_paragraph()
        p.text = step_name
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_DARK
        p.space_before = Pt(3)

        p = tf.add_paragraph()
        p.text = step_desc
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_before = Pt(5)

    # =========================================================================
    # SLIDE 6: Features and Functionalities
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)
    add_header(s6, "06", "Capabilities", "Features & Functionalities", "Key Clinical and Operational Modules Built for MedSupply")

    features = [
        ("🚨 Live Emergency Request Feed", "Displays urgent requisitions with pulsating badges for critical cases (< 2 hours), hospital verification stamps, patient ward info, and direct contact buttons.", C_RED, C_RED_LIGHT),
        ("🩸 Blood Donor Cooldown Engine", "Enforces a strict 90-day post-donation rest period. Automatically calculates remaining rest days and hides resting donors from emergency queries.", C_TEAL, C_TEAL_LIGHT),
        ("🩺 Equipment Rental Marketplace", "Lists oxygen concentrators, wheelchairs, and CPAPs with clear rental rates, security deposits, and a special Free Urgent Loan tier for underprivileged patients.", C_BLUE, C_BLUE_LIGHT),
        ("💬 Instant WhatsApp Action Hooks", "One-click 'wa.me' deep-link integration pre-fills complete clinical emergency templates, allowing instant communication without manual number copying.", C_GREEN, C_GREEN_LIGHT),
        ("📊 Attendant & Diagnostic Dashboard", "Tracks active equipment rentals, return date countdowns, one-click 'Mark Returned' status toggle, and past blood donation history.", C_NAVY_DARK, RGBColor(241, 245, 249)),
        ("🎬 Fullscreen Video & Role Selector", "Engaging unmuted intro video explaining the platform mission, followed by a personalized role selector modal (Donor, Provider, or Patient).", C_AMBER, C_AMBER_LIGHT)
    ]

    for idx, (f_title, f_desc, f_col, f_bg) in enumerate(features):
        col = idx % 2
        row = idx // 2
        left = Inches(0.8 + col * 5.95)
        top = Inches(1.9 + row * 1.7)

        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.78), Inches(1.55))
        card.fill.solid()
        card.fill.fore_color.rgb = f_bg
        card.line.color.rgb = f_col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = f_title
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = f_col

        p = tf.add_paragraph()
        p.text = f_desc
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_NAVY_DARK
        p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 7: Database Design and API Integration
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s7)
    add_header(s7, "07", "Data & Endpoints", "Database Design & API Integration", "MongoDB Schema Modeling, Compound Indexing & RESTful Endpoints")

    # Left: Schema Architecture Card
    card_schema = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.3), Inches(5.1))
    card_schema.fill.solid()
    card_schema.fill.fore_color.rgb = C_WHITE
    card_schema.line.color.rgb = C_BORDER
    card_schema.line.width = Pt(1)

    tf_sc = card_schema.text_frame
    tf_sc.word_wrap = True
    tf_sc.margin_left = tf_sc.margin_top = Inches(0.25)

    p = tf_sc.paragraphs[0]
    p.text = "🗄️ MONGODB DATA MODELS & INDEXES"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK

    schemas = [
        ("User Schema:", "name, email, password (hashed), role (donor/provider/patient), phone, city, district"),
        ("Donor Schema:", "userId, bloodGroup, isAvailable, lastDonationDate, donationCount, location { type, coordinates: [lng, lat] }, verified"),
        ("Equipment Schema:", "title, category, dailyRate, securityDeposit, isAvailable, reservedBy, condition, city, district"),
        ("EmergencyRequest:", "patientName, hospitalName, bloodGroup, unitsRequired, urgencyLevel, status (ACTIVE/RESOLVED), contactPhone"),
        ("⚡ High-Performance Indexes:", "• Compound: { bloodGroup: 1, isAvailable: 1, city: 1 }\n• 2dsphere: location.coordinates for proximity filtering")
    ]
    for s_title, s_desc in schemas:
        p = tf_sc.add_paragraph()
        p.text = s_title + " "
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_BLUE if "Indexes" not in s_title else C_RED
        p.space_before = Pt(6)
        run = p.add_run()
        run.text = s_desc
        run.font.bold = False
        run.font.color.rgb = C_NAVY_DARK

    # Right: API Table
    table_shape = s7.shapes.add_table(8, 3, Inches(6.3), Inches(1.9), Inches(6.233), Inches(5.1))
    table = table_shape.table
    table.columns[0].width = Inches(1.2)
    table.columns[1].width = Inches(2.2)
    table.columns[2].width = Inches(2.833)

    api_rows = [
        ("METHOD", "ENDPOINT", "DESCRIPTION / PURPOSE"),
        ("POST", "/api/auth/login", "JWT Authentication & Session Creation"),
        ("GET", "/api/emergency", "Filter emergency feed by urgency & location"),
        ("POST", "/api/emergency", "Broadcast emergency SOS & dispatch alert"),
        ("GET", "/api/donors", "Geospatial donor search with 90-day cooldown"),
        ("PATCH", "/api/donors/:id/toggle", "Toggle donor available vs resting status"),
        ("GET", "/api/equipment", "Query equipment catalog with availability filters"),
        ("PATCH", "/api/dashboard/return", "Mark active equipment returned & release deposit")
    ]

    for r_idx, (m, ep, d) in enumerate(api_rows):
        for c_idx, val in enumerate([m, ep, d]):
            cell = table.cell(r_idx, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.font.name = "Arial"
            p.font.size = Pt(9.5) if r_idx > 0 else Pt(10)
            if r_idx == 0:
                p.font.bold = True
                p.font.color.rgb = C_WHITE
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_NAVY_DARK
            else:
                p.font.bold = (c_idx == 0)
                p.font.color.rgb = C_RED if val in ["POST", "PATCH"] else (C_GREEN if val == "GET" else C_NAVY_DARK)
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_WHITE if r_idx % 2 == 1 else RGBColor(248, 250, 252)

    # =========================================================================
    # SLIDE 8: Screenshots of the Project
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s8)
    add_header(s8, "08", "Live Demonstration", "Screenshots of the Project", "Visual Interface Walkthrough Across Core Modules")

    ss_items = [
        ("docs/screenshots/screenshot_emergency_feed.png", "Live Emergency SOS Feed (Urgency Badges & WhatsApp Direct)", 0, 0),
        ("docs/screenshots/screenshot_donor_directory.png", "Blood Donor Directory & 90-Day Clinical Cooldown Tracker", 1, 0),
        ("docs/screenshots/screenshot_equipment_exchange.png", "Medical Equipment Urgent Rental & Free Welfare Loan Catalog", 0, 1),
        ("docs/screenshots/screenshot_user_dashboard.png", "Attendant Dashboard & Active Equipment Return Countdown", 1, 1)
    ]

    for path, caption, col, row in ss_items:
        left = Inches(0.8 + col * 5.95)
        top = Inches(1.85 + row * 2.65)
        
        # Outer Card
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.78), Inches(2.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        # Image
        if os.path.exists(path):
            s8.shapes.add_picture(path, left + Inches(0.1), top + Inches(0.1), Inches(5.58), Inches(1.95))

        # Caption
        cap_box = s8.shapes.add_textbox(left + Inches(0.1), top + Inches(2.08), Inches(5.58), Inches(0.35))
        p = cap_box.text_frame.paragraphs[0]
        p.text = caption
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_DARK

    # =========================================================================
    # SLIDE 9: Challenges Faced and Future Scope
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s9)
    add_header(s9, "09", "Engineering Insights", "Challenges Faced & Future Scope", "Overcoming Practical Bottlenecks and Strategic Roadmap")

    # Left: Challenges Faced
    card_ch = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.7), Inches(5.1))
    card_ch.fill.solid()
    card_ch.fill.fore_color.rgb = C_WHITE
    card_ch.line.color.rgb = C_RED
    card_ch.line.width = Pt(1.5)

    tf_ch = card_ch.text_frame
    tf_ch.word_wrap = True
    tf_ch.margin_left = tf_ch.margin_top = Inches(0.3)

    p = tf_ch.paragraphs[0]
    p.text = "🛠️ CHALLENGES FACED & OVERCOME"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_RED

    ch_list = [
        ("Deployment Route Prefix Mismatch:", "Render static-site rewrites occasionally stripped the '/api' prefix. Solved by implementing dual route registration (both '/api' and '/') in Express and auto-resolving API_BASE in the frontend."),
        ("Medical Cooldown Integrity:", "Ensuring donors cannot bypass eligibility checks required strict date math validation at both client and API middleware layers (Date.now() - lastDonation >= 90 days)."),
        ("Zero-Dependency Resilience:", "To ensure grading and evaluation succeed even if MongoDB is not installed locally, architected an embedded high-fidelity in-memory data engine with pre-seeded demo records."),
        ("Browser Autoplay Restrictions:", "Modern browsers block unmuted video autoplay. Solved with an unmuted playback loop combined with an instant fallback overlay and one-click Skip button.")
    ]
    for ch_title, ch_desc in ch_list:
        p = tf_ch.add_paragraph()
        p.text = f"• {ch_title} "
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_DARK
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = ch_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_MUTED

    # Right: Future Scope
    card_fs = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.7), Inches(5.1))
    card_fs.fill.solid()
    card_fs.fill.fore_color.rgb = C_WHITE
    card_fs.line.color.rgb = C_BLUE
    card_fs.line.width = Pt(1.5)

    tf_fs = card_fs.text_frame
    tf_fs.word_wrap = True
    tf_fs.margin_left = tf_fs.margin_top = Inches(0.3)

    p = tf_fs.paragraphs[0]
    p.text = "🚀 FUTURE ROADMAP & SCALING"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    fs_list = [
        ("Automated Govt ID / Blood Bank Verification:", "Direct integration with government e-RaktKosh API and Aadhaar biometric APIs for instant official donor verification."),
        ("IoT Telemetry for Medical Rentals:", "Integrating low-power GPS and oxygen purity sensors into rented concentrators to prevent theft and monitor cylinder maintenance."),
        ("Autonomous Drone Blood Delivery:", "Partnering with regional hospital consortia to coordinate urgent emergency blood transport between district centers via drone corridors."),
        ("Multilingual Regional Voice Interface:", "Speech-to-text emergency SOS intake in Telugu, Hindi, and English to assist rural and non-tech-savvy attendants.")
    ]
    for fs_title, fs_desc in fs_list:
        p = tf_fs.add_paragraph()
        p.text = f"• {fs_title} "
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_DARK
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = fs_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 10: Conclusion
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s10, C_NAVY_DARK)

    card_c = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
    card_c.fill.solid()
    card_c.fill.fore_color.rgb = C_NAVY_CARD
    card_c.line.color.rgb = C_GREEN
    card_c.line.width = Pt(2)

    tf_c = card_c.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = Inches(0.5)
    tf_c.margin_top = Inches(0.4)

    p = tf_c.paragraphs[0]
    p.text = "🎯 PROJECT CONCLUSION & ACADEMIC DELIVERABLES"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_GREEN

    p = tf_c.add_paragraph()
    p.text = "MedSupply: Delivering Tangible Healthcare Innovation"
    p.font.name = "Arial"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_before = Pt(6)

    c_points = [
        ("Structured Emergency Response:", "Replaces chaotic group messages with a verified, structured, geospatial emergency pipeline."),
        ("Balanced 3-Member Engineering Division:", "Strict workload split across Backend & APIs (Member 1), Frontend UI & UX (Member 2), and Verification & DevOps (Member 3)."),
        ("Production Deployment on Render:", "Full CI/CD integration using render.yaml Blueprint with separate REST API service and static frontend site."),
        ("Academic Excellence & Open Source:", "Complete documentation, Postman API collections, and Docker setup open-sourced for peer collaboration.")
    ]
    for title, desc in c_points:
        p = tf_c.add_paragraph()
        p.text = f"• {title} "
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_TEAL
        p.space_before = Pt(10)
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = RGBColor(226, 232, 240)

    # Bottom links box
    p = tf_c.add_paragraph()
    p.text = "🔗 GitHub Repository: https://github.com/mohansaibolagani/Med_Supply"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_before = Pt(20)

    p = tf_c.add_paragraph()
    p.text = "🌐 Live Production App: https://medsupply-web.onrender.com"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_before = Pt(4)

    p = tf_c.add_paragraph()
    p.text = "🙏 Thank You! Floor Open for Questions & Evaluation."
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.space_before = Pt(14)

    # Save presentation
    output_path = "MedSupply_Project_Presentation.pptx"
    prs.save(output_path)
    # Also save in docs
    prs.save("docs/MedSupply_Project_Presentation.pptx")
    print(f"Presentation saved successfully to {output_path} and docs/{output_path}")

if __name__ == '__main__':
    create_presentation()
