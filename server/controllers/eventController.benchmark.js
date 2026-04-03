import { mock } from 'node:test';

// Mocking dependencies
mock.module('../models/Event.js', {
  namedExports: {
    Event: {
      create: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 10)); // Simulated DB delay
        return { id: 1, ...data };
      }
    }
  }
});

mock.module('../models/InventoryBooking.js', {
  namedExports: {
    InventoryBooking: {
      create: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 10)); // Simulated DB delay
        return { id: Math.random(), ...data };
      }
    }
  }
});

mock.module('../broadcast/smsSender.js', {
  namedExports: {
    sendSMS: async () => {
       await new Promise(resolve => setTimeout(resolve, 10));
       return { success: true };
    }
  }
});

const { createEvent } = await import('./eventController.js');

async function runBenchmark(iterations = 5) {
    const req = {
        body: {
            name: 'Test Event',
            client_phone: '1234567890',
            inventory: Array.from({ length: 10 }, (_, i) => ({ item_id: i, quantity: 1 }))
        }
    };

    let totalTime = 0;

    console.log(`Running benchmark with ${iterations} iterations...`);
    for (let i = 0; i < iterations; i++) {
        const res = {
            json: (data) => data,
            status: function() { return this; }
        };
        const start = performance.now();
        await createEvent(req, res);
        const end = performance.now();
        const duration = end - start;
        console.log(`Iteration ${i + 1}: ${duration.toFixed(2)}ms`);
        totalTime += duration;
    }

    const averageTime = totalTime / iterations;
    console.log(`\nAverage execution time: ${averageTime.toFixed(2)}ms`);
}

runBenchmark().catch(err => {
    console.error(err);
    process.exit(1);
});
