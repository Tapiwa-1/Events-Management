import { getDb } from './database.js';

const inventoryItems = [
    { name: '15" Hybrid Wooden speaker', total_quantity: 2 },
    { name: '15" Hybrid Plastic speaker', total_quantity: 2 },
    { name: '15" Hybrid Bass Bin speaker', total_quantity: 2 },
    { name: '6 Channel Hybrid mixer', total_quantity: 1 },
    { name: '2 Channel Hybrid mixer', total_quantity: 1 },
    { name: 'Hybrid Amplifier', total_quantity: 1 },
    { name: 'Hybrid Crossover', total_quantity: 1 }, // Corrected "Cossover"
    { name: 'Shure Cordless mic', total_quantity: 1 }, // Corrected "Codeless"
    { name: 'Hybrid Cordless Mic', total_quantity: 1 }, // Corrected "Codess"
    { name: 'Hybrid Speaker Stands', total_quantity: 4 }
];

async function seed() {
    const db = await getDb();
    console.log('Seeding Inventory for PA System...');

    const type = 'pa';
    const category = 'Fixed Asset';
    const condition = 'Good';
    const location = 'Store';
    const last_checked = new Date().toISOString().split('T')[0];
    const buffer_time_hours = 0;

    for (const item of inventoryItems) {
        // Check if exists
        const existing = await db.get('SELECT id FROM inventory_items WHERE name = ? AND type = ?', [item.name, type]);

        if (existing) {
            console.log(`Skipping ${item.name} (already exists)`);
        } else {
            await db.run(
                `INSERT INTO inventory_items (name, type, category, total_quantity, buffer_time_hours, condition, location, last_checked)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [item.name, type, category, item.total_quantity, buffer_time_hours, condition, location, last_checked]
            );
            console.log(`Inserted ${item.name}`);
        }
    }

    console.log('Seeding complete.');
}

seed().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
