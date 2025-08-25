import express from 'express';

import errorHandler from './utils/errorHandler.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/v1/users', userRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);


export default app;