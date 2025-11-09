import express from 'express';
import {
  submitComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintStats,
} from '../controllers/complaintController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// Customer routes - must come before /:id
router.get('/my-complaints', authRequired, authorize('Customer'), getMyComplaints);
router.post('/', authRequired, authorize('Customer'), submitComplaint);

// Manager routes
router.get('/stats', authRequired, authorize('Manager'), getComplaintStats);
router.get('/', authRequired, authorize('Manager'), getAllComplaints);
router.put('/:id', authRequired, authorize('Manager'), updateComplaint);
router.delete('/:id', authRequired, authorize('Manager'), deleteComplaint);

// Shared routes (Customer can view own, Manager can view all)
router.get('/:id', authRequired, getComplaintById);

export default router;