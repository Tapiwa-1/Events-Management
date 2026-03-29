import { Model } from './Model.js';

export class CakeOrder extends Model {
  static tableName = 'cake_orders';
  static columns = ['id', 'event_id', 'flavor', 'dietary_restrictions', 'design_notes', 'status', 'due_date'];
}
