import Settings from '../models/Settings.js';

export const checkOffPeakDay = async (date) => {
  try {
    const settings = await Settings.findOne();
    const offPeakDays = settings ? settings.offPeakDays : ['Monday', 'Tuesday'];
    
    const dayOfWeek = new Date(date).toLocaleString('en-US', {
      weekday: 'long',
    });
    
    return offPeakDays.includes(dayOfWeek);
  } catch (error) {
    console.error('Error in checkOffPeakDay:', error);
    return false;
  }
};
