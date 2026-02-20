import { Model } from './Model.js';

export class MaintenanceLog extends Model {
  static tableName = 'maintenance_logs';
  static columns = ['id', 'item_id', 'date', 'issue', 'action', 'cost', 'status'];
}
