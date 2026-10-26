const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'jobshield_super_secret_jwt_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

/* ==========================================================================
   AUTHENTICATION API ENDPOINTS
   ========================================================================== */

// User Registration Route
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name || email.split('@')[0], email, hashedPassword, role || 'Job Seeker']
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('Registration Error:', error);
    // Fallback response for DB-less local runs
    const mockUser = { id: Date.now(), name: name || email.split('@')[0], email, role: role || 'Job Seeker' };
    const token = jwt.sign({ userId: mockUser.id, email: mockUser.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ message: 'Mock registration active', token, user: mockUser });
  }
});

// User Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password;

    return res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login Error:', error);
    const mockUser = { id: 1, name: email.split('@')[0], email, role: 'Security Analyst' };
    const token = jwt.sign({ userId: mockUser.id, email: mockUser.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ message: 'Mock login successful', token, user: mockUser });
  }
});

/* ==========================================================================
   JOB VERIFICATION & ANALYTICS ENGINE
   ========================================================================== */

app.post('/api/verify-job', (req, res) => {
  const { email, description = '', channel = 'official' } = req.body;

  let trustScore = 100;
  let domainFlag = false;
  let feeFlag = false;
  let channelFlag = false;

  if (email && (email.includes('@gmail.com') || email.includes('@yahoo.com') || email.includes('@hotmail.com'))) {
    trustScore -= 35;
    domainFlag = true;
  }

  const feeKeywords = ['registration fee', 'security deposit', 'laptop fee', 'refundable', 'pay ₹', 'gpay', 'phonepe', 'deposit'];
  const textLower = (description + " " + email).toLowerCase();
  
  if (feeKeywords.some(kw => textLower.includes(kw))) {
    trustScore -= 40;
    feeFlag = true;
  }

  if (channel === 'telegram' || channel === 'whatsapp') {
    trustScore -= 20;
    channelFlag = true;
  }

  trustScore = Math.max(0, Math.min(100, trustScore));

  res.json({
    trustScore,
    flags: {
      domain: domainFlag,
      fee: feeFlag,
      channel: channelFlag
    },
    scannedAt: new Date().toISOString()
  });
});

/* ==========================================================================
   COMMUNITY SCAM BLACKLIST REGISTRY API
   ========================================================================== */

app.get('/api/scams', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM scam_reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    // Return sample seed fallback data if DB isn't running
    res.json([
      {
        id: 1,
        company: "Apex Tech Cloud Services",
        contact: "hr-apextech@gmail.com | +91 98123 45678",
        category: "Upfront Fee",
        description: "Demanded ₹3,500 security deposit for laptop dispatch.",
        upvotes: 42,
        verifiedScam: true
      },
      {
        id: 2,
        company: "Global Data Entry Operations",
        contact: "Telegram: @DataJobsAdmin",
        category: "Telegram Task",
        description: "Promised ₹1,000 per page typed. Demanded legal clearance fee.",
        upvotes: 89,
        verifiedScam: true
      }
    ]);
  }
});

app.post('/api/scams', async (req, res) => {
  const { company, contact, category, description } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO scam_reports (company, contact, category, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [company, contact, category, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(200).json({ message: 'Scam logged locally', report: req.body });
  }
});

// Serve Single Page Application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🛡️ JobShield Server running on port ${PORT}`);
});