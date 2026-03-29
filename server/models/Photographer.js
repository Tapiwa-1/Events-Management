import { Model } from './Model.js';

export class Photographer extends Model {
  static tableName = 'photographers';
  static columns = ['id', 'name'];
}
