# 🏛️ SSKRU Maintenance & Reporting Protocol
> **Institutional Registry for Geospatial Asset Management**

Built by 1st-year students from the **Department of Software Engineering and Artificial Intelligence** at Sisaket Rajabhat University (SSKRU).

---

## 🌟 Project Overview
SSKRU Report is a high-fidelity, institutional-grade management system designed to streamline the reporting, dispatching, and resolution of physical infrastructure anomalies across the university campus. The system leverages a **"Sophisticated Academic"** aesthetic to provide a prestigious and efficient user experience for students, technicians, and administrators.

### 🔑 Key Mission Objectives
*   **Visual Dispatching**: Transition from text-based reporting to visual-first evidence registries (Before/After verification).
*   **Sector Operations**: Mission-critical dashboards tailored for four distinct institutional roles: Student, Technician, Manager, and Admin.
*   **Bilingual Compliance**: Full real-time support for **Thai** and **English** across all system layers.
*   **Institutional Auditing**: Every modification, maintenance log, and dispatch sequence is systematically archived for full accountability.

---

## 🛠️ Technical Architecture

### 🚀 Backend (Registry Control)
*   **Framework**: [ElysiaJS](https://elysiajs.com/) - High-performance, Type-safe Bun framework.
*   **Runtime**: [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime.
*   **Database**: SQLite (managed via Drizzle ORM/Raw SQL for precision).
*   **Authentication**: JWT-based Secure Protocol with role-based access control (RBAC).

### 🎨 Frontend (Mission Interface)
*   **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) - Modern, high-performance UI library.
*   **Styling**: Vanilla CSS + Tailwind-Utility-Core for custom **"White & Gold"** academic themes.
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) - For mission-critical transitions and sophisticated visual feedback.
*   **Internationalization**: `i18next` - Deep localization for Thai/English.
*   **Componentry**: Custom high-fidelity "Telemetry Cards" and "Dossier Modals."

---

## 🧑‍💻 The Architects (Design Council)
This system was envisioned and engineered by the following **1st-Year Software Engineering & AI** students:

*   **นาย เจษฎา แก้วละมุล**
*   **นาย ณัฏฐชัย โมคศิริ**
*   **นาย ประมุข สีหะวงษ์**
*   **นางสาว วริศรา ถาวร**
*   **นางสาว วิมลนาฎ พรมด้วง**

---

## 🚦 System Initialization (Mission-Critical Sequence)
> [!IMPORTANT]
> You **MUST** execute the Registry Seeding protocol BEFORE activating the server to ensure institutional structural integrity.

### 📥 Prerequisite: Repository Deployment
1.  Ensure **Bun** or **Node.js** is installed.
2.  Clone the institutional repository.

### ⚙️ Registry Activation & Seeding (Backend)
```bash
cd backend
npm install
npm run seed     # CRITICAL: Prepare structural data first
npm run dev      # Start operational server
```

### 🖥️ Interface Linkage (Frontend)
```bash
cd frontend
npm install
npm run dev
```

---

## 📑 Registry Protocols (Routes)
*   `/` : Institutional Landing Page (Public Mission Gateway)
*   `/login` : Sector Portal Authentication
*   `/dashboard/student` : Anomaly Reporting & Status Tracking
*   `/dashboard/technician` : Operational Maintenance & Protocol Execution
*   `/dashboard/manager` : Strategic Dispatch & Personnel Management
*   `/dashboard/admin` : Global Registry Control & System Auditing

---

## 📜 Intellectual Acknowledgements
The architectural principles and design aesthetics of this system were inspired by modern, high-precision digital ecosystems. We acknowledge the global developer community for the creative inspirations that shaped this institutional framework.

**SSKRU Institutional Report System © 2026**
*Institutional Data Protected by National Spatial Security Protocols*
