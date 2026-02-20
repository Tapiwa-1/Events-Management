import { describe, it, mock } from 'node:test';
import assert from 'node:assert';

// Mock dependencies - defined before importing the module under test
const mockEventCreate = mock.fn();
const mockInventoryBookingCreate = mock.fn();
const mockSendSMS = mock.fn();

// We need to ensure these mocks are applied before the controller is imported
mock.module('../models/Event.js', {
  namedExports: {
    Event: class {
      static create = mockEventCreate;
      // createEvent doesn't use other Event methods, but we can add stubs if needed
    }
  }
});

mock.module('../models/InventoryBooking.js', {
  namedExports: {
    InventoryBooking: class {
      static create = mockInventoryBookingCreate;
    }
  }
});

mock.module('../broadcast/smsSender.js', {
  namedExports: {
    sendSMS: mockSendSMS
  }
});

// Import the module under test using dynamic import to ensure mocks are applied
// This must be awaited
const { createEvent } = await import('../controllers/eventController.js');

describe('Event Controller - createEvent', () => {

    it('should create an event successfully without SMS or inventory', async () => {
        mockEventCreate.mock.resetCalls();
        mockInventoryBookingCreate.mock.resetCalls();
        mockSendSMS.mock.resetCalls();

        const req = {
            body: {
                name: 'Test Event',
                date: '2023-10-27',
                // No client_phone, no inventory
            }
        };
        const res = {
            json: mock.fn(),
            status: mock.fn(() => res)
        };

        const createdEvent = { id: 1, ...req.body, status: 'planned', amount_paid: 0, total_cost: 0, transport_cost: 0 };
        mockEventCreate.mock.mockImplementation(async () => createdEvent);

        await createEvent(req, res);

        assert.strictEqual(mockEventCreate.mock.callCount(), 1);
        assert.strictEqual(mockSendSMS.mock.callCount(), 0);
        assert.strictEqual(mockInventoryBookingCreate.mock.callCount(), 0);
        assert.strictEqual(res.json.mock.callCount(), 1);
        assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], createdEvent);
    });

    it('should send SMS if client_phone is provided', async () => {
        mockEventCreate.mock.resetCalls();
        mockSendSMS.mock.resetCalls();
        mockInventoryBookingCreate.mock.resetCalls();

        const req = {
            body: {
                name: 'Test Event',
                client_phone: '1234567890'
            }
        };
        const res = {
            json: mock.fn(),
            status: mock.fn(() => res)
        };

        const createdEvent = { id: 1, ...req.body };
        mockEventCreate.mock.mockImplementation(async () => createdEvent);

        await createEvent(req, res);

        assert.strictEqual(mockSendSMS.mock.callCount(), 1);
        const args = mockSendSMS.mock.calls[0].arguments;
        assert.strictEqual(args[0], '1234567890');
        assert.match(args[1], /has been booked successfully/);
    });

    it('should create inventory bookings if inventory is provided', async () => {
        mockEventCreate.mock.resetCalls();
        mockInventoryBookingCreate.mock.resetCalls();
        mockSendSMS.mock.resetCalls();

        const req = {
            body: {
                name: 'Inventory Event',
                inventory: [
                    { item_id: 10, quantity: 5 },
                    { item_id: 11, quantity: 0 }, // Should be skipped
                    { item_id: 12, quantity: 2 }
                ],
                start_time: '10:00',
                end_time: '12:00'
            }
        };
        const res = {
            json: mock.fn(),
            status: mock.fn(() => res)
        };

        const createdEvent = { id: 1, ...req.body };
        mockEventCreate.mock.mockImplementation(async () => createdEvent);

        await createEvent(req, res);

        assert.strictEqual(mockInventoryBookingCreate.mock.callCount(), 2);

        // First call
        const call1 = mockInventoryBookingCreate.mock.calls[0].arguments[0];
        assert.strictEqual(call1.event_id, 1);
        assert.strictEqual(call1.item_id, 10);
        assert.strictEqual(call1.quantity, 5);

        // Second call
        const call2 = mockInventoryBookingCreate.mock.calls[1].arguments[0];
        assert.strictEqual(call2.event_id, 1);
        assert.strictEqual(call2.item_id, 12);
        assert.strictEqual(call2.quantity, 2);
    });

    it('should handle errors during event creation', async () => {
        mockEventCreate.mock.resetCalls();
        mockInventoryBookingCreate.mock.resetCalls();
        mockSendSMS.mock.resetCalls();

        const req = { body: { name: 'Error Event' } };
        const res = {
            json: mock.fn(),
            status: mock.fn(() => res)
        };

        mockEventCreate.mock.mockImplementation(async () => {
            throw new Error('Database error');
        });

        await createEvent(req, res);

        assert.strictEqual(res.status.mock.callCount(), 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
        assert.strictEqual(res.json.mock.callCount(), 1);
        assert.strictEqual(res.json.mock.calls[0].arguments[0].error, 'Database error');
    });
});
