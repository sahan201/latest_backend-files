import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  offPeakDays: {
    type: [String],
    default: ['Monday', 'Tuesday']
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
