
/**
 * Utilitários para formatação e manipulação de datas
 */

/**
 * Formata uma data para exibição com nome do dia da semana, dia e mês
 * @param {string|Date} date - Data a ser formatada
 * @param {string} locale - Localização para formatação (padrão: pt-BR)
 * @returns {string} - Data formatada
 */
export const formatDateFull = (date, locale = 'pt-BR') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formata uma data para exibição curta (dd/mm/yyyy)
 * @param {string|Date} date - Data a ser formatada
 * @param {string} locale - Localização para formatação (padrão: pt-BR)
 * @returns {string} - Data formatada
 */
export const formatDateShort = (date, locale = 'pt-BR') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Retorna um objeto com partes da data para exibição em calendário
 * @param {string|Date} date - Data a ser formatada
 * @param {string} locale - Localização para formatação (padrão: pt-BR)
 * @returns {Object} - Objeto com partes da data (dia, diaSemana, mes)
 */
export const getDateParts = (date, locale = 'pt-BR') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return {
    day: dateObj.getDate(),
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(dateObj),
    month: new Intl.DateTimeFormat(locale, { month: 'short' }).format(dateObj),
    isToday: isSameDay(dateObj, new Date())
  };
};

/**
 * Verifica se duas datas representam o mesmo dia
 * @param {Date} date1 - Primeira data
 * @param {Date} date2 - Segunda data
 * @returns {boolean} - true se forem o mesmo dia
 */
export const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

/**
 * Gera um array de datas para os próximos N dias
 * @param {number} days - Número de dias a gerar
 * @param {string} locale - Localização para formatação (padrão: pt-BR)
 * @returns {Array} - Array de objetos de data
 */
export const generateDateRange = (days = 14, locale = 'pt-BR') => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    dates.push({
      full: date.toISOString().split('T')[0],
      day: date.getDate(),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
      month: new Intl.DateTimeFormat(locale, { month: 'short' }).format(date),
      isToday: i === 0
    });
  }
  
  return dates;
};

/**
 * Formata um horário para exibição (HH:MM)
 * @param {string} time - Horário no formato HH:MM
 * @returns {string} - Horário formatado
 */
export const formatTime = (time) => {
  // Adicione lógica personalizada de formatação de hora se necessário
  return time;
};

/**
 * Verifica se uma data já passou
 * @param {string|Date} date - Data a ser verificada
 * @returns {boolean} - true se a data está no passado
 */
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  return checkDate < today;
};
