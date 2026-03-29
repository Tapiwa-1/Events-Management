import { Model } from './Model.js';

export class Loan extends Model {
  static tableName = 'loans';
  static columns = ['id', 'borrower', 'type', 'date_given', 'amount', 'interest', 'due_date', 'status'];
}
