import { getDb } from '../database.js';

export class Model {
  static tableName = '';

  static async db() {
    return await getDb();
  }

  static async all() {
    const db = await this.db();
    return await db.all(`SELECT * FROM ${this.tableName}`);
  }

  static async find(id) {
    const db = await this.db();
    return await db.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, id);
  }

  static async where(conditions) {
    const db = await this.db();
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
    return await db.all(`SELECT * FROM ${this.tableName} WHERE ${whereClause}`, values);
  }

  static async create(data) {
    const db = await this.db();
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const result = await db.run(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );
    return { id: result.lastID, ...data };
  }

  static async update(id, data) {
    const db = await this.db();
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    await db.run(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return await this.find(id);
  }

  static async delete(id) {
    const db = await this.db();
    await db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, id);
    return true;
  }

  static async query(sql, params = []) {
    const db = await this.db();
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
        return await db.all(sql, params);
    } else {
        return await db.run(sql, params);
    }
  }

  static async first(sql, params = []) {
      const db = await this.db();
      return await db.get(sql, params);
  }
}
