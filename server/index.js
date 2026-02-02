import express from 'express';
import cors from 'cors';
import { initDb } from './database.js';
import eventsRouter from './routes/events.js';
import inventoryRouter from './routes/inventory.js';
import servicesRouter from './routes/services.js';
import cakesRouter from './routes/cakes.js';
import logisticsRouter from './routes/logistics.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Event Resource Planner API');
});

app.use('/api/events', eventsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/services', servicesRouter);
app.use('/api/cakes', cakesRouter);
app.use('/api/logistics', logisticsRouter);

// Initialize DB before starting server
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
