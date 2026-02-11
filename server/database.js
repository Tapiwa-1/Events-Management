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
      total_cost REAL DEFAULT 0,
      transport_cost REAL DEFAULT 0,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT, -- 'deco', 'pa', 'av', etc.
      category TEXT, -- 'Fixed Asset', 'Operational', 'Consumable'
      total_quantity INTEGER NOT NULL,
      buffer_time_hours INTEGER DEFAULT 0,
      condition TEXT, -- 'Good', 'Fair', 'Poor', 'New'
      location TEXT, -- 'Store', 'Gig Bag', 'Cable Box'
      last_checked TEXT -- ISO Date
    );

    CREATE TABLE IF NOT EXISTS inventory_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      item_id INTEGER,
      quantity INTEGER NOT NULL,
      start_time TEXT,
      end_time TEXT,
      status TEXT,     -- 'reserved', 'confirmed', 'out', 'returned', 'cancelled'

      -- Movement Log Fields
      qty_out INTEGER DEFAULT 0,
      qty_back INTEGER DEFAULT 0,
      missing INTEGER DEFAULT 0,
      condition_return TEXT,

      returned INTEGER DEFAULT 0, -- boolean (legacy, maybe keep for query compat)
      damaged INTEGER DEFAULT 0,  -- boolean (legacy)

      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (item_id) REFERENCES inventory_items(id)
    );

    CREATE TABLE IF NOT EXISTS maintenance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      date TEXT NOT NULL,
      issue TEXT,
      action TEXT,
      cost REAL DEFAULT 0,
      status TEXT, -- 'Pending', 'In Progress', 'Fixed', 'Written Off'
      FOREIGN KEY (item_id) REFERENCES inventory_items(id)
    );

    CREATE TABLE IF NOT EXISTS consumables_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      date TEXT NOT NULL,
      qty_used INTEGER DEFAULT 0,
      balance INTEGER DEFAULT 0,
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
      status TEXT,
      post_prod_status TEXT,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (photographer_id) REFERENCES photographers(id)
    );

    CREATE TABLE IF NOT EXISTS cake_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      flavor TEXT,
      dietary_restrictions TEXT,
      design_notes TEXT,
      status TEXT,
      due_date TEXT,
      FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
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

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT,
      amount REAL DEFAULT 0,
      type TEXT, -- 'in', 'out'
      category TEXT, -- 'drawing', 'expense', 'income', 'adjustment'
      method TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      borrower TEXT NOT NULL,
      type TEXT,
      date_given TEXT NOT NULL,
      amount REAL DEFAULT 0,
      interest TEXT,
      due_date TEXT,
      status TEXT DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS loan_repayments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_id INTEGER,
      date TEXT NOT NULL,
      amount REAL DEFAULT 0,
      method TEXT,
      notes TEXT,
      FOREIGN KEY (loan_id) REFERENCES loans(id)
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT NOT NULL,
      message TEXT,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    );
  `);

  try {
    await db.exec('ALTER TABLE events ADD COLUMN client_phone TEXT');
    console.log('Added client_phone column to events table');
  } catch (e) {
    // Column likely exists
  }

  try {
    await db.exec('ALTER TABLE events ADD COLUMN google_sheet_url TEXT');
    console.log('Added google_sheet_url column to events table');
  } catch (e) {
    // Column likely exists
  }

  try {
    await db.exec('ALTER TABLE inquiries ADD COLUMN message_count INTEGER DEFAULT 0');
    await db.exec('ALTER TABLE inquiries ADD COLUMN last_message_sent TEXT');
    console.log('Added message_count and last_message_sent to inquiries table');
  } catch (e) {
    // Columns likely exist
  }

  console.log('Database initialized');
  return db;
}
