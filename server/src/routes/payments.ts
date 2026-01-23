import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET - Fetch payments and revenue statistics
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, status } = req.query;

    const whereClause: any = {};

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (status) {
      whereClause.paymentStatus = status as string;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        amount: true,
        paymentStatus: true,
        customer: true,
        hall: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
    const paidBookings = bookings.filter((b) => b.paymentStatus === 'PAID');
    const pendingPayments = bookings.filter((b) => b.paymentStatus === 'PENDING').reduce((sum, booking) => sum + (booking.amount || 0), 0);

    const payments = bookings.map((booking) => ({
      id: booking.createdAt.getTime().toString(), // Simple ID for now
      client: booking.customer,
      event: booking.hall.name,
      amount: booking.amount,
      status: booking.paymentStatus,
      date: booking.createdAt.toISOString().split('T')[0],
    }));

    return res.status(200).json({
      totalRevenue,
      pendingPayments,
      payments,
    });
  } catch (error) {
    console.error('Fetch payments error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
