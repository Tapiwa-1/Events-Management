import { test } from 'node:test';
import assert from 'node:assert';
import { bookItem } from '../../controllers/inventoryController.js';
import { InventoryItem } from '../../models/InventoryItem.js';
import { InventoryBooking } from '../../models/InventoryBooking.js';

test('InventoryController - bookItem', async (t) => {
    // Helper to mock Request and Response
    const mockRequest = (body = {}) => ({
        body
    });

    const mockResponse = () => {
        const res = {};
        res.status = (code) => {
            res.statusCode = code;
            return res;
        };
        res.json = (data) => {
            res.data = data;
            return res;
        };
        return res;
    };

    // Store original methods
    const originalItemFind = InventoryItem.find;
    const originalBookingFirst = InventoryBooking.first;
    const originalBookingCreate = InventoryBooking.create;

    // Reset mocks after each test
    t.afterEach(() => {
        InventoryItem.find = originalItemFind;
        InventoryBooking.first = originalBookingFirst;
        InventoryBooking.create = originalBookingCreate;
    });

    await t.test('returns 404 if item not found', async () => {
        InventoryItem.find = async () => null;

        const req = mockRequest({ item_id: 999 });
        const res = mockResponse();

        await bookItem(req, res);

        assert.strictEqual(res.statusCode, 404);
        assert.deepStrictEqual(res.data, { error: 'Item not found' });
    });

    await t.test('returns 409 if not enough availability', async () => {
        InventoryItem.find = async () => ({
            id: 1,
            total_quantity: 10,
            buffer_time_hours: 1
        });

        // Mock booking to show full usage
        InventoryBooking.first = async () => ({ booked_qty: 10 });

        const req = mockRequest({
            event_id: 1,
            item_id: 1,
            quantity: 1,
            start_time: '2023-01-01T10:00:00',
            end_time: '2023-01-01T12:00:00'
        });
        const res = mockResponse();

        await bookItem(req, res);

        assert.strictEqual(res.statusCode, 409);
        assert.deepStrictEqual(res.data, { error: 'Not enough availability' });
    });

    await t.test('returns 200 and booking details on success', async () => {
        InventoryItem.find = async () => ({
            id: 1,
            total_quantity: 10,
            buffer_time_hours: 1
        });

        // Mock booking to show partial usage
        InventoryBooking.first = async () => ({ booked_qty: 5 });

        // Mock successful creation
        InventoryBooking.create = async (data) => ({
            id: 123,
            ...data
        });

        const req = mockRequest({
            event_id: 1,
            item_id: 1,
            quantity: 2, // 5 + 2 <= 10
            start_time: '2023-01-01T10:00:00',
            end_time: '2023-01-01T12:00:00'
        });
        const res = mockResponse();

        await bookItem(req, res);

        // Status defaults to 200 if not set, or we check if json was called
        assert.deepStrictEqual(res.data, { id: 123, status: 'reserved' });
    });

    await t.test('returns 500 on database error', async () => {
        InventoryItem.find = async () => ({
            id: 1,
            total_quantity: 10,
            buffer_time_hours: 1
        });

        InventoryBooking.first = async () => ({ booked_qty: 0 });

        InventoryBooking.create = async () => {
            throw new Error('Database connection failed');
        };

        const req = mockRequest({
            event_id: 1,
            item_id: 1,
            quantity: 1,
            start_time: '2023-01-01T10:00:00',
            end_time: '2023-01-01T12:00:00'
        });
        const res = mockResponse();

        await bookItem(req, res);

        assert.strictEqual(res.statusCode, 500);
        assert.deepStrictEqual(res.data, { error: 'Database connection failed' });
    });
});
