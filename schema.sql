-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Job Seeker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Scam Reports Table
CREATE TABLE IF NOT EXISTS scam_reports (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    upvotes INT DEFAULT 1,
    verified_scam BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Seed Data
INSERT INTO scam_reports (company, contact, category, description, upvotes)
VALUES 
('Apex Tech Cloud Services', 'hr-apextech@gmail.com | +91 98123 45678', 'Upfront Fee', 'Demanded ₹3,500 security deposit for laptop dispatch. Fake offer letter issued on WhatsApp.', 42),
('Global Data Entry Operations', 'Telegram: @DataJobsAdmin', 'Telegram Task', 'Promised ₹1,000 per page typed. After completing 50 pages, demanded ₹5,000 legal clearance fee.', 89),
('Nexus India Retail HR', 'nexus-recruitment@yahoo.com', 'Fake Offer Letter', 'Spoofed logo of major retailer. Issued offer letter without interview and demanded training kit deposit.', 27);
