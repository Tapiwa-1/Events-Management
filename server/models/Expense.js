import { Model } from './Model.js';

export class Expense extends Model {
  static tableName = 'expenses';
  static columns = ['id', 'date', 'category', 'amount', 'description', 'assistant_name', 'event_id'];
}
