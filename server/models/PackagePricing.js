import { Model } from './Model.js';

const DEFAULT_PRICING = {
  pa_under_100: 130,
  pa_under_200: 200,
  pa_under_350: 250,
  decor_20: 180,
  decor_30: 220,
  decor_40: 280,
  decor_50: 300,
  media_roora_still: 120,
  media_roora_reel: 180,
  media_wedding_note: 'Coming soon',
  catering_per_plate: 2.5,
};

export class PackagePricing extends Model {
  static tableName = 'package_pricing';

  static defaults() {
    return { ...DEFAULT_PRICING };
  }

  static async getConfig() {
    const record = await this.first('SELECT * FROM package_pricing ORDER BY id ASC LIMIT 1');
    if (!record) {
      const created = await this.create(this.defaults());
      return created;
    }
    return record;
  }

  static async saveConfig(data) {
    const existing = await this.first('SELECT * FROM package_pricing ORDER BY id ASC LIMIT 1');
    if (!existing) {
      return await this.create({ ...this.defaults(), ...data });
    }

    return await this.update(existing.id, data);
  }
}
