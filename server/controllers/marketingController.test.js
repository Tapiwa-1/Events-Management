import { test, mock } from 'node:test';
import assert from 'node:assert';
import { resolve } from 'path';

const root = process.cwd();

// Mock database
mock.module(resolve(root, 'server/database.js'), {
  namedExports: {
    getDb: async () => ({
      all: async () => [],
      get: async () => ({}),
      run: async () => ({})
    })
  }
});

let smsCalls = [];
mock.module(resolve(root, 'server/broadcast/smsSender.js'), {
  namedExports: {
    sendSMS: async (to, msg) => {
      smsCalls.push({ to, msg });
      return { success: true, count: 1 };
    }
  }
});

let updateCalls = [];
mock.module(resolve(root, 'server/models/Inquiry.js'), {
  namedExports: {
    Inquiry: {
      query: async (sql) => {
        return [
          { id: 1, phone: '111', message_count: 0, status: 'new' },
          { id: 2, phone: '222', message_count: 2, status: 'active' },
          { id: 3, phone: null, message_count: 0, status: 'new' }, // No phone, should be skipped
        ];
      },
      update: async (id, data) => {
        updateCalls.push({ id, data });
        return {};
      }
    }
  }
});

mock.module(resolve(root, 'server/models/Event.js'), {
  namedExports: {
    Event: {
      query: async () => []
    }
  }
});

const { runAutomations } = await import('./marketingController.js');

test('runAutomations should send SMS and update status correctly', async (t) => {
  smsCalls = [];
  updateCalls = [];

  const resData = {};
  const res = {
    json: (data) => {
      resData.body = data;
    },
    status: (code) => ({
      json: (data) => {
        resData.status = code;
        resData.body = data;
      }
    })
  };

  await runAutomations({}, res);

  // Assert counts
  assert.strictEqual(resData.body.sent_count, 2);
  assert.strictEqual(resData.body.removed_count, 1); // Only id 2 hits count 3 (2+1)

  // Assert SMS calls
  assert.strictEqual(smsCalls.length, 2);
  assert.strictEqual(smsCalls[0].to, '111');
  assert.strictEqual(smsCalls[0].msg, 'Follow-up 1/3');
  assert.strictEqual(smsCalls[1].to, '222');
  assert.strictEqual(smsCalls[1].msg, 'Follow-up 3/3');

  // Assert Updates
  assert.strictEqual(updateCalls.length, 2);
  assert.strictEqual(updateCalls[0].id, 1);
  assert.strictEqual(updateCalls[0].data.message_count, 1);
  assert.strictEqual(updateCalls[0].data.status, 'new');

  assert.strictEqual(updateCalls[1].id, 2);
  assert.strictEqual(updateCalls[1].data.message_count, 3);
  assert.strictEqual(updateCalls[1].data.status, 'removed');
  assert.ok(updateCalls[1].data.last_message_sent);
});
