import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert';
import { register } from './authController.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

describe('Auth Controller - Register', () => {
    let originalUserFirst;
    let originalUserCreate;
    let originalBcryptHash;

    before(() => {
        // Backup original methods
        originalUserFirst = User.first;
        originalUserCreate = User.create;
        originalBcryptHash = bcrypt.hash;
    });

    after(() => {
        // Restore original methods
        User.first = originalUserFirst;
        User.create = originalUserCreate;
        bcrypt.hash = originalBcryptHash;
    });

    test('should return 400 if email or password is missing', async () => {
        const req = { body: {} };
        let statusCode, responseBody;
        const res = {
            status: (code) => { statusCode = code; return res; },
            json: (body) => { responseBody = body; return res; }
        };

        await register(req, res);

        assert.strictEqual(statusCode, 400);
        assert.deepStrictEqual(responseBody, { error: 'Email and password required' });
    });

    test('should return 409 if user already exists', async () => {
        // Mock User.first to return an existing user
        User.first = mock.fn(async () => ({ id: 1, email: 'test@example.com' }));

        const req = { body: { email: 'test@example.com', password: 'password123' } };
        let statusCode, responseBody;
        const res = {
            status: (code) => { statusCode = code; return res; },
            json: (body) => { responseBody = body; return res; }
        };

        await register(req, res);

        assert.strictEqual(statusCode, 409);
        assert.deepStrictEqual(responseBody, { error: 'User already exists' });
        assert.strictEqual(User.first.mock.calls.length, 1);
    });

    test('should return 201 and create user on success', async () => {
        // Mock User.first to return null (user not found)
        User.first = mock.fn(async () => null);

        // Mock bcrypt.hash
        bcrypt.hash = mock.fn(async () => 'hashed_password');

        // Mock User.create
        User.create = mock.fn(async (data) => ({ id: 123, ...data }));

        const req = {
            body: {
                email: 'new@example.com',
                password: 'password123',
                full_name: 'Test User',
                role: 'admin'
            }
        };

        let statusCode, responseBody;
        const res = {
            status: (code) => { statusCode = code; return res; },
            json: (body) => { responseBody = body; return res; }
        };

        await register(req, res);

        assert.strictEqual(statusCode, 201);
        assert.strictEqual(responseBody.message, 'User created');
        assert.strictEqual(responseBody.id, 123);

        // Verify calls
        assert.strictEqual(bcrypt.hash.mock.calls.length, 1);
        assert.strictEqual(bcrypt.hash.mock.calls[0].arguments[0], 'password123');

        assert.strictEqual(User.create.mock.calls.length, 1);
        const createArgs = User.create.mock.calls[0].arguments[0];
        assert.strictEqual(createArgs.email, 'new@example.com');
        assert.strictEqual(createArgs.password_hash, 'hashed_password');
        assert.strictEqual(createArgs.full_name, 'Test User');
        assert.strictEqual(createArgs.role, 'admin');
    });

    test('should use default role "customer" if role not provided', async () => {
        User.first = mock.fn(async () => null);
        bcrypt.hash = mock.fn(async () => 'hashed_password');
        User.create = mock.fn(async (data) => ({ id: 124, ...data }));

        const req = {
            body: {
                email: 'customer@example.com',
                password: 'password123'
            }
        };

        const res = {
            status: () => res,
            json: () => res
        };

        await register(req, res);

        const createArgs = User.create.mock.calls[0].arguments[0];
        assert.strictEqual(createArgs.role, 'customer');
    });

    test('should return 500 if database error occurs', async () => {
        User.first = mock.fn(async () => null);
        bcrypt.hash = mock.fn(async () => 'hashed_password');
        User.create = mock.fn(async () => { throw new Error('Database connection failed'); });

        const req = { body: { email: 'fail@example.com', password: 'password123' } };

        let statusCode, responseBody;
        const res = {
            status: (code) => { statusCode = code; return res; },
            json: (body) => { responseBody = body; return res; }
        };

        await register(req, res);

        assert.strictEqual(statusCode, 500);
        assert.deepStrictEqual(responseBody, { error: 'Database connection failed' });
    });
});
