-- Drop tables in reverse order of creation to handle foreign keys
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS policies;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT,
    location VARCHAR(255),
    family_size INT,
    occupation VARCHAR(255),
    avatar VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Policies Table
CREATE TABLE policies (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    premium NUMERIC(10, 2) NOT NULL,
    coverage_amount NUMERIC(12, 2) NOT NULL,
    deductible NUMERIC(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    next_due_date DATE
);

-- Claims Table
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    policy_id VARCHAR(255) REFERENCES policies(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    incident_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Submitted',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    upload_date DATE DEFAULT CURRENT_TIMESTAMP,
    file_size_kb INT,
    storage_url VARCHAR(255),
    related_policy_id VARCHAR(255) REFERENCES policies(id) ON DELETE SET NULL,
    related_claim_id INT REFERENCES claims(id) ON DELETE SET NULL
);

-- Activities Table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    icon_name VARCHAR(50),
    activity_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial documents for the default user
INSERT INTO documents (user_id, name, type, upload_date, file_size_kb, storage_url) VALUES
('user_123', 'Auto Policy ID-Card.pdf', 'Policy Document', '2023-05-15', 128, '#'),
('user_123', 'Homeowners Policy Summary.pdf', 'Policy Document', '2023-01-20', 256, '#'),
('user_123', 'Claim #C-1682345678.zip', 'Claim Files', '2023-04-24', 2048, '#'),
('user_123', 'February Premium Receipt.pdf', 'Receipt', '2024-02-05', 64, '#');
