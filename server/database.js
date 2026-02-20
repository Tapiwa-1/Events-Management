import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDb(dbPath = './database.sqlite') {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

// Helper to check if a column exists
async function columnExists(db, tableName, columnName) {
  const columns = await db.all(`PRAGMA table_info(${tableName})`);
  return columns.some(col => col.name === columnName);
}

// Define migrations
const MIGRATIONS = [
  {
    name: '001_add_client_phone_to_events',
    up: async (db) => {
      if (!await columnExists(db, 'events', 'client_phone')) {
        await db.exec('ALTER TABLE events ADD COLUMN client_phone TEXT');
        console.log('Applied migration: 001_add_client_phone_to_events');
      }
    }
  },
  {
    name: '002_add_google_sheet_url_to_events',
    up: async (db) => {
      if (!await columnExists(db, 'events', 'google_sheet_url')) {
        await db.exec('ALTER TABLE events ADD COLUMN google_sheet_url TEXT');
        console.log('Applied migration: 002_add_google_sheet_url_to_events');
      }
    }
  },
  {
    name: '003_add_message_tracking_to_inquiries',
    up: async (db) => {
      let applied = false;
      if (!await columnExists(db, 'inquiries', 'message_count')) {
        await db.exec('ALTER TABLE inquiries ADD COLUMN message_count INTEGER DEFAULT 0');
        applied = true;
      }
      if (!await columnExists(db, 'inquiries', 'last_message_sent')) {
        await db.exec('ALTER TABLE inquiries ADD COLUMN last_message_sent TEXT');
        applied = true;
      }
      if (applied) {
        console.log('Applied migration: 003_add_message_tracking_to_inquiries');
      }
    }
  }
];

async function runMigrations(db) {
  await db.exec(`CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  const applied = await db.all('SELECT name FROM migrations');
  const appliedNames = new Set(applied.map(m => m.name));

  for (const migration of MIGRATIONS) {
    if (!appliedNames.has(migration.name)) {
      console.log(`Running migration: ${migration.name}`);
      try {
        await migration.up(db);
        await db.run('INSERT INTO migrations (name) VALUES (?)', migration.name);
      } catch (e) {
        console.error(`Migration ${migration.name} failed:`, e);
        throw e;
      }
    }
  }
}

export async function initDb(dbPath = './database.sqlite') {
  const db = await getDb(dbPath);
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

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      category TEXT,
      amount REAL DEFAULT 0,
      description TEXT,
      assistant_name TEXT,
      event_id INTEGER,
      FOREIGN KEY (event_id) REFERENCES events(id)
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

  await runMigrations(db);

  console.log('Database initialized');
  return db;
}
