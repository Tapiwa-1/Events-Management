import { Model } from './Model.js';

export class LoanRepayment extends Model {
  static tableName = 'loan_repayments';
  static columns = ['id', 'loan_id', 'date', 'amount', 'method', 'notes'];
}
