# 🐾 Paws&Co. — ระบบติดตามสุนัขแบบใกล้เคียงเวลาจริงผ่านเครือข่ายอินเทอร์เน็ต
### An Internet-based Near Real-time Dog Tracking System

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet)](https://leafletjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Hardware](https://img.shields.io/badge/Hardware-LILYGO_T--SIM7080G--S3-orange?logo=espressif)](https://www.lilygo.cc/)

---

## 📖 บทนำและที่มาของโครงงาน (Project Overview)

ปัญหาการสูญหายของสัตว์เลี้ยงเป็นปัญหาที่พบได้บ่อยในปัจจุบัน โดยเฉพาะสุนัขที่หลุดออกจากที่พักอาศัย ซึ่งการติดตามมักทำได้ยากและอาศัยเพียงป้ายชื่อแบบเดิมหรือการประกาศหา โครงงานนี้จึงได้ออกแบบและพัฒนาระบบติดตามสุนัขแบบใกล้เคียงเวลาจริง (**Near Real-time Dog Tracking System**) 

ระบบผสานการทำงานร่วมกันระหว่าง:
1. **ฮาร์ดแวร์ปลอกคออัจฉริยะ (IoT Collar)**: บอร์ด **LILYGO T-SIM7080G-S3 ESP32-S3** รับสัญญาณดาวเทียม GNSS/GPS และส่งข้อมูลพิกัดผ่านเครือข่ายเซลลูลาร์ Cat-M / NB-IoT
2. **ระบบเว็บแอปพลิเคชัน (Paws&Co. WebApp)**: แพลตฟอร์มมอนิเตอร์พิกัดสดแบบเรียลไทม์ กำหนดเขตพื้นที่ปลอดภัย (Safe Zones / Geofence) แจ้งเตือนฉุกเฉิน และวิเคราะห์เส้นทางย้อนหลัง
3. **ป้ายชื่อดิจิทัล (Digital QR Code Tag)**: ป้าย QR ติดปลอกคอที่ให้ผู้พบสุนัขสามารถสแกนเพื่อโทรติดต่อเจ้าของได้ทันที 1-Tap โดยปกป้องความเป็นส่วนตัวไม่เปิดเผยพิกัดบ้าน

---

## 🛠️ ฮาร์ดแวร์ประจำโครงงาน (Hardware Architecture)

โครงงานนี้เลือกใช้บอร์ดทดลองประสิทธิภาพสูงที่ออกแบบมาสำหรับงาน IoT และการสื่อสารระยะไกลโดยเฉพาะ:

### 📟 บอร์ดทดลอง: **LILYGO T-SIM7080G-S3 ESP32-S3**
- **Microcontroller**: ชิปประมวลผล **ESP32-S3 Dual-Core Xtensa LX7**, 240 MHz
- **Memory**: **Flash 16MB**, **PSRAM 8MB** รองรับการประมวลผลอัลกอริทึมพิกัดและการเชื่อมต่อเครือข่ายที่ซับซ้อน
- **Cellular Modem**: **SIM7080G** รองรับคลื่นความถี่ **LTE Cat-M1** และ **NB-IoT** ครอบคลุมพื้นที่ทั่วประเทศไทย
- **GNSS / GPS**: ตัวรับสัญญาณดาวเทียมความแม่นยำสูง (GPS, GLONASS, BeiDou, Galileo)
- **Power Management (PMU)**: วงจรบริหารจัดการพลังงานอัจฉริยะในตัว รองรับ Sleep Mode และตรวจสอบระดับแรงดันแบตเตอรี่ (Battery Voltage / Level)
- **Battery**: แบตเตอรี่ Li-Po 3.7V ความจุ 1,000 mAh น้ำหนักเบา ปลอดภัยต่อสัตว์เลี้ยง ชาร์จผ่านพอร์ต Type-C
- **Status Indication**: ไฟแสดงสถานะ **WS2812B RGB Smart LED** (บอกสถานะ GPS Fix, การส่งสัญญาณ, และไฟค้นหากลางคืน)
- **Enclosure**: กล่องเคสกันน้ำกันฝุ่นมาตรฐาน **IP67** สำหรับสวมใส่กับปลอกคอสุนัข

---

## 🚀 สรุปผลงานที่พัฒนาเสร็จสมบูรณ์ใน Phase 1 (WebApp Phase)

ทีมพัฒนาได้ดำเนินการพัฒนาส่วน **Phase 1: Web Application** ครบถ้วน 100% ตามข้อกำหนด พร้อมระบบจำลองข้อมูลเสมือนจริง (**Demo Mode**) ที่รองรับการต่อยอดเชื่อมโยงกับฮาร์ดแวร์จริงใน Phase 2:

### 1. หน้าเว็บครบทั้ง 11 หน้า (11 Fully Functional Pages):
1. **🏠 [Landing Page](src/app/page.tsx) (`/`)**:
   - ออกแบบเมนูด้านบนเป็น **Floating Capsule Pill Island Navbar** สไตล์โมเดิร์น
   - ส่วน Hero พร้อมระบบจำลอง **Interactive Live Telemetry Simulator** สลับดูสุนัข "โมจิ (Golden)" / "ลัคกี้ (Shiba)" ได้ทันที
   - แสดงตัวเลขประสิทธิภาพ (Proof Metrics), ฟีเจอร์ Bento Grid 4 จุดเด่น, สเปกฮาร์ดแวร์ LILYGO ESP32-S3, และกล่องคำถามพบบ่อย (FAQ Accordion)
2. **🔐 [Authentication Page](src/app/auth/page.tsx) (`/auth`)**:
   - หน้า Login และ Register แบบสลับแท็บ พร้อมระบบ Zod Validation
   - ฟังก์ชันเปิด/ปิดดูรหัสผ่าน (Password Eye Toggle)
   - การ์ดเข้าสู่ระบบด่วน 1-Click สำหรับ **Demo User** (สมชาย ใจดี) และ **Demo Admin** (ผู้ดูแลระบบ)
3. **🛰️ [Live Tracking Dashboard](src/app/(app)/dashboard/page.tsx) (`/dashboard`)**:
   - แผนที่แสดงตำแหน่งสุนัขสด (Interactive Leaflet Map) พร้อม Marker ภาพถ่ายน้องหมา และวงแหวนเรดาร์
   - แสดงวงกลมขอบเขตพื้นที่ปลอดภัย (Safe Zone Geofences)
   - การ์ดข้อมูล Telemetry: แบตเตอรี่, ระดับสัญญาณ, ความเร็ว, สวิตช์ประหยัดพลังงาน, และปุ่ม **SOS Emergency Broadcast**
4. **🐕 [My Pets](src/app/(app)/pets/page.tsx) (`/pets`)**:
   - หน้ารายการสุนัขทั้งหมดในรูปแบบการ์ด พร้อมแถบสถานะแบตเตอรี่, สัญญาณ, สวิตช์เปิด/ปิด Battery Saver & Pro Alerts
5. **➕ [Add Pet Form](src/app/(app)/pets/new/page.tsx) (`/pets/new`)**:
   - ฟอร์มลงทะเบียนสุนัขพร้อมระบบเลือกรูปภาพโปรไฟล์ (2-5 รูป), เลือกรูปภาพหลัก, และระบบจำลองเชื่อมต่อบอร์ด LILYGO ESP32-S3
6. **📋 [Pet Details](src/app/(app)/pet/[id]/page.tsx) (`/pet/[id]`)**:
   - แกลเลอรีรูปภาพ Lightbox, ข้อมูลสุขภาพ, ตารางประวัติวัคซีน (เพิ่ม/แก้ไขได้), ระบบจัดการพื้นที่ปลอดภัย, ข้อมูลชิป IoT และปุ่มลบข้อมูล
7. **📈 [Location History](src/app/(app)/history/page.tsx) (`/history`)**:
   - แสดงเส้นทางการเดินย้อนหลังบนแผนที่ (Route Polyline), เหตุการณ์ไทม์ไลน์, ระยะทางรวม (km), เวลาที่ใช้, ความเร็วเฉลี่ย, และการใช้พลังงาน
8. **⚙️ [Settings](src/app/(app)/settings/page.tsx) (`/settings`)**:
   - แก้ไขโปรไฟล์ผู้ใช้, ตั้งค่าแจ้งเตือน (Zone Exit / Low Battery / Device Offline), สลับภาษาไทย 🇹🇭 / English 🇬🇧 ได้ทันทีทั้งระบบ
9. **📡 [Hardware Management](src/app/(app)/hardware/page.tsx) (`/hardware`)**:
   - ข้อมูลสเปกทางเทคนิคของบอร์ด LILYGO T-SIM7080G-S3 ESP32-S3, รายการอุปกรณ์ที่ลงทะเบียน, และ Wizard จับคู่อุปกรณ์ใหม่
10. **🏷️ [Public Pet Profile](src/app/p/[qrId]/page.tsx) (`/p/[qrId]`)**:
    - หน้าที่เปิดเมื่อสแกน QR Tag บนปลอกคอ — แสดงรูป ชื่อ เบอร์โทรติดต่อเจ้าของ, ปุ่มโทรออกได้ทันที (`tel:`), และฟอร์มแจ้งเบาะแสการพบ (**ไม่เปิดเผยพิกัดสดหรือข้อมูลส่วนตัวที่อ่อนไหว**)
11. **🛡️ [Admin Dashboard](src/app/(app)/admin/page.tsx) (`/admin`)**:
    - สถิติภาพรวม Users, Pets, Devices, Active Telemetry และตารางตรวจสอบความพร้อมของระบบ (System Health Check)

---

### 2. ระบบ API ทั้งหมด 19 HTTP Endpoints:
```
Authentication:
  POST   /api/auth/login          — ตรวจสอบสิทธิ์และสร้าง JWT Cookie
  POST   /api/auth/signup         — ลงทะเบียนผู้ใช้ใหม่
  POST   /api/auth/logout         — ล้างเซสชัน Cookie
  GET    /api/auth/me             — ตรวจสอบเซสชันผู้ใช้ปัจจุบัน

Pets Management:
  GET    /api/pets                — ดึงรายการสัตว์เลี้ยงทั้งหมดของผู้ใช้
  POST   /api/pets                — เพิ่มสัตว์เลี้ยงใหม่
  GET    /api/pets/[id]           — ดึงข้อมูลสัตว์เลี้ยงรายตัว
  PUT    /api/pets/[id]           — แก้ไขข้อมูลสัตว์เลี้ยง
  DELETE /api/pets/[id]           — ลบสัตว์เลี้ยง
  GET    /api/pets/[id]/history   — ดึงประวัติพิกัด GPS ย้อนหลัง

User Profile:
  GET    /api/user                — ดึงข้อมูลโปรไฟล์ผู้ใช้
  PUT    /api/user                — แก้ไขข้อมูลโปรไฟล์

IoT Telemetry & Device (Hardware-ready REST v1):
  POST   /api/iot/location        — รับและตรวจสอบ GPS Telemetry พร้อม idempotency
  POST   /api/iot/heartbeat       — อัปเดตสถานะบอร์ดเมื่อ GNSS ยังไม่มี Fix
  GET/PUT /api/iot/config         — อ่าน/ตั้งค่ารอบส่งข้อมูล Power Save และ SOS

Public QR Tag:
  GET    /api/pet/[qrId]          — ข้อมูลโปรไฟล์สาธารณะสำหรับผู้สแกน QR
  POST   /api/pet/[qrId]/report   — ส่งรายงานแจ้งเบาะแสเมื่อพบสัตว์เลี้ยง

System:
  GET    /api/health              — ตรวจสอบสถานะการทำงานของระบบ (Uptime & Services)
```

### Hardware Integration Readiness — 10 กันยายน 2569

- ✅ Device authentication แยก key ต่อบอร์ดผ่าน `X-Device-Key`
- ✅ ตรวจช่วงค่าพิกัด แบตเตอรี่ สัญญาณ ความเร็ว ทิศทาง และสถานะ GNSS
- ✅ รองรับ `messageId` เพื่อไม่บันทึกข้อมูลซ้ำเมื่อ Cat-M/NB-IoT retry
- ✅ Heartbeat สำหรับกรณีบอร์ดออนไลน์แต่ยังจับดาวเทียมไม่ได้
- ✅ ส่ง `updateIntervalSeconds`, Power Save และ SOS กลับไปให้ firmware
- ✅ ส่ง Safe Zones ให้บอร์ดและคำนวณ `ENTERED_ZONE`/`LEFT_ZONE` ฝั่ง server
- ✅ Dashboard polling ทุก 10 วินาที และ History polling ทุก 15 วินาที
- ✅ Smoke test ครอบคลุมเส้นทางจากอุปกรณ์ถึง Dashboard/History
- ✅ เก็บ Telemetry local แบบ JSONL และโหลดคืนได้หลังรีสตาร์ต server

รายละเอียด payload, response และ retry policy อยู่ที่ [`docs/IOT_API.md`](docs/IOT_API.md)

---

### 3. โครงสร้างฐานข้อมูล Prisma Database Schema (`prisma/schema.prisma`):
ออกแบบ 9 โมเดลสัมพันธ์รองรับฐานข้อมูล PostgreSQL:
1. `User` — ข้อมูลผู้ใช้งานและบทบาท (USER / ADMIN)
2. `Pet` — ข้อมูลสุนัข (ชื่อ สายพันธุ์ อายุ น้ำหนัก รูปภาพ รหัส QR Tag)
3. `PetPhoto` — แกลเลอรีรูปภาพสุนัข (2-5 รูป)
4. `Device` — ข้อมูลฮาร์ดแวร์ LILYGO ESP32-S3 (IMEI, MAC, แบตเตอรี่, สถานะ)
5. `SafeZone` — ขอบเขตพื้นที่ปลอดภัยและรัศมี (พิกัด ละติจูด/ลองจิจูด, รัศมีเป็นเมตร)
6. `LocationHistory` — บันทึกประวัติการส่งพิกัดดาวเทียมย้อนหลัง
7. `Alert` — ประวัติการแจ้งเตือน (เตือนออกนอกเขต, แบตเตอรี่ต่ำ, SOS)
8. `Vaccination` — บันทึกประวัติการฉีดวัคซีนของสุนัข
9. `PublicPetProfile` — ข้อมูลสำหรับหน้าสแกน QR Code เพื่อความปลอดภัย

---

## ⚡ วิธีการติดตั้งและเปิดใช้งาน (Quick Start)

### 1. ติดตั้ง Dependencies
```powershell
cd d:\Petgugu\petgugu
npm install
```

### 2. รันโหมด Development
```powershell
npm run dev
```
เปิดเบราว์เซอร์ไปที่: **`http://localhost:3000`** (หรือ `http://localhost:3001` หากพอร์ต 3000 ถูกใช้งานอยู่)

### 3. บัญชีทดสอบสำหรับ Demo Mode
- 🐶 **ผู้ใช้งานทั่วไป (Pet Owner)**: `demo@pawsandco.com` | รหัสผ่าน: `demo1234`
- 🛡️ **ผู้ดูแลระบบ (Admin)**: `admin@pawsandco.com` | รหัสผ่าน: `admin1234`
*(สามารถคลิกการ์ด Quick Demo บนหน้า Login เพื่อเข้าสู่ระบบได้ทันทีโดยไม่ต้องพิมพ์)*

---

## 🧪 ผลการตรวจสอบความถูกต้องของโค้ด (Quality Assurance)

| คำสั่งทดสอบ | ผลลัพธ์ | รายละเอียด |
|---|---|---|
| `npm run lint` | ✅ **Passed** | 0 warnings, 0 errors |
| `npx tsc --noEmit` | ✅ **Passed** | 0 type errors |
| `npm run build` | ✅ **Passed** | คอมไพล์หน้า Static & Dynamic ครบทั้ง 21 เส้นทาง |
| `npx prisma generate` | ✅ **Passed** | สร้าง Prisma Client สำหรับ 9 Data Models สมบูรณ์ |

---

## 🎨 สถานะการปรับปรุง UI/UX (Design Redesign)

กำลังจัดทำ Design ใหม่เป็นภาพก่อนนำไปพัฒนา โดยหน้าที่ยังเหลืออยู่ **6 หน้า** คือ:

- [ ] Authentication / Login–Register
- [ ] Add Pet
- [ ] Settings
- [ ] Hardware Management
- [ ] Public QR Pet Profile
- [ ] Admin Dashboard

---

## 🔮 แผนการดำเนินงานระยะถัดไป (Phase 2 Roadmap)

- [ ] พัฒนาเฟิร์มแวร์ ESP32-S3 ผ่าน **PlatformIO** (C/C++)
- [x] เตรียม REST/JSON API v1 สำหรับรับ Telemetry จาก ESP32-S3 อย่างปลอดภัย
- [ ] นำ firmware เชื่อมต่อบอร์ด **LILYGO T-SIM7080G-S3** และทดสอบ APN ของซิมจริง
- [ ] เปิด HTTPS endpoint ที่บอร์ดเข้าถึงได้จาก Cat-M/NB-IoT
- [ ] เชื่อม PostgreSQL/Prisma สำหรับเก็บ Telemetry แบบถาวร
- [ ] ติดตั้ง **MQTT Broker** เมื่อจำเป็นต้องรองรับอุปกรณ์จำนวนมาก
- [ ] ติดตั้งระบบ **WebSockets** สำหรับการอัปเดตพิกัดบนแผนที่แบบ Real-time Push
- [ ] ทดสอบภาคสนาม (Field Testing) ทดสอบสัญญาณและการประหยัดพลังงานในพื้นที่จริง

---

## 👥 ทีมงานผู้พัฒนา (Development Team)
- **Senior Software Developer** — ออกแบบสถาปัตยกรรมระบบและโครงสร้างหลัก
- **Senior Software Engineer** — ตรวจสอบมาตรฐานโค้ดและการประมวลผล
- **Full-Stack Developer** — พัฒนาระบบ Frontend & Backend API
- **UI/UX Designer** — ออกแบบดีไซน์ซิสเต็มและหน้าจอผู้ใช้งาน
- **Senior Manager** — ควบคุมคุณภาพและทิศทางโครงงาน
- **QA Engineer** — ตรวจสอบความถูกต้องและทดสอบระบบ
- **Senior DevOps** — จัดการโครงสร้างพื้นฐานและกระบวนการ Build

---
© 2026 **Paws&Co.** — Academic Prototype Project. All rights reserved.
