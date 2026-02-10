import { initDb } from './database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const db = await initDb();

  // Check if we need to seed
  const itemCount = await db.get('SELECT count(*) as count FROM inventory_items');
  // If count is low or we want to ensure PA items exist
  if (itemCount.count < 10) {

    // PA - Fixed Assets
    await db.run(`INSERT INTO inventory_items (name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked) VALUES
        ('15” Speaker', 'pa', 'Fixed Asset', 4, 2, 'Good', 'Store', '2023-10-01'),
        ('Subwoofer', 'pa', 'Fixed Asset', 2, 2, 'Good', 'Store', '2023-10-01'),
        ('Audio Mixer', 'pa', 'Fixed Asset', 2, 2, 'Excellent', 'Store', '2023-10-01'),
        ('Power Amplifier', 'pa', 'Fixed Asset', 3, 2, 'Good', 'Rack A', '2023-10-01'),
        ('Generator', 'pa', 'Fixed Asset', 1, 4, 'Fair', 'Garage', '2023-09-15')
    `);

    // PA - Operational
    await db.run(`INSERT INTO inventory_items (name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked) VALUES
        ('Wireless Mic', 'pa', 'Operational', 6, 1, 'Good', 'Gig Bag', '2023-10-05'),
        ('Wired Mic (SM58)', 'pa', 'Operational', 8, 1, 'Good', 'Gig Bag', '2023-10-05'),
        ('Speaker Stand', 'pa', 'Operational', 10, 1, 'Fair', 'Store', '2023-10-01'),
        ('Mic Stand', 'pa', 'Operational', 12, 1, 'Fair', 'Store', '2023-10-01'),
        ('XLR Cable (10m)', 'pa', 'Operational', 20, 0, 'Good', 'Cable Box', '2023-10-05'),
        ('XLR Cable (5m)', 'pa', 'Operational', 15, 0, 'Good', 'Cable Box', '2023-10-05'),
        ('Power Extension', 'pa', 'Operational', 10, 0, 'Good', 'Cable Box', '2023-10-05')
    `);

    // PA - Consumables
    await db.run(`INSERT INTO inventory_items (name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked) VALUES
        ('AA Batteries', 'pa', 'Consumable', 50, 0, 'New', 'Office Drawer', '2023-10-10'),
        ('9V Batteries', 'pa', 'Consumable', 20, 0, 'New', 'Office Drawer', '2023-10-10'),
        ('Gaffer Tape', 'pa', 'Consumable', 10, 0, 'New', 'Toolbox', '2023-10-10'),
        ('Fuses (13A)', 'pa', 'Consumable', 30, 0, 'New', 'Toolbox', '2023-10-10')
    `);

    // Update legacy items if they exist
    await db.run(`UPDATE inventory_items SET category = 'Fixed Asset', location = 'Store', condition = 'Good' WHERE type = 'deco' AND category IS NULL`);

    console.log('Seeded PA inventory items');
  }

  // Ensure photographers
  const photogCount = await db.get('SELECT count(*) as count FROM photographers');
  if (photogCount.count === 0) {
    await db.exec(`
      INSERT INTO photographers (name) VALUES
      ('Alice Shooter'),
      ('Bob Clicker');
    `);
    console.log('Seeded photographers');
  }

  // Ensure Clients
  const clientCount = await db.get('SELECT count(*) as count FROM clients');
    if (clientCount.count === 0) {
    await db.exec(`
      INSERT INTO clients (name, email, phone) VALUES
      ('John Doe', 'john@example.com', '555-0100');
    `);
    console.log('Seeded clients');
  }

  // Ensure Users
  const userCount = await db.get('SELECT count(*) as count FROM users');
  if (userCount.count === 0) {
    const passwordHash = bcrypt.hashSync('password123', 10);
    await db.run(`
      INSERT INTO users (email, password_hash, role, full_name) VALUES
      (?, ?, ?, ?),
      (?, ?, ?, ?),
      (?, ?, ?, ?)
    `, [
        'admin@example.com', passwordHash, 'admin', 'System Admin',
        'staff@example.com', passwordHash, 'staff', 'Staff Member',
        'client@example.com', passwordHash, 'customer', 'Client User'
    ]);
    console.log('Seeded users');
  } else {
    // Check if admin exists
    const admin = await db.get("SELECT * FROM users WHERE email = 'admin@example.com'");
    if (!admin) {
        const passwordHash = bcrypt.hashSync('password123', 10);
        await db.run(`INSERT INTO users (email, password_hash, role, full_name) VALUES (?, ?, ?, ?)`,
            ['admin@example.com', passwordHash, 'admin', 'System Admin']
        );
        console.log('Seeded admin user');
    }
  }

  console.log('Seeding complete');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
});
