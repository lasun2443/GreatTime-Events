import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET - Fetch dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalHalls = await prisma.hall.count();
    const totalBookings = await prisma.booking.count();
    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' },
    });
    const totalRevenueResult = await prisma.booking.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paymentStatus: 'PAID',
      },
    });

    const totalRevenue = totalRevenueResult._sum.amount || 0;

    return res.status(200).json({
      totalHalls,
      totalBookings,
      pendingBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Fetch recent bookings (e.g., last 5)
router.get('/recent-bookings', async (req: Request, res: Response) => {
  try {
    const recentBookings = await prisma.booking.findMany({
      take: 5, // Fetch last 5 bookings
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        hall: {
          select: {
            name: true,
          },
        },
      },
    });

    // Transform data to match frontend expectations
    const formattedBookings = recentBookings.map((booking) => ({
      customer: booking.customer,
      hall: booking.hall.name,
      date: new Date(booking.date).toLocaleDateString(),
      status: booking.status,
    }));

    return res.status(200).json({ recentBookings: formattedBookings });
  } catch (error) {
    console.error('Fetch recent bookings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
