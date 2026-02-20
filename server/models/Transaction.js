import { Model } from './Model.js';

export class Transaction extends Model {
  static tableName = 'transactions';
  static columns = ['id', 'date', 'description', 'amount', 'type', 'category', 'method', 'notes'];
}
