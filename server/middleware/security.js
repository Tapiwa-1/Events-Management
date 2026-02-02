import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const configureSecurity = (app) => {
  // Use Helmet for secure headers
  app.use(helmet());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });

  // Apply rate limiting to all requests (or you can scope it to /api)
  app.use('/api', limiter);
};
