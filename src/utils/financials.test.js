import test from 'node:test';
import assert from 'node:assert';
import { getFinancialData } from './financials.js';

test('getFinancialData - basic calculation', () => {
  const events = [
    { date: '2023-10-01', amount_paid: 100, transport_cost: 20, total_cost: 150, status: 'Completed' },
    { date: '2023-10-02', amount_paid: 200, transport_cost: 30, total_cost: 250, status: 'Pending' }
  ];
  const transactions = [
    { date: '2023-10-01', type: 'in', amount: 50, category: 'sales' },
    { date: '2023-10-02', type: 'out', amount: 40, category: 'fuel' }
  ];
  const loans = [
    { date_given: '2023-10-01', amount: 500 }
  ];
  const repayments = [
    { date: '2023-10-02', amount: 100 }
  ];
  const maintenanceLogs = [
    { date: '2023-10-01', cost: 60, status: 'Fixed' },
    { date: '2023-10-02', cost: 70, status: 'Pending' } // Should be ignored
  ];

  const startDate = '2023-10-01';
  const endDate = '2023-10-02';

  const result = getFinancialData(events, transactions, loans, repayments, maintenanceLogs, startDate, endDate);

  assert.strictEqual(result.labels.length, 2);
  assert.strictEqual(result.labels[0], '2023-10-01');
  assert.strictEqual(result.labels[1], '2023-10-02');

  // Income:
  // Oct 1: Event(100) + TxIn(50) = 150
  // Oct 2: Event(200) + Repayment(100) = 300
  assert.strictEqual(result.income[0], 150);
  assert.strictEqual(result.income[1], 300);

  // Expense:
  // Oct 1: EventTrans(20) + Loan(500) + Maintenance(60) = 580
  // Oct 2: EventTrans(30) + TxOut(40) = 70
  assert.strictEqual(result.expense[0], 580);
  assert.strictEqual(result.expense[1], 70);

  // Sales:
  // Oct 1: Event(150)
  // Oct 2: Event(250)
  assert.strictEqual(result.sales[0], 150);
  assert.strictEqual(result.sales[1], 250);

  // Bookings:
  // Oct 1: 1
  // Oct 2: 1
  assert.strictEqual(result.bookings[0], 1);
  assert.strictEqual(result.bookings[1], 1);

  // Status Counts:
  assert.strictEqual(result.statusCounts['Completed'], 1);
  assert.strictEqual(result.statusCounts['Pending'], 1);
});

test('getFinancialData - edge cases: drawings and maintenance status', () => {
  const transactions = [
    { date: '2023-10-01', type: 'out', amount: 100, category: 'drawing' } // Should be ignored in expenses
  ];
  const maintenanceLogs = [
    { date: '2023-10-01', cost: 50, status: 'Faulty' } // Should be ignored in expenses
  ];

  const result = getFinancialData([], transactions, [], [], maintenanceLogs, '2023-10-01', '2023-10-01');

  assert.strictEqual(result.expense[0], 0);
});

test('getFinancialData - edge cases: boundary dates', () => {
  const events = [
    { date: '2023-09-30', amount_paid: 100 }, // Before range
    { date: '2023-10-01', amount_paid: 200 }, // On start boundary
    { date: '2023-10-02', amount_paid: 300 }, // Inside range
    { date: '2023-10-03', amount_paid: 400 }, // On end boundary
    { date: '2023-10-04', amount_paid: 500 }  // After range
  ];

  const result = getFinancialData(events, [], [], [], [], '2023-10-01', '2023-10-03');

  assert.strictEqual(result.labels.length, 3);
  assert.strictEqual(result.income[0], 200);
  assert.strictEqual(result.income[1], 300);
  assert.strictEqual(result.income[2], 400);
});

test('getFinancialData - invalid input dates', () => {
  const result = getFinancialData([], [], [], [], [], 'invalid', '2023-10-01');
  assert.strictEqual(result.labels.length, 0);
  assert.deepStrictEqual(result.income, []);
});

test('getFinancialData - empty input arrays', () => {
  const result = getFinancialData([], [], [], [], [], '2023-10-01', '2023-10-02');
  assert.strictEqual(result.labels.length, 2);
  assert.strictEqual(result.income[0], 0);
  assert.strictEqual(result.income[1], 0);
});
