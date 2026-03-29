import { Model } from './Model.js';

export class ConsumableLog extends Model {
  static tableName = 'consumables_logs';
  static columns = ['id', 'item_id', 'date', 'qty_used', 'balance'];
}
