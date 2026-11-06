-- Database Creation Script for Wedding SaaS Platform
-- Run with: sudo -u postgres psql -f scripts/create-database.sql

-- Create database
CREATE DATABASE wedding_saas;

-- Create user with secure password
-- IMPORTANT: Change this password in production!
CREATE USER wedding_admin WITH PASSWORD 'wedding_dev_pass_2026';

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE wedding_saas TO wedding_admin;
ALTER DATABASE wedding_saas OWNER TO wedding_admin;

-- Connect to the new database
\c wedding_saas

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO wedding_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO wedding_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO wedding_admin;

-- Display confirmation
SELECT 'Database wedding_saas created successfully!' AS status;
\l wedding_saas
\du wedding_admin
