
// Mock data for barbers
export const mockBarbers = [
  {
    id: 1,
    name: 'Carlos Silva',
    specialty: 'Corte e Barba',
    image: 'https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    reviewCount: 124,
    isAvailable: true,
    workingHours: '09:00 - 18:00',
    workingDays: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  },
  {
    id: 2,
    name: 'André Santos',
    specialty: 'Cortes Modernos',
    image: 'https://images.unsplash.com/photo-1567894340794-d48d2b769b10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    reviewCount: 98,
    isAvailable: true,
    workingHours: '10:00 - 19:00',
    workingDays: ['seg', 'ter', 'qui', 'sex', 'sab']
  },
  {
    id: 3,
    name: 'Rafael Oliveira',
    specialty: 'Barba & Relaxamento',
    image: 'https://images.unsplash.com/photo-1551975036-57dd42532078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.9,
    reviewCount: 156,
    isAvailable: false,
    workingHours: '09:00 - 18:00',
    workingDays: ['ter', 'qua', 'qui', 'sex', 'sab']
  },
  {
    id: 4,
    name: 'Lucas Mendes',
    specialty: 'Cortes Clássicos',
    image: 'https://images.unsplash.com/photo-1554435493-93422e8d1a41?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.6,
    reviewCount: 87,
    isAvailable: true,
    workingHours: '11:00 - 20:00',
    workingDays: ['seg', 'qua', 'qui', 'sex', 'sab', 'dom']
  }
];

// Mock data for services
export const mockServices = [
  {
    id: 1,
    name: 'Corte de Cabelo',
    price: 35.00,
    duration: 30,
    description: 'Corte moderno ou clássico, inclui lavagem',
    images: ['service-haircut.jpg']
  },
  {
    id: 2,
    name: 'Barba',
    price: 25.00,
    duration: 20,
    description: 'Modelagem e acabamento com navalha',
    images: ['service-beard.jpg']
  },
  {
    id: 3,
    name: 'Corte + Barba',
    price: 50.00,
    duration: 45,
    description: 'Combo completo de corte e barba',
    images: ['service-combo.jpg']
  },
  {
    id: 4,
    name: 'Tratamento Capilar',
    price: 45.00,
    duration: 40,
    description: 'Hidratação e nutrição para cabelos',
    images: ['service-treatment.jpg']
  },
  {
    id: 5,
    name: 'Coloração',
    price: 60.00,
    duration: 60,
    description: 'Tintura e acabamento para cabelo ou barba',
    images: ['service-coloring.jpg']
  },
  {
    id: 6,
    name: 'Relaxamento Facial',
    price: 40.00,
    duration: 30,
    description: 'Limpeza e massagem facial relaxante',
    images: ['service-facial.jpg']
  }
];

// Mock data for appointments
export const mockAppointments = [
  {
    id: 1,
    service: 'Corte de Cabelo',
    barberId: 1,
    barberName: 'Carlos Silva',
    date: '2025-05-25',
    time: '14:30',
    price: 35.00,
    status: 'upcoming',
    notes: ''
  },
  {
    id: 2,
    service: 'Barba',
    barberId: 3,
    barberName: 'Rafael Oliveira',
    date: '2025-05-18',
    time: '10:00',
    price: 25.00,
    status: 'completed',
    notes: ''
  },
  {
    id: 3,
    service: 'Corte + Barba',
    barberId: 2,
    barberName: 'André Santos',
    date: '2025-05-10',
    time: '16:45',
    price: 50.00,
    status: 'canceled',
    notes: 'Cliente desmarcou'
  },
  {
    id: 4,
    service: 'Tratamento Capilar',
    barberId: 4,
    barberName: 'Lucas Mendes',
    date: '2025-04-28',
    time: '11:30',
    price: 45.00,
    status: 'completed',
    notes: ''
  }
];

// API services for when you connect to a real backend
export const apiService = {
  // Get all barbers
  getBarbers: async () => {
    // In a real app, this would call your API
    // Example: return await fetch('/api/barbers').then(res => res.json());
    return mockBarbers;
  },
  
  // Get barber by id
  getBarberById: async (id) => {
    // Example: return await fetch(`/api/barbers/${id}`).then(res => res.json());
    return mockBarbers.find(barber => barber.id === parseInt(id));
  },
  
  // Get all services
  getServices: async () => {
    // Example: return await fetch('/api/services').then(res => res.json());
    return mockServices;
  },
  
  // Get service by id
  getServiceById: async (id) => {
    // Example: return await fetch(`/api/services/${id}`).then(res => res.json());
    return mockServices.find(service => service.id === parseInt(id));
  },
  
  // Get user appointments
  getUserAppointments: async (userId) => {
    // Example: return await fetch(`/api/users/${userId}/appointments`).then(res => res.json());
    return mockAppointments;
  },
  
  // Create new appointment
  createAppointment: async (appointmentData) => {
    // Example: 
    // return await fetch('/api/appointments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(appointmentData)
    // }).then(res => res.json());
    
    // Mock implementation
    const newAppointment = {
      id: mockAppointments.length + 1,
      ...appointmentData,
      status: 'upcoming'
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  },
  
  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    // Example:
    // return await fetch(`/api/appointments/${appointmentId}/cancel`, {
    //   method: 'PUT'
    // }).then(res => res.json());
    
    // Mock implementation
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'canceled';
    }
    return appointment;
  },
  
  // Get available time slots
  getAvailableTimeSlots: async (barberId, date) => {
    // Example: return await fetch(`/api/barbers/${barberId}/available?date=${date}`).then(res => res.json());
    
    // Mock implementation - generate some available times
    const times = [];
    const startHour = 9;
    const endHour = 19;
    
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    
    // Randomly remove some times to simulate booked slots
    return times.filter(() => Math.random() > 0.3);
  }
};
