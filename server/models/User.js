import { Model } from './Model.js';

export class User extends Model {
  static tableName = 'users';
  static columns = [
    'id', 'email', 'password_hash', 'role', 'full_name',
    'is_active', 'last_login', 'reset_token', 'reset_token_expiry'
  ];
}
