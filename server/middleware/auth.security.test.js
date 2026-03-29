import { test, mock } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';

test('auth middleware behavior when JWT_SECRET is missing in production', () => {
  const result = spawnSync('node', ['-e', "import('./server/middleware/auth.js')"], {
    env: { ...process.env, NODE_ENV: 'production', JWT_SECRET: '' }
  });

  assert.strictEqual(result.status, 1, 'Should exit with status 1 when JWT_SECRET is missing in production');
  assert.match(result.stderr.toString(), /FATAL ERROR: JWT_SECRET is not defined/, 'Should log fatal error message');
});

test('auth middleware behavior when JWT_SECRET is missing in non-production', () => {
  const result = spawnSync('node', ['-e', "import('./server/middleware/auth.js')"], {
    env: { ...process.env, NODE_ENV: 'development', JWT_SECRET: '' }
  });

  assert.strictEqual(result.status, 0, 'Should exit with status 0 when JWT_SECRET is missing in development');
  assert.match(result.stderr.toString(), /WARNING: JWT_SECRET is not defined/, 'Should log warning message');
});

test('auth middleware behavior when JWT_SECRET is provided', () => {
    const result = spawnSync('node', ['-e', "import('./server/middleware/auth.js')"], {
      env: { ...process.env, JWT_SECRET: 'mysecret' }
    });

    assert.strictEqual(result.status, 0, 'Should exit with status 0 when JWT_SECRET is provided');
    assert.strictEqual(result.stderr.toString(), '', 'Should not log any warning or error when JWT_SECRET is provided');
  });
