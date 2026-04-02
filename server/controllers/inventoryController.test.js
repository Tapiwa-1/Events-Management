import { test, describe, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { createConsumableLog } from './inventoryController.js';

describe('Inventory Controller - createConsumableLog', () => {
    let req, res;
    let mockInventoryItemModel;
    let mockConsumableLogModel;

    beforeEach(() => {
        req = {
            body: {
                item_id: 1,
                date: '2023-10-27',
                qty_used: 5
            }
        };

        // Setup res mock with chaining support for status().json()
        res = {
            json: mock.fn(),
            status: mock.fn(function() { return this; })
        };

        mockInventoryItemModel = {
            find: mock.fn(),
            update: mock.fn()
        };

        mockConsumableLogModel = {
            create: mock.fn()
        };
    });

    test('should update inventory and create log on success', async () => {
        const item = { id: 1, total_quantity: 100 };
        mockInventoryItemModel.find = mock.fn(async () => item);
        mockInventoryItemModel.update = mock.fn(async () => {});
        mockConsumableLogModel.create = mock.fn(async () => {});

        await createConsumableLog(req, res, {
            InventoryItemModel: mockInventoryItemModel,
            ConsumableLogModel: mockConsumableLogModel
        });

        assert.strictEqual(mockInventoryItemModel.find.mock.calls.length, 1);
        assert.deepStrictEqual(mockInventoryItemModel.find.mock.calls[0].arguments, [1]);

        assert.strictEqual(mockInventoryItemModel.update.mock.calls.length, 1);
        // Expect balance to be 100 - 5 = 95
        assert.deepStrictEqual(mockInventoryItemModel.update.mock.calls[0].arguments, [1, { total_quantity: 95 }]);

        assert.strictEqual(mockConsumableLogModel.create.mock.calls.length, 1);
        assert.deepStrictEqual(mockConsumableLogModel.create.mock.calls[0].arguments, [{
            item_id: 1,
            date: '2023-10-27',
            qty_used: 5,
            balance: 95
        }]);

        assert.strictEqual(res.json.mock.calls.length, 1);
        assert.deepStrictEqual(res.json.mock.calls[0].arguments, [{ success: true, new_balance: 95 }]);
    });

    test('should return 404 if item not found', async () => {
        mockInventoryItemModel.find = mock.fn(async () => null);

        await createConsumableLog(req, res, {
            InventoryItemModel: mockInventoryItemModel,
            ConsumableLogModel: mockConsumableLogModel
        });

        assert.strictEqual(res.status.mock.calls.length, 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 404);
        assert.strictEqual(res.json.mock.calls.length, 1);
        assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'Item not found' });
    });

    test('should return 500 if database error during find', async () => {
        const error = new Error('DB Error');
        mockInventoryItemModel.find = mock.fn(async () => { throw error; });

        await createConsumableLog(req, res, {
            InventoryItemModel: mockInventoryItemModel,
            ConsumableLogModel: mockConsumableLogModel
        });

        assert.strictEqual(res.status.mock.calls.length, 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
        assert.strictEqual(res.json.mock.calls.length, 1);
        assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'DB Error' });
    });

    test('should return 500 if database error during update', async () => {
        const item = { id: 1, total_quantity: 100 };
        mockInventoryItemModel.find = mock.fn(async () => item);
        mockInventoryItemModel.update = mock.fn(async () => { throw new Error('Update Failed'); });

        await createConsumableLog(req, res, {
            InventoryItemModel: mockInventoryItemModel,
            ConsumableLogModel: mockConsumableLogModel
        });

        assert.strictEqual(res.status.mock.calls.length, 1);
        assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
        assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'Update Failed' });
    });
});
