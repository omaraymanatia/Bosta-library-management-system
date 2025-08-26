import express from 'express';

import errorHandler from './utils/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';


const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/borrows', borrowRoutes);



app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);


export default app;