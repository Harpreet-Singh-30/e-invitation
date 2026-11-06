-- Wedding Invitation Platform Database Schema
-- SQLite with WAL mode

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  groom_name TEXT,
  bride_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  price_paise INTEGER NOT NULL,
  prebook_price_paise INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE', 'RESERVED', 'SOLD')),
  owner_order_id INTEGER,
  preview_data TEXT NOT NULL,
  schema_json TEXT NOT NULL,
  poster_image TEXT NOT NULL,
  demo_slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (owner_order_id) REFERENCES orders(id)
);

CREATE INDEX idx_templates_status ON templates(status);
CREATE INDEX idx_templates_sort ON templates(sort_order);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  template_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'DRAFT' CHECK(state IN ('DRAFT', 'PREBOOKED', 'PURCHASED', 'PUBLISHED', 'EXPIRED', 'REFUNDED')),
  total_amount_paise INTEGER NOT NULL,
  paid_amount_paise INTEGER NOT NULL DEFAULT 0,
  edit_token_hash TEXT UNIQUE,
  reservation_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (template_id) REFERENCES templates(id)
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_template ON orders(template_id);
CREATE INDEX idx_orders_state ON orders(state);
CREATE INDEX idx_orders_token ON orders(edit_token_hash);

-- Unique constraint: one non-terminal order per template
CREATE UNIQUE INDEX idx_orders_template_active ON orders(template_id) 
  WHERE state IN ('DRAFT', 'PREBOOKED', 'PURCHASED', 'PUBLISHED');

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  payment_type TEXT NOT NULL CHECK(payment_type IN ('PREBOOK', 'BALANCE', 'FULL')),
  amount_paise INTEGER NOT NULL,
  method TEXT NOT NULL CHECK(method IN ('UPI_MANUAL', 'GATEWAY')),
  reference_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'VERIFIED', 'FAILED', 'REFUNDED')),
  screenshot_path TEXT,
  gateway_data TEXT,
  verified_by INTEGER,
  verified_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (verified_by) REFERENCES admin_users(id)
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_reference ON payments(reference_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Sites table (published customer sites)
CREATE TABLE IF NOT EXISTS sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  template_id TEXT NOT NULL,
  data_json TEXT NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT 1,
  published_at TEXT,
  last_edited_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (template_id) REFERENCES templates(id)
);

CREATE INDEX idx_sites_slug ON sites(slug);
CREATE INDEX idx_sites_online ON sites(is_online);

-- Assets table (uploaded images)
CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX idx_assets_order ON assets(order_id);
CREATE INDEX idx_assets_filename ON assets(filename);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
);

CREATE INDEX idx_admin_sessions_user ON admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- Custom design requests table
CREATE TABLE IF NOT EXISTS custom_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'COMPLETED', 'REJECTED')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_custom_requests_status ON custom_requests(status);
CREATE INDEX idx_custom_requests_created ON custom_requests(created_at);
