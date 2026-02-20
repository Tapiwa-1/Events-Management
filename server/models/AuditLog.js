import { Model } from './Model.js';

export class AuditLog extends Model {
  static tableName = 'audit_logs';
  static columns = ['id', 'user_id', 'action', 'details', 'ip_address', 'timestamp'];
}
