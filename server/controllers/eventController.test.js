import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { updateEvent } from './eventController.js';
import { Event } from '../models/Event.js';

describe('Event Controller - updateEvent', () => {
  let originalFind;
  let originalUpdate;
  let findMock;
  let updateMock;

  before(() => {
    originalFind = Event.find;
    originalUpdate = Event.update;
  });

  after(() => {
    Event.find = originalFind;
    Event.update = originalUpdate;
  });

  beforeEach(() => {
    // Reset mocks for each test
    // We wrap the mock execution to allow dynamic assignment of findMock/updateMock per test
    Event.find = async (...args) => {
        if (findMock) return findMock(...args);
        return null;
    };
    Event.update = async (...args) => {
        if (updateMock) return updateMock(...args);
        return null;
    };
    findMock = null;
    updateMock = null;
  });

  const createMockRes = () => {
    const res = {
      statusCode: 200,
      jsonData: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.jsonData = data;
        return this;
      }
    };
    return res;
  };

  test('should auto-pay remaining balance when status is completed', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'completed' }
    };
    const res = createMockRes();

    // Mock existing event with total_cost 1000
    findMock = async (id) => {
        assert.strictEqual(id, 1);
        return { id: 1, total_cost: 1000, amount_paid: 500 };
    };

    let updateCalled = false;
    updateMock = async (id, data) => {
        updateCalled = true;
        assert.strictEqual(id, 1);
        assert.strictEqual(data.status, 'completed');
        assert.strictEqual(data.amount_paid, 1000); // Should match total_cost
    };

    await updateEvent(req, res);

    assert.strictEqual(updateCalled, true, 'Event.update should be called');
    assert.strictEqual(res.jsonData.message, 'Event updated');
  });

  test('should use provided total_cost for auto-pay when status is completed', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'completed', total_cost: 2000 }
    };
    const res = createMockRes();

    findMock = async (id) => {
        return { id: 1, total_cost: 1000 };
    };

    let updateCalled = false;
    updateMock = async (id, data) => {
        updateCalled = true;
        assert.strictEqual(data.amount_paid, 2000);
        assert.strictEqual(data.total_cost, 2000);
    };

    await updateEvent(req, res);
    assert.strictEqual(updateCalled, true, 'Event.update should be called');
  });

  test('should not auto-pay when status is not completed', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'planned' }
    };
    const res = createMockRes();

    findMock = async () => {
        assert.fail('Event.find should not be called');
    };

    let updateCalled = false;
    updateMock = async (id, data) => {
        updateCalled = true;
        assert.strictEqual(data.status, 'planned');
        assert.strictEqual(data.amount_paid, undefined);
    };

    await updateEvent(req, res);
    assert.strictEqual(updateCalled, true, 'Event.update should be called');
  });

  test('should return "No updates" when body is empty or fields are undefined', async () => {
    const req = {
      params: { id: 1 },
      body: {}
    };
    const res = createMockRes();

    let updateCalled = false;
    updateMock = async () => { updateCalled = true; };

    await updateEvent(req, res);

    assert.strictEqual(updateCalled, false, 'Event.update should NOT be called');
    assert.strictEqual(res.jsonData.message, 'No updates');
  });

  test('should handle errors gracefully', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'completed' }
    };
    const res = createMockRes();

    findMock = async () => {
        throw new Error('Database error');
    };

    await updateEvent(req, res);

    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.jsonData.error, 'Database error');
  });
});
