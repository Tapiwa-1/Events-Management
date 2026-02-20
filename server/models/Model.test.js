import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Model } from './Model.js';

let db;

class TestItem extends Model {
  static tableName = 'items';
  static async db() {
    return db;
  }
}

describe('Model Base Class', () => {
  before(async () => {
    // Setup in-memory DB
    db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        value INTEGER
      )
    `);
  });

  after(async () => {
    await db.close();
  });

  beforeEach(async () => {
      await db.run('DELETE FROM items');
  });

  it('create() should insert a record and return it with an ID', async () => {
    const item = await TestItem.create({ name: 'test', value: 123 });
    assert.ok(item.id, 'ID should be present');
    assert.strictEqual(item.name, 'test');
    assert.strictEqual(item.value, 123);

    const stored = await db.get('SELECT * FROM items WHERE id = ?', item.id);
    assert.deepStrictEqual(stored, item);
  });

  it('find() should retrieve a record by ID', async () => {
    const { lastID } = await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['find_me', 456]);
    const item = await TestItem.find(lastID);
    assert.ok(item);
    assert.strictEqual(item.id, lastID);
    assert.strictEqual(item.name, 'find_me');
    assert.strictEqual(item.value, 456);
  });

  it('all() should retrieve all records', async () => {
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['item1', 1]);
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['item2', 2]);

    const items = await TestItem.all();
    assert.strictEqual(items.length, 2);
    // Order is not guaranteed without ORDER BY, but usually insertion order
    const names = items.map(i => i.name).sort();
    assert.deepStrictEqual(names, ['item1', 'item2']);
  });

  it('where() should filter records', async () => {
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['a', 10]);
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['b', 20]);
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['c', 10]);

    const results = await TestItem.where({ value: 10 });
    assert.strictEqual(results.length, 2);
    const names = results.map(i => i.name).sort();
    assert.deepStrictEqual(names, ['a', 'c']);
  });

  it('update() should modify a record and return the updated object', async () => {
    const { lastID } = await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['old', 100]);

    const updated = await TestItem.update(lastID, { name: 'new', value: 200 });
    assert.strictEqual(updated.id, lastID);
    assert.strictEqual(updated.name, 'new');
    assert.strictEqual(updated.value, 200);

    const stored = await db.get('SELECT * FROM items WHERE id = ?', lastID);
    assert.deepStrictEqual(stored, updated);
  });

  it('delete() should remove a record', async () => {
    const { lastID } = await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['delete_me', 999]);

    const result = await TestItem.delete(lastID);
    assert.strictEqual(result, true);

    const stored = await db.get('SELECT * FROM items WHERE id = ?', lastID);
    assert.strictEqual(stored, undefined);
  });

  it('query() should execute raw SQL (SELECT)', async () => {
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['q1', 1]);
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['q2', 2]);

    const results = await TestItem.query('SELECT * FROM items WHERE value > ?', [1]);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, 'q2');
  });

  it('query() should execute raw SQL (INSERT)', async () => {
    await TestItem.query('INSERT INTO items (name, value) VALUES (?, ?)', ['raw', 777]);

    const stored = await db.get('SELECT * FROM items WHERE name = ?', 'raw');
    assert.ok(stored);
    assert.strictEqual(stored.value, 777);
  });

  it('first() should return a single record from raw SQL', async () => {
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['f1', 10]);
    await db.run('INSERT INTO items (name, value) VALUES (?, ?)', ['f2', 20]);

    const result = await TestItem.first('SELECT * FROM items WHERE value = ?', [20]);
    assert.ok(result);
    assert.strictEqual(result.name, 'f2');
  });
});
