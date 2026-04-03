import { test, before, after, beforeEach, describe, mock } from 'node:test';
import assert from 'node:assert';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

// Mock database connection
mock.module('../database.js', {
    namedExports: {
        getDb: async () => db,
        initDb: async () => {}
    }
});

// Import controller AFTER mock
const { getInventory } = await import('../controllers/inventoryController.js');

describe('Inventory Controller', () => {
    before(async () => {
        db = await open({
            filename: ':memory:',
            driver: sqlite3.Database
        });

        // Initialize Schema
        await db.exec(`
            CREATE TABLE IF NOT EXISTS inventory_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              type TEXT,
              category TEXT,
              total_quantity INTEGER NOT NULL,
              buffer_time_hours INTEGER DEFAULT 0,
              condition TEXT,
              location TEXT,
              last_checked TEXT
            );

            CREATE TABLE IF NOT EXISTS inventory_bookings (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              event_id INTEGER,
              item_id INTEGER,
              quantity INTEGER NOT NULL,
              start_time TEXT,
              end_time TEXT,
              status TEXT,
              qty_out INTEGER DEFAULT 0,
              qty_back INTEGER DEFAULT 0,
              missing INTEGER DEFAULT 0,
              condition_return TEXT,
              returned INTEGER DEFAULT 0,
              damaged INTEGER DEFAULT 0,
              FOREIGN KEY (item_id) REFERENCES inventory_items(id)
            );
        `);

        // Seed initial items
        await db.run(`INSERT INTO inventory_items (name, type, category, total_quantity, buffer_time_hours) VALUES ('Speaker', 'pa', 'Operational', 10, 2)`);
        await db.run(`INSERT INTO inventory_items (name, type, category, total_quantity, buffer_time_hours) VALUES ('Light', 'deco', 'Operational', 5, 0)`);
    });

    after(async () => {
        await db.close();
    });

    beforeEach(async () => {
        await db.run('DELETE FROM inventory_bookings');
    });

    test('getInventory returns all items with full availability when no dates provided', async () => {
        const req = { query: {} };
        const res = {
            json: (data) => {
                assert.strictEqual(data.length, 2);
                const speaker = data.find(i => i.name === 'Speaker');
                assert.strictEqual(speaker.available_quantity, 10);
            }
        };
        await getInventory(req, res);
    });

    test('getInventory filters by type', async () => {
        const req = { query: { type: 'pa' } };
        const res = {
            json: (data) => {
                assert.strictEqual(data.length, 1);
                assert.strictEqual(data[0].name, 'Speaker');
            }
        };
        await getInventory(req, res);
    });

    test('getInventory calculates availability with overlapping booking', async () => {
        // Create booking: 10:00 to 12:00, quantity 3
        await db.run(`INSERT INTO inventory_bookings (item_id, quantity, start_time, end_time, status) VALUES (1, 3, '2023-10-10T10:00:00', '2023-10-10T12:00:00', 'confirmed')`);

        const req = {
            query: {
                start_time: '2023-10-10T11:00:00',
                end_time: '2023-10-10T13:00:00'
            }
        };

        let responseData;
        const res = { json: (data) => { responseData = data; } };

        await getInventory(req, res);

        const speaker = responseData.find(i => i.name === 'Speaker');
        // Total 10 - Booked 3 = 7
        assert.strictEqual(speaker.available_quantity, 7);
    });

    test('getInventory respects buffer time', async () => {
        // Speaker has 2 hours buffer.
        // Booking ends at 12:00. Buffer ends at 14:00.
        // Request starts at 13:00 (inside buffer).
        await db.run(`INSERT INTO inventory_bookings (item_id, quantity, start_time, end_time, status) VALUES (1, 3, '2023-10-10T10:00:00', '2023-10-10T12:00:00', 'confirmed')`);

        const req = {
            query: {
                start_time: '2023-10-10T13:00:00',
                end_time: '2023-10-10T15:00:00'
            }
        };

        let responseData;
        const res = { json: (data) => { responseData = data; } };

        await getInventory(req, res);

        const speaker = responseData.find(i => i.name === 'Speaker');
        // Blocked by booking due to buffer
        assert.strictEqual(speaker.available_quantity, 7);
    });

    test('getInventory ignores cancelled bookings', async () => {
        // Create cancelled booking overlapping the request
        await db.run(`INSERT INTO inventory_bookings (item_id, quantity, start_time, end_time, status) VALUES (1, 5, '2023-10-10T13:00:00', '2023-10-10T15:00:00', 'cancelled')`);

        const req = {
            query: {
                start_time: '2023-10-10T13:00:00',
                end_time: '2023-10-10T15:00:00'
            }
        };

        let responseData;
        const res = { json: (data) => { responseData = data; } };

        await getInventory(req, res);

        const speaker = responseData.find(i => i.name === 'Speaker');
        assert.strictEqual(speaker.available_quantity, 10);
    });

    test('getInventory returns full availability outside booking and buffer', async () => {
        // Booking ends at 12:00. Buffer ends at 14:00.
        await db.run(`INSERT INTO inventory_bookings (item_id, quantity, start_time, end_time, status) VALUES (1, 3, '2023-10-10T10:00:00', '2023-10-10T12:00:00', 'confirmed')`);

        const req = {
            query: {
                start_time: '2023-10-10T15:00:00', // After buffer (14:00)
                end_time: '2023-10-10T16:00:00'
            }
        };

        let responseData;
        const res = { json: (data) => { responseData = data; } };

        await getInventory(req, res);

        const speaker = responseData.find(i => i.name === 'Speaker');
        assert.strictEqual(speaker.available_quantity, 10);
    });
});
