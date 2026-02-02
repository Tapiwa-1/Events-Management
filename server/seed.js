import { initDb } from './database.js';

async function seed() {
  const db = await initDb();

  // Clear existing data (optional, but good for idempotent runs during dev)
  // await db.exec('DELETE FROM inventory_bookings');
  // await db.exec('DELETE FROM service_bookings');
  // await db.exec('DELETE FROM cake_orders');
  // await db.exec('DELETE FROM events');
  // await db.exec('DELETE FROM clients');
  // await db.exec('DELETE FROM inventory_items');
  // await db.exec('DELETE FROM photographers');
  // Actually, better to check if data exists first or just insert if not exists.
  // For simplicity, I'll just check if tables are empty.

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

  console.log('Seeding complete');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
});
