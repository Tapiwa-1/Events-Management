import { Model } from './Model.js';

export class Event extends Model {
  static tableName = 'events';
  static columns = [
    'id', 'client_id', 'name', 'date', 'start_time', 'end_time',
    'location', 'type', 'status', 'failure_reason', 'amount_paid',
    'total_cost', 'transport_cost', 'client_phone', 'google_sheet_url'
  ];
}
