import { mock } from 'node:test';
import { resolve } from 'path';

const root = process.cwd();

mock.module(resolve(root, 'server/database.js'), {
  namedExports: {
    getDb: async () => ({
      all: async () => [],
      get: async () => ({}),
      run: async () => ({})
    })
  }
});

mock.module(resolve(root, 'server/broadcast/smsSender.js'), {
  namedExports: {
    sendSMS: async () => {
      await new Promise(r => setTimeout(r, 10));
      return { success: true, count: 1 };
    }
  }
});

mock.module(resolve(root, 'server/models/Inquiry.js'), {
  namedExports: {
    Inquiry: {
      query: async () => {
        const inqs = [];
        for (let i = 0; i < 50; i++) {
          inqs.push({
            id: i,
            phone: '123456789',
            message_count: i % 3,
            status: 'new'
          });
        }
        return inqs;
      },
      update: async () => {
        await new Promise(r => setTimeout(r, 10));
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

const start = performance.now();
await runAutomations({}, {
  json: () => {
    console.log('Execution time:', (performance.now() - start).toFixed(2), 'ms');
  },
  status: (c) => ({
    json: (d) => {
      console.log('ERR', c, d);
      process.exit(1);
    }
  })
});
