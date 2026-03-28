import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getFinancialData } from './financials.js';

describe('getFinancialData', () => {
  const startDate = '2023-01-01';
  const endDate = '2023-01-03';

  test('should return empty structure for invalid dates', () => {
    const result = getFinancialData([], [], [], [], [], 'invalid', 'date');
    assert.deepStrictEqual(result.labels, []);
    assert.deepStrictEqual(result.income, []);
    assert.deepStrictEqual(result.statusCounts, {});
  });

  test('should handle empty input arrays', () => {
    const result = getFinancialData([], [], [], [], [], startDate, endDate);
    assert.deepStrictEqual(result.labels, ['2023-01-01', '2023-01-02', '2023-01-03']);
    assert.deepStrictEqual(result.income, [0, 0, 0]);
    assert.deepStrictEqual(result.expense, [0, 0, 0]);
    assert.deepStrictEqual(result.sales, [0, 0, 0]);
    assert.deepStrictEqual(result.bookings, [0, 0, 0]);
    assert.deepStrictEqual(result.statusCounts, {});
  });

  test('should process events correctly', () => {
    const events = [
      { date: '2023-01-01', amount_paid: 100, transport_cost: 20, total_cost: 150, status: 'Completed' },
      { date: '2023-01-01', amount_paid: 50, transport_cost: 10, total_cost: 80, status: 'Completed' },
      { date: '2023-01-02', amount_paid: 200, transport_cost: 30, total_cost: 250, status: 'Pending' },
      { date: '2023-01-04', amount_paid: 1000, transport_cost: 100, total_cost: 1200, status: 'Completed' } // Out of range
    ];
    const result = getFinancialData(events, [], [], [], [], startDate, endDate);

    assert.deepStrictEqual(result.income, [150, 200, 0]);
    assert.deepStrictEqual(result.expense, [30, 30, 0]);
    assert.deepStrictEqual(result.sales, [230, 250, 0]);
    assert.deepStrictEqual(result.bookings, [2, 1, 0]);
    assert.deepStrictEqual(result.statusCounts, { 'Completed': 2, 'Pending': 1 });
  });

  test('should process transactions correctly', () => {
    const transactions = [
      { date: '2023-01-01', type: 'in', amount: 100 },
      { date: '2023-01-02', type: 'out', amount: 50, category: 'supplies' },
      { date: '2023-01-02', type: 'out', amount: 30, category: 'drawing' }, // Should be ignored for expense
      { date: '2023-01-04', type: 'in', amount: 500 } // Out of range
    ];
    const result = getFinancialData([], transactions, [], [], [], startDate, endDate);

    assert.deepStrictEqual(result.income, [100, 0, 0]);
    assert.deepStrictEqual(result.expense, [0, 50, 0]);
  });

  test('should process loans correctly', () => {
    const loans = [
      { date_given: '2023-01-01', amount: 1000 },
      { date_given: '2023-01-04', amount: 5000 } // Out of range
    ];
    const result = getFinancialData([], [], loans, [], [], startDate, endDate);

    assert.deepStrictEqual(result.expense, [1000, 0, 0]);
  });

  test('should process loan repayments correctly', () => {
    const repayments = [
      { date: '2023-01-02', amount: 200 },
      { date: '2023-01-04', amount: 500 } // Out of range
    ];
    const result = getFinancialData([], [], [], repayments, [], startDate, endDate);

    assert.deepStrictEqual(result.income, [0, 200, 0]);
  });

  test('should process maintenance logs correctly', () => {
    const maintenanceLogs = [
      { date: '2023-01-03', cost: 150, status: 'Fixed' },
      { date: '2023-01-03', cost: 100, status: 'Pending' }, // Should be ignored (not Fixed)
      { date: '2023-01-04', cost: 500, status: 'Fixed' } // Out of range
    ];
    const result = getFinancialData([], [], [], [], maintenanceLogs, startDate, endDate);

    assert.deepStrictEqual(result.expense, [0, 0, 150]);
  });

  test('should handle inclusive date range', () => {
    const events = [
      { date: '2023-01-01', amount_paid: 10, transport_cost: 0, total_cost: 10, status: 'Completed' },
      { date: '2023-01-03', amount_paid: 20, transport_cost: 0, total_cost: 20, status: 'Completed' }
    ];
    const result = getFinancialData(events, [], [], [], [], startDate, endDate);
    assert.strictEqual(result.income[0], 10);
    assert.strictEqual(result.income[2], 20);
  });
});
