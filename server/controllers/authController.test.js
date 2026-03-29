import { test, mock, describe, afterEach } from 'node:test';
import assert from 'node:assert';

// Create mock implementations
const mockBcrypt = {
  compare: mock.fn(),
  hash: mock.fn()
};

const mockUser = {
  first: mock.fn(),
  query: mock.fn(),
  create: mock.fn(),
  // Add other methods used in authController if any (e.g. for register)
  // For login, we need first and query.
};

const mockAuditLog = {
  create: mock.fn()
};

const mockAuth = {
  generateToken: mock.fn(() => 'mock-token')
};

// Mock dependencies
mock.module('bcryptjs', { defaultExport: mockBcrypt });
mock.module('../models/User.js', { namedExports: { User: mockUser } });
mock.module('../models/AuditLog.js', { namedExports: { AuditLog: mockAuditLog } });
mock.module('../middleware/auth.js', { namedExports: { generateToken: mockAuth.generateToken } });

// Import the controller under test
const { login } = await import('./authController.js');

describe('Auth Controller - Login', () => {
  afterEach(() => {
    // Reset call history and implementations
    mockBcrypt.compare.mock.resetCalls();
    mockUser.first.mock.resetCalls();
    mockUser.query.mock.resetCalls();
    mockAuditLog.create.mock.resetCalls();
    mockAuth.generateToken.mock.resetCalls();

    // Reset implementations to default (undefined) to ensure tests set them up explicitly
    mockBcrypt.compare.mock.restore();
    mockUser.first.mock.restore();
    mockUser.query.mock.restore();
    mockAuditLog.create.mock.restore();
  });

  test('should return 401 if user not found', async () => {
    mockUser.first.mock.mockImplementation(() => Promise.resolve(null));

    const req = { body: { email: 'nonexistent@example.com', password: 'password' } };
    const res = {
      statusCode: 200,
      status: mock.fn(function(code) {
        this.statusCode = code;
        return this;
      }),
      json: mock.fn()
    };

    await login(req, res);

    assert.strictEqual(res.statusCode, 401);
    assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'Invalid credentials' });
  });

  test('should return 401 if password does not match', async () => {
    mockUser.first.mock.mockImplementation(() => Promise.resolve({
      id: 1, email: 'test@example.com', password_hash: 'hashed'
    }));
    mockBcrypt.compare.mock.mockImplementation(() => Promise.resolve(false));

    const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
    const res = {
      statusCode: 200,
      status: mock.fn(function(code) {
        this.statusCode = code;
        return this;
      }),
      json: mock.fn()
    };

    await login(req, res);

    assert.strictEqual(res.statusCode, 401);
    assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'Invalid credentials' });
  });

  test('should return 403 if account is disabled', async () => {
    mockUser.first.mock.mockImplementation(() => Promise.resolve({
      id: 1, email: 'test@example.com', password_hash: 'hashed', is_active: 0
    }));
    mockBcrypt.compare.mock.mockImplementation(() => Promise.resolve(true));

    const req = { body: { email: 'test@example.com', password: 'password' } };
    const res = {
      statusCode: 200,
      status: mock.fn(function(code) {
        this.statusCode = code;
        return this;
      }),
      json: mock.fn()
    };

    await login(req, res);

    assert.strictEqual(res.statusCode, 403);
    assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { error: 'Account disabled' });
  });

  test('should login successfully', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashed',
      is_active: 1,
      role: 'admin',
      full_name: 'Test User'
    };

    mockUser.first.mock.mockImplementation(() => Promise.resolve(user));
    mockBcrypt.compare.mock.mockImplementation(() => Promise.resolve(true));
    mockUser.query.mock.mockImplementation(() => Promise.resolve());
    mockAuditLog.create.mock.mockImplementation(() => Promise.resolve());

    const req = { body: { email: 'test@example.com', password: 'password' }, ip: '127.0.0.1' };
    const res = {
      statusCode: 200,
      cookie: mock.fn(),
      json: mock.fn(),
      status: mock.fn(function(code) {
        this.statusCode = code;
        return this;
      })
    };

    await login(req, res);

    // Verify response
    assert.strictEqual(res.json.mock.callCount(), 1);
    const responseBody = res.json.mock.calls[0].arguments[0];
    assert.strictEqual(responseBody.message, 'Logged in');
    assert.strictEqual(responseBody.token, 'mock-token');
    assert.deepStrictEqual(responseBody.user, {
      id: 1, email: 'test@example.com', role: 'admin', name: 'Test User'
    });

    // Verify side effects
    assert.strictEqual(mockUser.query.mock.callCount(), 1);
    assert.ok(mockUser.query.mock.calls[0].arguments[0].includes('UPDATE users SET last_login'));

    assert.strictEqual(mockAuditLog.create.mock.callCount(), 1);
    assert.deepStrictEqual(mockAuditLog.create.mock.calls[0].arguments[0], {
      user_id: 1,
      action: 'LOGIN',
      ip_address: '127.0.0.1'
    });

    assert.strictEqual(res.cookie.mock.callCount(), 1);
    assert.strictEqual(res.cookie.mock.calls[0].arguments[0], 'token');
    assert.strictEqual(res.cookie.mock.calls[0].arguments[1], 'mock-token');
  });
});
