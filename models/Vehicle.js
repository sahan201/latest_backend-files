import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    customer: {  // Changed from 'owner' to 'customer' for consistency
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    make: {
      type: String,
      required: [true, 'Please provide the vehicle make (e.g., Toyota).'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide the vehicle model (e.g., Corolla).'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please provide the vehicle year.'],
    },
    vehicleNo: {
      type: String,
      required: [true, 'Please provide the vehicle registration number.'],
      unique: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({ customer: 1 });
vehicleSchema.index({ vehicleNo: 1 }, { unique: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
