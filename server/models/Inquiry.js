import { Model } from './Model.js';

export class Inquiry extends Model {
  static tableName = 'inquiries';
  static columns = ['id', 'name', 'phone', 'message', 'date', 'status', 'message_count', 'last_message_sent'];
}
