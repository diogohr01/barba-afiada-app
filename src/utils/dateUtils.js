
import { format, isToday, isTomorrow, isYesterday, addDays, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format a date in a user-friendly way
 * @param {string} dateString - Date in ISO format (YYYY-MM-DD)
 * @returns {string} Formatted date
 */
export const formatFriendlyDate = (dateString) => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return 'Hoje';
  } else if (isTomorrow(date)) {
    return 'Amanhã';
  } else if (isYesterday(date)) {
    return 'Ontem';
  }
  
  // Format as "Segunda-feira, 12 de maio"
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
};

/**
 * Format date for display in full format
 * @param {string} dateString - Date in ISO format (YYYY-MM-DD)
 * @returns {string} Formatted date
 */
export const formatDateFull = (dateString) => {
  const date = new Date(dateString);
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Format time (HH:MM) with AM/PM
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} Formatted time
 */
export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  
  return format(date, 'HH:mm', { locale: ptBR });
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date
 */
export const getCurrentDate = () => {
  const today = new Date();
  return format(today, 'yyyy-MM-dd');
};

/**
 * Generate array of dates for the next n days
 * @param {number} days - Number of days
 * @returns {Array} Array of date objects with ISO string and formatted display
 */
export const getNextDays = (days = 14) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    const dateISO = format(date, 'yyyy-MM-dd');
    let dateDisplay;
    
    if (i === 0) {
      dateDisplay = 'Hoje';
    } else if (i === 1) {
      dateDisplay = 'Amanhã';
    } else {
      // Format as day of week + day number (e.g., "Seg 12")
      dateDisplay = format(date, 'E d', { locale: ptBR });
    }
    
    dates.push({
      date: dateISO,
      display: dateDisplay,
      isToday: i === 0,
      fullDisplay: formatFriendlyDate(dateISO)
    });
  }
  
  return dates;
};

/**
 * Check if a date is in the past
 * @param {string} dateString - Date in ISO format (YYYY-MM-DD)
 * @returns {boolean} Whether the date is in the past
 */
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(date, today);
};

/**
 * Generate a date range for selection
 * @param {number} days - Number of days in the range
 * @returns {Array} Array of date objects
 */
export const generateDateRange = (days = 14) => {
  const dateRange = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    const dateISO = format(date, 'yyyy-MM-dd');
    
    dateRange.push({
      full: dateISO,
      day: format(date, 'd'),
      weekday: format(date, 'EEE', { locale: ptBR }),
      month: format(date, 'MMM', { locale: ptBR }),
      isToday: i === 0
    });
  }
  
  return dateRange;
};
