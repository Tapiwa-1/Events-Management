import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await getDb();
  await db.exec(`PRAGMA foreign_keys = ON;`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      name TEXT,
      date TEXT NOT NULL,
      start_time TEXT,
      end_time TEXT,
      location TEXT,
      type TEXT,
      status TEXT,
      failure_reason TEXT,
      amount_paid REAL DEFAULT 0,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT, -- 'deco', 'pa', etc.
      total_quantity INTEGER NOT NULL,
      buffer_time_hours INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS inventory_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      item_id INTEGER,
      quantity INTEGER NOT NULL,
      start_time TEXT, -- ISO string including date
      end_time TEXT,   -- ISO string
      status TEXT,     -- 'reserved', 'confirmed', 'out', 'returned'
      returned INTEGER DEFAULT 0, -- boolean
      damaged INTEGER DEFAULT 0,  -- boolean
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (item_id) REFERENCES inventory_items(id)
    );

    CREATE TABLE IF NOT EXISTS photographers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS service_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      photographer_id INTEGER,
      start_time TEXT,
      end_time TEXT,
      status TEXT, -- 'pending', 'confirmed', 'completed'
      post_prod_status TEXT, -- 'editing', 'review', 'delivered'
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (photographer_id) REFERENCES photographers(id)
    );

    CREATE TABLE IF NOT EXISTS cake_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      flavor TEXT,
      dietary_restrictions TEXT,
      design_notes TEXT,
      status TEXT, -- 'received', 'baking', 'decorating', 'ready'
      due_date TEXT,
      FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'customer', -- 'admin', 'staff', 'customer'
      full_name TEXT,
      is_active INTEGER DEFAULT 1,
      last_login TEXT,
      reset_token TEXT,
      reset_token_expiry TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  console.log('Database initialized');
  return db;
}
