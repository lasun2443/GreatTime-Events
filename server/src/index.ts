
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import hallRoutes from './routes/halls';
import bookingRoutes from './routes/bookings';
import authRoutes from './routes/auth';
import paymentsRoutes from './routes/payments';
import settingsRoutes from './routes/settings';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('GreatTime Events API is running!');
});

app.use('/api/halls', hallRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
