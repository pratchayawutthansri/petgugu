export interface TeamMember {
  id: string;
  studentId: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  avatarUrl: string;
  responsibilities: string[];
  responsibilitiesEn: string[];
  email: string;
}

export interface ProjectAdvisor {
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  department: string;
  departmentEn: string;
  email: string;
}

export interface ProjectTask {
  id: string;
  phase: 'phase1' | 'phase2' | 'phase3';
  phaseName: string;
  phaseNameEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  progress: number;
  assignee: string;
  dueDate: string;
  deliverables: string[];
  deliverablesEn: string[];
}

export interface AcademicProjectInfo {
  code: string;
  titleTh: string;
  titleEn: string;
  degree: string;
  degreeEn: string;
  faculty: string;
  facultyEn: string;
  department: string;
  departmentEn: string;
  university: string;
  universityEn: string;
  academicYear: string;
  semester: string;
  defenseDate: string;
  advisors: ProjectAdvisor[];
  teamMembers: TeamMember[];
  objectives: { id: string; textTh: string; textEn: string; achieved: boolean }[];
  scopeItems: { id: string; category: string; categoryEn: string; detailTh: string; detailEn: string }[];
  tasks: ProjectTask[];
}

export const ACADEMIC_PROJECT_DATA: AcademicProjectInfo = {
  code: 'CPE-2569-CAPSTONE-07',
  titleTh: 'ระบบติดตามสุนัขแบบใกล้เคียงเวลาจริงผ่านเครือข่ายอินเทอร์เน็ต',
  titleEn: 'An Internet-based Near Real-time Dog Tracking System',
  degree: 'วิศวกรรมศาสตรบัณฑิต (วิศวกรรมคอมพิวเตอร์)',
  degreeEn: 'Bachelor of Engineering (Computer Engineering)',
  faculty: 'คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม',
  facultyEn: 'Faculty of Engineering and Industrial Technology',
  department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์',
  departmentEn: 'Department of Computer Engineering and AI',
  university: 'มหาวิทยาลัยเทคโนโลยีแห่งชาติ (Academic Prototype)',
  universityEn: 'National University of Technology (Academic Prototype)',
  academicYear: '2569 (2026)',
  semester: 'ภาคเรียนที่ 1',
  defenseDate: 'พฤศจิกายน 2569',
  advisors: [
    {
      name: 'ดร. ธนากร วงศ์วัฒนา',
      nameEn: 'Dr. Thanakorn Wongwattana',
      title: 'อาจารย์ที่ปรึกษาหลัก (Principal Advisor)',
      titleEn: 'Principal Advisor',
      department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      departmentEn: 'Department of Computer Engineering',
      email: 'thanakorn.w@eng.university.ac.th',
    },
    {
      name: 'ผศ. พรพิมล เกียรติสกุล',
      nameEn: 'Asst. Prof. Pornpimon Kiatsakul',
      title: 'อาจารย์ที่ปรึกษาร่วม (Co-Advisor)',
      titleEn: 'Co-Advisor',
      department: 'ภาควิชาวิศวกรรมโทรคมนาคมและเครือข่าย',
      departmentEn: 'Department of Telecommunications & IoT',
      email: 'pornpimon.k@eng.university.ac.th',
    },
  ],
  teamMembers: [
    {
      id: 'student_01',
      studentId: '65010042',
      name: 'นายสมชาย ใจดี',
      nameEn: 'Mr. Somchai Jaidee',
      role: 'หัวหน้าโครงงาน & Full-Stack Architecture',
      roleEn: 'Project Lead & Full-Stack Architecture',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      responsibilities: [
        'ออกแบบสถาปัตยกรรมระบบ Web Application ด้วย Next.js 14 App Router',
        'พัฒนาระบบ Interactive GIS Map ด้วย Leaflet และคำนวณ Safe Zone Geofencing',
        'ควบคุมการดำเนินงานโครงงานและรวบรวมเอกสารวิชาการ',
      ],
      responsibilitiesEn: [
        'Web Architecture design with Next.js 14 App Router & TypeScript',
        'Interactive GIS mapping with Leaflet and server-side geofencing algorithms',
        'Project management, timeline coordination, and thesis documentation',
      ],
      email: 'somchai.j@student.university.ac.th',
    },
    {
      id: 'student_02',
      studentId: '65010088',
      name: 'นางสาวแพรวา ชัยประเสริฐ',
      nameEn: 'Ms. Praewa Chaiprasert',
      role: 'IoT Hardware & Firmware Engineer',
      roleEn: 'IoT Hardware & Firmware Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      responsibilities: [
        'พัฒนาเฟิร์มแวร์ ESP32-S3 ขับเคลื่อนโมดูล SIM7080G Cat-M1/NB-IoT',
        'ควบคุมวงจร GNSS รับดาวเทียม และจัดการพลังงานแบตเตอรี่ Li-Po (PMU)',
        'ออกแบบกล่องเคสกันน้ำมาตรฐาน IP67 สำหรับสวมใส่ปลอกคอสุนัข',
      ],
      responsibilitiesEn: [
        'ESP32-S3 firmware development and SIM7080G cellular communication',
        'GNSS positioning algorithm, sleep mode PMU, and battery management',
        'IP67 waterproof wearable collar enclosure prototyping',
      ],
      email: 'praewa.c@student.university.ac.th',
    },
    {
      id: 'student_03',
      studentId: '65010115',
      name: 'นายธนภัทร ฤทธิ์เดช',
      nameEn: 'Mr. Thanapat Ritdet',
      role: 'Backend API, GIS & Security Engineer',
      roleEn: 'Backend API, GIS & Security Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      responsibilities: [
        'พัฒนา 19 REST API Endpoints รองรับการส่งพิกัดแบบ Idempotent พร้อม X-Device-Key',
        'ออกแบบฐานข้อมูลเชิงสัมพันธ์ Prisma Schema (9 Data Models)',
        'พัฒนาระบบ Digital QR Tag สำหรับผู้พบสุนัขแบบรักษาความเป็นส่วนตัว',
      ],
      responsibilitiesEn: [
        '19 REST APIs with X-Device-Key device authentication and idempotency',
        'PostgreSQL & Prisma Schema relational database design (9 models)',
        'Privacy-first public digital QR pet tag profile and sighting report system',
      ],
      email: 'thanapat.r@student.university.ac.th',
    },
  ],
  objectives: [
    {
      id: 'obj_1',
      textTh: 'ออกแบบและสร้างอุปกรณ์ปลอกคออัจฉริยะ (IoT Collar) ขนาดกะทัดรัด น้ำหนักเบา ปลอดภัยต่อสุนัข และกันน้ำกันฝุ่นตามมาตรฐาน IP67',
      textEn: 'Design and fabricate a lightweight, dog-safe, IP67 waterproof IoT collar device using ESP32-S3 and SIM7080G.',
      achieved: true,
    },
    {
      id: 'obj_2',
      textTh: 'พัฒนาระบบรับส่งพิกัดดาวเทียม GNSS ผ่านโครงข่ายเซลลูลาร์ LTE Cat-M1 / NB-IoT ที่ประหยัดพลังงานและทำงานได้ทั่วประเทศ',
      textEn: 'Develop low-power GNSS telemetry transmission over cellular LTE Cat-M1 / NB-IoT networks nationwide.',
      achieved: true,
    },
    {
      id: 'obj_3',
      textTh: 'สร้างเว็บแอปพลิเคชันสำหรับเจ้าของสุนัขเพื่อมอนิเตอร์พิกัดสด กำหนดรัศมีพื้นที่ปลอดภัย (Safe Zones) และแจ้งเตือนอัตโนมัติเมื่อหลุดออกนอกเขต',
      textEn: 'Build a responsive web application for real-time tracking, safe zone geofencing, and automatic exit notifications.',
      achieved: true,
    },
    {
      id: 'obj_4',
      textTh: 'พัฒนาระบบป้ายชื่อดิจิทัล QR Code ที่ช่วยให้ผู้พบเห็นติดต่อเจ้าของได้ทันที 1-Tap โดยปกป้องข้อมูลส่วนตัวและพิกัดที่อยู่อาศัย',
      textEn: 'Implement a privacy-first digital QR code tag allowing passersby to contact the owner via 1-tap call without leaking home location.',
      achieved: true,
    },
  ],
  scopeItems: [
    {
      id: 'scope_1',
      category: 'ฮาร์ดแวร์ประจำโครงงาน',
      categoryEn: 'Hardware Architecture',
      detailTh: 'บอร์ดทดลอง LILYGO T-SIM7080G-S3 ESP32-S3 (Flash 16MB / PSRAM 8MB), โมเด็ม SIM7080G, แบตเตอรี่ Li-Po 1,000 mAh, เคส IP67',
      detailEn: 'LILYGO T-SIM7080G-S3 ESP32-S3 (16MB Flash / 8MB PSRAM), SIM7080G modem, 1,000 mAh Li-Po battery, IP67 enclosure',
    },
    {
      id: 'scope_2',
      category: 'การสื่อสารเครือข่าย',
      categoryEn: 'Cellular Networking',
      detailTh: 'ส่งข้อมูลผ่าน Cellular LTE Cat-M1 และ NB-IoT เท่านั้น ใช้โปรโตคอล REST over HTTPS (JSON) พร้อมระบบป้องกันข้อมูลซ้ำ (Idempotency)',
      detailEn: 'Cellular LTE Cat-M1 & NB-IoT only via REST over HTTPS (JSON) with idempotent messageId deduplication',
    },
    {
      id: 'scope_3',
      category: 'ความถี่การอัปเดต (Near Real-time)',
      categoryEn: 'Near Real-time Cadence',
      detailTh: 'อัปเดตพิกัดทุก 10–60 วินาทีตามโหมดพลังงาน (Dashboard polling 10 วินาที, History polling 15 วินาที) ไม่ใช้ WebSockets ระดับเสี้ยววินาทีเพื่อประหยัดแบตเตอรี่',
      detailEn: '10–60 second telemetry cycle depending on power mode (Dashboard 10s polling, History 15s polling) to balance battery life',
    },
    {
      id: 'scope_4',
      category: 'ระบบฐานข้อมูลและ API',
      categoryEn: 'Database & Backend API',
      detailTh: 'PostgreSQL จัดการผ่าน Prisma ORM (9 Data Models) พร้อม 19 REST API Endpoints และระบบสำรอง Local JSONL Telemetry Store',
      detailEn: 'PostgreSQL managed by Prisma ORM (9 relational models), 19 REST API endpoints, and fallback local JSONL telemetry storage',
    },
  ],
  tasks: [
    // Phase 1: Web Application Platform
    {
      id: 'task_1_1',
      phase: 'phase1',
      phaseName: 'Phase 1: Web Application',
      phaseNameEn: 'Phase 1: Web Application',
      title: 'ออกแบบ UI/UX และพัฒนาหน้าเว็บครบ 11 หน้า',
      titleEn: 'UI/UX Design & 11 Core Pages Implementation',
      description: 'พัฒนาหน้า Landing, Auth, Dashboard, Pets, Add Pet, Details, History, Settings, Hardware, Public QR และ Admin ด้วย Next.js 14 และ Tailwind CSS',
      descriptionEn: 'Build 11 full-fidelity pages using Next.js 14 App Router, TypeScript, and responsive Tailwind CSS layout.',
      status: 'COMPLETED',
      progress: 100,
      assignee: 'นายสมชาย ใจดี',
      dueDate: 'สิงหาคม 2569',
      deliverables: ['11 หน้าเว็บสมบูรณ์', 'Design System โทน Pet-Tech', 'รองรับ 2 ภาษา TH/EN'],
      deliverablesEn: ['11 Complete pages', 'Pet-Tech Design System', 'Bilingual TH/EN support'],
    },
    {
      id: 'task_1_2',
      phase: 'phase1',
      phaseName: 'Phase 1: Web Application',
      phaseNameEn: 'Phase 1: Web Application',
      title: 'พัฒนาระบบแผนที่ GIS สดและการตรวจจับ Safe Zone',
      titleEn: 'Live GIS Map & Safe Zone Geofencing Engine',
      description: 'เชื่อมโยง Leaflet Map วาดหมุดรูปสุนัขเคลื่อนที่สด วงแหวนสัญญาณเรดาร์ และคำนวณการเข้า-ออกขอบเขตพื้นที่ปลอดภัย (Haversine Formula)',
      descriptionEn: 'Interactive Leaflet GIS map with custom animated pet markers, radar pulse rings, and server-side geofencing distance calculation.',
      status: 'COMPLETED',
      progress: 100,
      assignee: 'นายสมชาย ใจดี',
      dueDate: 'สิงหาคม 2569',
      deliverables: ['Leaflet Dynamic Tracking Map', 'Geofence Radius Circle', 'Haversine distance math'],
      deliverablesEn: ['Leaflet Dynamic Tracking Map', 'Geofence Radius Circle', 'Haversine distance math'],
    },
    {
      id: 'task_1_3',
      phase: 'phase1',
      phaseName: 'Phase 1: Web Application',
      phaseNameEn: 'Phase 1: Web Application',
      title: 'พัฒนาระบบป้ายชื่อดิจิทัล QR Code และ Privacy Guard',
      titleEn: 'Digital QR Tag & Privacy Protection System',
      description: 'สร้าง Dynamic QR Code ประจำตัวสุนัข และหน้าเว็บสาธารณะ /p/[qrId] สำหรับผู้พบเห็นสุนัข โทรหาเจ้าของ 1-Tap โดยไม่เปิดเผยพิกัดบ้าน',
      descriptionEn: 'Dynamic QR code tag generator and mobile-first /p/[qrId] public sighting page with 1-tap call and shielded owner location.',
      status: 'COMPLETED',
      progress: 100,
      assignee: 'นายธนภัทร ฤทธิ์เดช',
      dueDate: 'กันยายน 2569',
      deliverables: ['หน้าเว็บสาธารณะ /p/[qrId]', 'ฟอร์มแจ้งเบาะแส', 'ปุ่มโทรหาเจ้าของ tel: 1-Tap'],
      deliverablesEn: ['Public /p/[qrId] page', 'Sighting report form', '1-Tap tel: call link'],
    },
    {
      id: 'task_1_4',
      phase: 'phase1',
      phaseName: 'Phase 1: Web Application',
      phaseNameEn: 'Phase 1: Web Application',
      title: 'สร้างระบบ Backend 19 REST APIs และ Prisma Database',
      titleEn: '19 REST APIs & Prisma Database Architecture',
      description: 'สร้าง API ครอบคลุม Auth, Pets, User, IoT Telemetry, Heartbeat, Config และ Health Check พร้อม Zod validation และ JWT Cookie authentication',
      descriptionEn: '19 REST API endpoints covering Auth, Pets, Telemetry, Heartbeat, and Health with Zod schema validation and JWT authentication.',
      status: 'COMPLETED',
      progress: 100,
      assignee: 'นายธนภัทร ฤทธิ์เดช',
      dueDate: 'กันยายน 2569',
      deliverables: ['19 REST API Endpoints', 'Prisma Schema 9 Models', 'JWT Auth & Middleware'],
      deliverablesEn: ['19 REST API Endpoints', 'Prisma Schema 9 Models', 'JWT Auth & Middleware'],
    },

    // Phase 2: Hardware & Firmware Integration
    {
      id: 'task_2_1',
      phase: 'phase2',
      phaseName: 'Phase 2: IoT Hardware & Firmware',
      phaseNameEn: 'Phase 2: IoT Hardware & Firmware',
      title: 'พัฒนาไดรเวอร์และเฟิร์มแวร์ ESP32-S3 GNSS Driver',
      titleEn: 'ESP32-S3 GNSS Driver & Coordinate Extraction',
      description: 'เขียนโค้ดภาษา C/C++ ควบคุมโมดูลดาวเทียม SIM7080G ดึงค่า ละติจูด, ลองจิจูด, ความสูง, ทิศทาง, HDOP และสถานะ 3D Fix',
      descriptionEn: 'C/C++ firmware driving SIM7080G GNSS engine, parsing NMEA sentences for lat, lng, altitude, speed, heading, and 3D fix state.',
      status: 'COMPLETED',
      progress: 100,
      assignee: 'นางสาวแพรวา ชัยประเสริฐ',
      dueDate: 'ตุลาคม 2569',
      deliverables: ['PetguguGPS.ino Firmware', 'NMEA Parser Library', 'GNSS Multi-constellation Fix'],
      deliverablesEn: ['PetguguGPS.ino Firmware', 'NMEA Parser Library', 'GNSS Multi-constellation Fix'],
    },
    {
      id: 'task_2_2',
      phase: 'phase2',
      phaseName: 'Phase 2: IoT Hardware & Firmware',
      phaseNameEn: 'Phase 2: IoT Hardware & Firmware',
      title: 'เชื่อมต่อเครือข่าย Cellular Cat-M1 / NB-IoT ผ่าน HTTPS',
      titleEn: 'Cellular Cat-M1 / NB-IoT HTTPS Telemetry Ping',
      description: 'คอนฟิก APN ผู้ให้บริการเครือข่ายในไทย (AIS/True) ส่ง JSON Payload ไปยัง /api/iot/location พร้อม Header X-Device-Key',
      descriptionEn: 'Cellular APN network configuration transmitting JSON telemetry payload to /api/iot/location with secure X-Device-Key.',
      status: 'COMPLETED',
      progress: 100,
      assignee: 'นางสาวแพรวา ชัยประเสริฐ',
      dueDate: 'ตุลาคม 2569',
      deliverables: ['Cellular PPP/HTTPS Client', 'Idempotent messageId logic', 'X-Device-Key auth'],
      deliverablesEn: ['Cellular PPP/HTTPS Client', 'Idempotent messageId logic', 'X-Device-Key auth'],
    },
    {
      id: 'task_2_3',
      phase: 'phase2',
      phaseName: 'Phase 2: IoT Hardware & Firmware',
      phaseNameEn: 'Phase 2: IoT Hardware & Firmware',
      title: 'ระบบบริหารจัดการพลังงาน (PMU) & Sleep Modes',
      titleEn: 'Power Management Unit (PMU) & Deep Sleep Optimization',
      description: 'เขียนอัลกอริทึมสลับเข้าสู่โหมดประหยัดพลังงานเมื่อสุนัขอยู่นิ่งใน Safe Zone และตรวจสอบระดับแรงดันแบตเตอรี่ Li-Po แบบเรียลไทม์',
      descriptionEn: 'Power-saving state machine triggering modem eDRX/PSM sleep when inside Safe Zone, and real-time Li-Po voltage telemetry.',
      status: 'IN_PROGRESS',
      progress: 80,
      assignee: 'นางสาวแพรวา ชัยประเสริฐ',
      dueDate: 'พฤศจิกายน 2569',
      deliverables: ['Li-Po Battery ADC Curve', 'eDRX/PSM Sleep Profile', 'Power Saver Config Sync'],
      deliverablesEn: ['Li-Po Battery ADC Curve', 'eDRX/PSM Sleep Profile', 'Power Saver Config Sync'],
    },
    {
      id: 'task_2_4',
      phase: 'phase2',
      phaseName: 'Phase 2: IoT Hardware & Firmware',
      phaseNameEn: 'Phase 2: IoT Hardware & Firmware',
      title: 'ระบบแจ้งเตือนไฟ WS2812B RGB & Buzzer Search',
      titleEn: 'WS2812B RGB Smart LED & Buzzer Search Firmware',
      description: 'ควบคุมไฟ LED บอกสถานะสัญญาณ (เขียว=GPS Fix, ส้ม=กำลังค้นหา) และตอบสนองต่อคำสั่ง SOS หรือเสียงเรียกปลอกคอจาก Dashboard',
      descriptionEn: 'WS2812B LED status engine (Green=Fix, Orange=Searching) and firmware buzzer driver triggered via server telemetry responses.',
      status: 'IN_PROGRESS',
      progress: 75,
      assignee: 'นางสาวแพรวา ชัยประเสริฐ',
      dueDate: 'พฤศจิกายน 2569',
      deliverables: ['WS2812B LED Status Driver', 'Buzzer Chime Routine', 'SOS Flash Command Handler'],
      deliverablesEn: ['WS2812B LED Status Driver', 'Buzzer Chime Routine', 'SOS Flash Command Handler'],
    },

    // Phase 3: Field Testing, Evaluation & Thesis Defense
    {
      id: 'task_3_1',
      phase: 'phase3',
      phaseName: 'Phase 3: Testing & Defense',
      phaseNameEn: 'Phase 3: Testing & Defense',
      title: 'การทดสอบภาคสนามวัดความแม่นยำพิกัด GPS (Field Testing)',
      titleEn: 'Field Testing & GPS Positioning Accuracy Benchmark',
      description: 'ทดสอบการรับสัญญาณในพื้นที่โล่งและตึกสูง (Urban Canyon) เปรียบเทียบค่าความคลาดเคลื่อนเชิงตำแหน่ง (Horizontal Error) ในระยะ 3-5 เมตร',
      descriptionEn: 'Field testing across open sky and urban canyon environments, evaluating horizontal positioning error within 3–5 meter tolerance.',
      status: 'IN_PROGRESS',
      progress: 60,
      assignee: 'ทีมงานทุกคน',
      dueDate: 'พฤศจิกายน 2569',
      deliverables: ['ผลการทดสอบความแม่นยำพิกัด', 'กราฟเปรียบเทียบ HDOP', 'บันทึกเส้นทางภาคสนามจริง'],
      deliverablesEn: ['GPS Accuracy Benchmark Report', 'HDOP Analysis Charts', 'Real-world Field Tracking Logs'],
    },
    {
      id: 'task_3_2',
      phase: 'phase3',
      phaseName: 'Phase 3: Testing & Defense',
      phaseNameEn: 'Phase 3: Testing & Defense',
      title: 'การทดสอบระยะเวลาการใช้งานแบตเตอรี่ (Battery Longevity Test)',
      titleEn: 'Battery Longevity & Discharge Benchmark',
      description: 'ทดสอบความคงทนของแบตเตอรี่ 1,000 mAh ในโหมด Active (อัปเดตทุก 10 วินาที) เทียบกับโหมด Battery Saver (สลีปเมื่ออยู่ใน Safe Zone)',
      descriptionEn: 'Continuous runtime test with 1,000 mAh Li-Po battery comparing 10-second active tracking against adaptive sleep mode.',
      status: 'IN_PROGRESS',
      progress: 50,
      assignee: 'นางสาวแพรวา ชัยประเสริฐ',
      dueDate: 'พฤศจิกายน 2569',
      deliverables: ['ตารางเปรียบเทียบระยะเวลาใช้งานแบตเตอรี่', 'กราฟการคายประจุ (Discharge Graph)'],
      deliverablesEn: ['Battery Runtime Comparison Table', 'Discharge Curve Analytics'],
    },
    {
      id: 'task_3_3',
      phase: 'phase3',
      phaseName: 'Phase 3: Testing & Defense',
      phaseNameEn: 'Phase 3: Testing & Defense',
      title: 'จัดทำรูปเล่มวิทยานิพนธ์และการนำเสนอโครงงาน (Capstone Defense)',
      titleEn: 'Final Thesis Documentation & Capstone Oral Defense',
      description: 'รวบรวมเอกสารรายงานโครงงาน 5 บทฉบับสมบูรณ์, โปสเตอร์นำเสนอทางวิชาการ, และเตรียมระบบสาธิตจริง (Live Demonstration) ต่อคณะกรรมการสอบ',
      descriptionEn: 'Compilation of the 5-chapter academic thesis, capstone presentation poster, and live prototype demonstration for the examination committee.',
      status: 'IN_PROGRESS',
      progress: 40,
      assignee: 'ทีมงานทุกคน',
      dueDate: 'พฤศจิกายน 2569',
      deliverables: ['รูปเล่มรายงาน 5 บท', 'สไลด์นำเสนอ Capstone Defense', 'โปสเตอร์โครงงานวิชาการ'],
      deliverablesEn: ['5-Chapter Thesis Manuscript', 'Defense Presentation Slides', 'Academic Capstone Poster'],
    },
  ],
};
