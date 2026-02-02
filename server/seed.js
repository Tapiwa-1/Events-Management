import { initDb } from './database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const db = await initDb();

  const itemCount = await db.get('SELECT count(*) as count FROM inventory_items');
  if (itemCount.count === 0) {
    await db.exec(`
      INSERT INTO inventory_items (name, type, total_quantity, buffer_time_hours) VALUES
      ('Gold Wedding Chair', 'deco', 100, 2),
      ('PA System Large', 'pa', 2, 4),
      ('Microphone', 'pa', 10, 1),
      ('Table Centerpiece', 'deco', 50, 2),
      ('Projector', 'av', 3, 2);
    `);
    console.log('Seeded inventory items');
  }

  const photogCount = await db.get('SELECT count(*) as count FROM photographers');
  if (photogCount.count === 0) {
    await db.exec(`
      INSERT INTO photographers (name) VALUES
      ('Alice Shooter'),
      ('Bob Clicker');
    `);
    console.log('Seeded photographers');
  }

  const clientCount = await db.get('SELECT count(*) as count FROM clients');
    if (clientCount.count === 0) {
    await db.exec(`
      INSERT INTO clients (name, email, phone) VALUES
      ('John Doe', 'john@example.com', '555-0100');
    `);
    console.log('Seeded clients');
  }

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
    console.log('Seeded users (password: password123)');
  }

  console.log('Seeding complete');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
});
