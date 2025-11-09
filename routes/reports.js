import express from 'express';
import {
  generateBusinessReport,
  getBookingStats,
  getRevenueReport,
  getInventoryReport,
} from '../controllers/reportController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require Manager role
router.use(authRequired, authorize('Manager'));

// Generate comprehensive business report (PDF download)
router.get('/business-report', generateBusinessReport);

// Get booking statistics
router.get('/booking-stats', getBookingStats);

// Get revenue report
router.get('/revenue', getRevenueReport);

// Get inventory report
router.get('/inventory', getInventoryReport);

export default router;