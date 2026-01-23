import { Router, Request, Response } from 'express';

const router = Router();

interface EventCenterInfo {
  centerName: string;
  contactPhone: string;
  emailAddress: string;
  location: string;
}

interface BookingSettings {
  allowOnlineBookings: boolean;
  requirePaymentBeforeApproval: boolean;
  sendEmailNotifications: boolean;
}

// In-memory mock data for settings
let eventCenterInfo: EventCenterInfo = {
  centerName: 'GreatTime Event Center',
  contactPhone: '123-456-7890',
  emailAddress: 'info@greattime.com',
  location: '123 Event Street, City, Country',
};

let bookingSettings: BookingSettings = {
  allowOnlineBookings: true,
  requirePaymentBeforeApproval: true,
  sendEmailNotifications: true,
};

// GET - Fetch all settings
router.get('/', (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      eventCenterInfo,
      bookingSettings,
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Update Event Center Information
router.put('/event-center-info', (req: Request, res: Response) => {
  try {
    const { centerName, contactPhone, emailAddress, location } = req.body;
    eventCenterInfo = { centerName, contactPhone, emailAddress, location };
    return res.status(200).json({ message: 'Event center info updated successfully', eventCenterInfo });
  } catch (error) {
    console.error('Update event center info error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Update Booking Settings
router.put('/booking-settings', (req: Request, res: Response) => {
  try {
    const { allowOnlineBookings, requirePaymentBeforeApproval, sendEmailNotifications } = req.body;
    bookingSettings = { allowOnlineBookings, requirePaymentBeforeApproval, sendEmailNotifications };
    return res.status(200).json({ message: 'Booking settings updated successfully', bookingSettings });
  } catch (error) {
    console.error('Update booking settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
