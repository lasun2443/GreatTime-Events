import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET - Fetch all bookings with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, customer } = req.query;

    interface WhereClause {
      status?: string;
      customer?: {
        contains: string;
        mode: 'insensitive';
      };
    }

    const where: WhereClause = {};

    if (status) {
      where.status = status as string;
    }

    if (customer) {
      where.customer = {
        contains: customer as string,
        mode: 'insensitive',
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        hall: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Create a new booking
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customer, phone, email, hallId, date, amount } = req.body;

    // Validation
    if (!customer || !phone || !hallId || !date) {
      return res
        .status(400)
        .json({ error: 'Customer, phone, hall, and date are required' });
    }

    // Check if hall exists
    const hall = await prisma.hall.findUnique({
      where: { id: hallId },
    });

    if (!hall) {
      return res.status(404).json({ error: 'Hall not found' });
    }

    // Check if hall is already booked on this date
    const bookingDate = new Date(date);
    const existingBooking = await prisma.booking.findFirst({
      where: {
        hallId,
        date: bookingDate,
        status: {
          in: ['PENDING', 'APPROVED'],
        },
      },
    });

    if (existingBooking) {
      return res.status(409).json({ error: 'Hall is already booked on this date' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customer,
        phone,
        email: email || null,
        hallId,
        date: bookingDate,
        amount: amount ? parseFloat(amount) : hall.price,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        hall: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH - Update booking status
router.patch('/', async (req: Request, res: Response) => {
  try {
    const { id, status, paymentStatus } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Prepare update data
    interface UpdateData {
      status?: string;
      paymentStatus?: string;
    }

    const updateData: UpdateData = {};

    if (status) {
      if (!['PENDING', 'APPROVED', 'CANCELLED', 'COMPLETED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      if (!['PENDING', 'PAID', 'FAILED', 'REFUNDED'].includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
      }
      updateData.paymentStatus = paymentStatus;
    }

    // Update booking
    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        hall: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - Delete a booking
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: id as string },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id: id as string },
    });

    return res.status(200).json({
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
