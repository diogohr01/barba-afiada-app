
/**
 * Utilitários para gerenciamento de agendamentos
 */

/**
 * Verifica se um horário está disponível para agendamento
 * @param {number} barberId - ID do barbeiro
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {string} time - Horário no formato HH:MM
 * @param {Array} existingAppointments - Lista de agendamentos existentes
 * @returns {boolean} - true se o horário estiver disponível
 */
export const isTimeSlotAvailable = (barberId, date, time, existingAppointments) => {
  if (!existingAppointments || !Array.isArray(existingAppointments)) {
    return true;
  }
  
  // Verificar se já existe um agendamento para o mesmo barbeiro na mesma data e horário
  return !existingAppointments.some(appointment => 
    appointment.barberId === barberId && 
    appointment.date === date && 
    appointment.time === time &&
    appointment.status !== 'canceled'
  );
};

/**
 * Gera horários disponíveis para um barbeiro em uma data específica
 * @param {number} barberId - ID do barbeiro
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {Array} existingAppointments - Lista de agendamentos existentes
 * @param {Object} businessHours - Horário de funcionamento {start: '09:00', end: '18:00'}
 * @param {number} appointmentDuration - Duração de cada agendamento em minutos
 * @returns {Array} - Lista de horários disponíveis no formato HH:MM
 */
export const generateAvailableTimeSlots = (
  barberId, 
  date, 
  existingAppointments, 
  businessHours = { start: '09:00', end: '18:00' },
  appointmentDuration = 30
) => {
  const slots = [];
  const [startHour, startMinute] = businessHours.start.split(':').map(Number);
  const [endHour, endMinute] = businessHours.end.split(':').map(Number);
  
  // Converter para minutos para facilitar os cálculos
  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  // Gerar slots de horário
  while (currentMinutes < endMinutes) {
    // Formatar para HH:MM
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    if (isTimeSlotAvailable(barberId, date, timeSlot, existingAppointments)) {
      slots.push(timeSlot);
    }
    
    // Avançar para o próximo slot
    currentMinutes += appointmentDuration;
  }
  
  return slots;
};

/**
 * Formata uma data para exibição
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @param {Object} options - Opções de formatação para toLocaleDateString
 * @returns {string} - Data formatada
 */
export const formatDate = (dateString, options = { 
  weekday: 'long', 
  day: 'numeric', 
  month: 'long',
  year: 'numeric'
}) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', options);
};

/**
 * Verifica se uma data é hoje
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {boolean} - true se a data for hoje
 */
export const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return today.toDateString() === date.toDateString();
};

/**
 * Verifica se uma data é no passado
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {boolean} - true se a data for no passado
 */
export const isPastDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  return date < today;
};
