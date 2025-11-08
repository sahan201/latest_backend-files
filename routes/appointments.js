import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  getAllAppointments,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Customer)
router.post('/', authRequired, authorize('Customer'), createAppointment);

// IMPORTANT: Specific routes must come BEFORE parameterized routes
// @route   GET /api/appointments/my-appointments
// @desc    Get all appointments for logged-in customer
// @access  Private (Customer)
router.get('/my-appointments', authRequired, authorize('Customer'), getMyAppointments);

// @route   GET /api/appointments
// @desc    Get all appointments (for Manager/Mechanic)
// @access  Private (Manager, Mechanic)
router.get('/', authRequired, authorize('Manager', 'Mechanic'), getAllAppointments);

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Private (Customer)
router.put('/:id/cancel', authRequired, authorize('Customer'), cancelAppointment);

// @route   GET /api/appointments/:id
// @desc    Get a single appointment by ID
// @access  Private (Customer, Manager, Mechanic)
router.get('/:id', authRequired, getAppointmentById);

export default router;
