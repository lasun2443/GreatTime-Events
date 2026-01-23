import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET - Fetch all halls
router.get('/', async (req: Request, res: Response) => {
  try {
    const halls = await prisma.hall.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    return res.status(200).json({ halls });
  } catch (error) {
    console.error('Fetch halls error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Create a new hall
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, capacity, price } = req.body;

    // Validation
    if (!name || !capacity || !price) {
      return res.status(400).json({ error: 'Name, capacity, and price are required' });
    }

    if (capacity < 1) {
      return res.status(400).json({ error: 'Capacity must be at least 1' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    // Create hall
    const hall = await prisma.hall.create({
      data: {
        name,
        capacity: parseInt(capacity),
        price: parseFloat(price),
      },
    });

    return res.status(201).json({
      message: 'Hall created successfully',
      hall,
    });
  } catch (error) {
    console.error('Create hall error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - Delete a hall
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Hall ID is required' });
    }

    // Check if hall exists
    const hall = await prisma.hall.findUnique({
      where: { id: id as string },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!hall) {
      return res.status(404).json({ error: 'Hall not found' });
    }

    // Optional: Check if hall has active bookings
    if (hall._count.bookings > 0) {
      return res.status(400).json({ error: 'Cannot delete hall with existing bookings' });
    }

    // Delete hall
    await prisma.hall.delete({
      where: { id: id as string },
    });

    return res.status(200).json({
      message: 'Hall deleted successfully',
    });
  } catch (error) {
    console.error('Delete hall error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
