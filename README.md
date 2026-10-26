# 🛡️ JobShield - Full-Stack AI Fraud Intelligence & Document Forensics Engine

**JobShield** is a web-based full-stack platform designed to protect job seekers by verifying job postings, recruiter handles, and corporate offer letter documents.

## 📂 Project Repository Structure

```text
JobShield/
├── index.html        # Single-Page Web Frontend Application
├── server.js         # Node.js + Express REST API Server
├── db.js             # PostgreSQL Database Connection Module
├── schema.sql        # Database Tables & Seed Data Scripts
├── package.json      # Dependencies and Startup Scripts
├── .env.example      # Environment Configuration Template
└── README.md         # Documentation & Setup Guide
```

## 🚀 Key Features

1. **Job Posting Multi-Parameter Verifier:**
   - Scans corporate domain handles vs free webmails (`@gmail.com`, `@yahoo.com`).
   - Scans job descriptions for upfront fee requests ("registration fee", "laptop security deposit").
   - Flags high-risk communication channels (Telegram, WhatsApp).
2. **Evidence Vault Document Forensics:**
   - Forensic inspection for EXIF metadata (e.g. Canva or Photoshop traces).
   - Verifies Indian Ministry of Corporate Affairs (MCA) CIN codes.
3. **Community Scam Database:**
   - Live blacklist query and crowd-sourced reporting system.
4. **Authentication System:**
   - Complete JWT Sign-In & Sign-Up workflow with role handling.

## ⚙️ Quick Start Setup Instructions

### 1. Install Node.js

Install Node.js, then clone the repository and enter the project directory:

```sh
git clone https://github.com/your-username/JobShield.git
cd JobShield
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update the values for your environment. In PowerShell:

```powershell
Copy-Item .env.example .env
```

Set a strong, unique `JWT_SECRET` and your actual PostgreSQL password in `.env`. Do not commit `.env`.

### 4. Set Up PostgreSQL (Optional)

Create the `jobshield_db` database, then run the schema script:

```sh
psql -U postgres -d jobshield_db -f schema.sql
```

The schema creates the application tables and inserts sample scam reports. Running it more than once will insert the sample reports again.

### 5. Start the Server

```sh
npm start
```

Open [http://localhost:5000](http://localhost:5000) in your browser.
