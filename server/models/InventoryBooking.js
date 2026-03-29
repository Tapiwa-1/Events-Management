import { Model } from './Model.js';

export class InventoryBooking extends Model {
  static tableName = 'inventory_bookings';
  static columns = [
    'id', 'event_id', 'item_id', 'quantity', 'start_time', 'end_time',
    'status', 'qty_out', 'qty_back', 'missing', 'condition_return',
    'returned', 'damaged'
  ];
}
