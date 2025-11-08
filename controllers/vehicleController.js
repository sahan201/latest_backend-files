import Vehicle from '../models/Vehicle.js';

/**
 * @desc    Add a new vehicle for the logged-in customer
 * @route   POST /api/vehicles
 * @access  Private (Customer)
 */
export const addVehicle = async (req, res) => {
  try {
    const { make, model, year, vehicleNo } = req.body;

    // Validation
    if (!make || !model || !year || !vehicleNo) {
      return res.status(400).json({ 
        message: 'Please provide all required vehicle details (make, model, year, vehicleNo)' 
      });
    }

    // Check if vehicle number already exists
    const existingVehicle = await Vehicle.findOne({ vehicleNo: vehicleNo.toUpperCase() });
    if (existingVehicle) {
      return res.status(400).json({ 
        message: 'A vehicle with this registration number already exists' 
      });
    }

    // Create new vehicle
    const newVehicle = new Vehicle({
      customer: req.user._id,  // Using 'customer' field (fixed)
      make,
      model,
      year,
      vehicleNo: vehicleNo.toUpperCase(),
    });

    await newVehicle.save();

    res.status(201).json({ 
      success: true,
      message: 'Vehicle added successfully', 
      vehicle: newVehicle 
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ message: 'Server error while adding vehicle' });
  }
};

/**
 * @desc    Get all vehicles for the logged-in customer
 * @route   GET /api/vehicles
 * @access  Private (Customer)
 */
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ customer: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Server error while fetching vehicles' });
  }
};

/**
 * @desc    Get a single vehicle by ID
 * @route   GET /api/vehicles/:id
 * @access  Private (Customer)
 */
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Security check: Ensure the user owns the vehicle
    if (vehicle.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to view this vehicle' 
      });
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a specific vehicle for the logged-in customer
 * @route   PUT /api/vehicles/:id
 * @access  Private (Customer)
 */
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Security check: Ensure the user owns the vehicle
    if (vehicle.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to update this vehicle' 
      });
    }

    // If updating vehicleNo, check for duplicates
    if (req.body.vehicleNo && req.body.vehicleNo !== vehicle.vehicleNo) {
      const existingVehicle = await Vehicle.findOne({ 
        vehicleNo: req.body.vehicleNo.toUpperCase() 
      });
      if (existingVehicle) {
        return res.status(400).json({ 
          message: 'A vehicle with this registration number already exists' 
        });
      }
    }

    // Update fields
    vehicle.make = req.body.make || vehicle.make;
    vehicle.model = req.body.model || vehicle.model;
    vehicle.year = req.body.year || vehicle.year;
    vehicle.vehicleNo = req.body.vehicleNo 
      ? req.body.vehicleNo.toUpperCase() 
      : vehicle.vehicleNo;

    const updatedVehicle = await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Server error while updating vehicle' });
  }
};

/**
 * @desc    Delete a specific vehicle for the logged-in customer
 * @route   DELETE /api/vehicles/:id
 * @access  Private (Customer)
 */
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Security check: Ensure the user owns the vehicle
    if (vehicle.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this vehicle' 
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({ 
      success: true,
      message: 'Vehicle removed successfully' 
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Server error while deleting vehicle' });
  }
};
