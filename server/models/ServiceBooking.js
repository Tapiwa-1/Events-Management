import { Model } from './Model.js';

export class ServiceBooking extends Model {
  static tableName = 'service_bookings';
  static columns = ['id', 'event_id', 'photographer_id', 'start_time', 'end_time', 'status', 'post_prod_status'];
}
