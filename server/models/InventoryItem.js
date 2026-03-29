import { Model } from './Model.js';

export class InventoryItem extends Model {
  static tableName = 'inventory_items';
  static columns = [
    'id', 'name', 'type', 'category', 'total_quantity',
    'buffer_time_hours', 'condition', 'location', 'last_checked'
  ];
}
