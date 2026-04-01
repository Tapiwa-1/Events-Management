import { test } from 'node:test';
import assert from 'node:assert';
import { getFinancialData } from './financials.js';

test('getFinancialData handles invalid dates', () => {
  const result = getFinancialData([], [], [], [], [], 'invalid', '2023-01-01');
  assert.deepStrictEqual(result, {
    labels: [],
    income: [],
    expense: [],
    sales: [],
    bookings: [],
    statusCounts: {}
  });
});

test('getFinancialData returns zeroed data for empty inputs within range', () => {
  const startDate = '2023-01-01';
  const endDate = '2023-01-03';
  const result = getFinancialData([], [], [], [], [], startDate, endDate);

  assert.strictEqual(result.labels.length, 3);
  assert.deepStrictEqual(result.labels, ['2023-01-01', '2023-01-02', '2023-01-03']);
  assert.deepStrictEqual(result.income, [0, 0, 0]);
  assert.deepStrictEqual(result.expense, [0, 0, 0]);
  assert.deepStrictEqual(result.sales, [0, 0, 0]);
  assert.deepStrictEqual(result.bookings, [0, 0, 0]);
  assert.deepStrictEqual(result.statusCounts, {});
});

test('getFinancialData filters data outside of range', () => {
  const startDate = '2023-01-02';
  const endDate = '2023-01-02';

  const events = [
    { date: '2023-01-01', amount_paid: 100, transport_cost: 10, total_cost: 110, status: 'completed' },
    { date: '2023-01-02', amount_paid: 200, transport_cost: 20, total_cost: 220, status: 'completed' },
    { date: '2023-01-03', amount_paid: 300, transport_cost: 30, total_cost: 330, status: 'completed' }
  ];

  const result = getFinancialData(events, [], [], [], [], startDate, endDate);

  assert.strictEqual(result.labels.length, 1);
  assert.strictEqual(result.labels[0], '2023-01-02');
  assert.deepStrictEqual(result.income, [200]);
  assert.deepStrictEqual(result.expense, [20]);
  assert.deepStrictEqual(result.sales, [220]);
  assert.deepStrictEqual(result.bookings, [1]);
  assert.deepStrictEqual(result.statusCounts, { completed: 1 });
});

test('getFinancialData aggregates all data types correctly', () => {
  const startDate = '2023-01-01';
  const endDate = '2023-01-01';

  const events = [{ date: '2023-01-01', amount_paid: 100, transport_cost: 10, total_cost: 150, status: 'planned' }];
  const transactions = [
    { date: '2023-01-01', type: 'in', amount: 50 },
    { date: '2023-01-01', type: 'out', amount: 30, category: 'supplies' },
    { date: '2023-01-01', type: 'out', amount: 100, category: 'drawing' } // Should be excluded from expenses
  ];
  const loans = [{ date_given: '2023-01-01', amount: 200 }];
  const repayments = [{ date: '2023-01-01', amount: 40 }];
  const maintenanceLogs = [
    { date: '2023-01-01', cost: 15, status: 'Fixed' },
    { date: '2023-01-01', cost: 25, status: 'Pending' } // Should be excluded
  ];

  const result = getFinancialData(events, transactions, loans, repayments, maintenanceLogs, startDate, endDate);

  // Income: 100 (event) + 50 (tx in) + 40 (repayment) = 190
  assert.strictEqual(result.income[0], 190);
  // Expense: 10 (event transport) + 30 (tx out) + 200 (loan) + 15 (maintenance Fixed) = 255
  assert.strictEqual(result.expense[0], 255);
  // Sales: 150 (event total_cost)
  assert.strictEqual(result.sales[0], 150);
  // Bookings: 1
  assert.strictEqual(result.bookings[0], 1);
  // Status: { planned: 1 }
  assert.deepStrictEqual(result.statusCounts, { planned: 1 });
});
