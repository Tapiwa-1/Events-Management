import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initDb } from './database.js';
import { configureSecurity } from './middleware/security.js';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';
import inventoryRouter from './routes/inventory.js';
import servicesRouter from './routes/services.js';
import cakesRouter from './routes/cakes.js';
import logisticsRouter from './routes/logistics.js';
<<<<<<< HEAD
import expensesRouter from './routes/expenses.js';
=======
import businessRouter from './routes/business.js';
>>>>>>> feat/business-management-panel-2154364554946012169

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

configureSecurity(app);

app.get('/', (req, res) => {
  res.send('Hello from Event Resource Planner API');
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/services', servicesRouter);
app.use('/api/cakes', cakesRouter);
app.use('/api/logistics', logisticsRouter);
<<<<<<< HEAD
app.use('/api/expenses', expensesRouter);
=======
app.use('/api/business', businessRouter);
>>>>>>> feat/business-management-panel-2154364554946012169

// Initialize DB before starting server
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
