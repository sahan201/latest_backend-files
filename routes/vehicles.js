import express from 'express';
import {
  addVehicle,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and Customer role
router.use(authRequired, authorize('Customer'));

// @route   POST /api/vehicles
// @desc    Add a new vehicle
// @access  Private (Customer)
router.post('/', addVehicle);

// @route   GET /api/vehicles
// @desc    Get all vehicles for logged-in customer
// @access  Private (Customer)
router.get('/', getMyVehicles);

// @route   GET /api/vehicles/:id
// @desc    Get a single vehicle by ID
// @access  Private (Customer)
router.get('/:id', getVehicleById);

// @route   PUT /api/vehicles/:id
// @desc    Update a specific vehicle
// @access  Private (Customer)
router.put('/:id', updateVehicle);

// @route   DELETE /api/vehicles/:id
// @desc    Delete a specific vehicle
// @access  Private (Customer)
router.delete('/:id', deleteVehicle);

export default router;
