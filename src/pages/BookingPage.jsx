
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, Clock } from 'lucide-react';
import { mockBarbers, mockServices, apiService } from '../data/mockData';

const BookingPage = () => {
  const navigate = useNavigate();
  const { barberId } = useParams();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [step, setStep] = useState(1);
  
  // Generate dates for the next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push({
        full: date.toISOString().split('T')[0],
        day: date.getDate(),
        weekday: new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date),
        month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date),
      });
    }
    
    return dates;
  };
  
  const dates = generateDates();
  
  useEffect(() => {
    // If barberId is provided in the URL, preselect that barber
    if (barberId) {
      const barber = mockBarbers.find(b => b.id === parseInt(barberId));
      if (barber) {
        setSelectedBarber(barber);
      }
    }
    
    // If serviceId is provided in the URL, preselect that service
    if (serviceId) {
      const service = mockServices.find(s => s.id === parseInt(serviceId));
      if (service) {
        setSelectedService(service);
      }
    }
  }, [barberId, serviceId]);
  
  // When date is selected, fetch available time slots
  useEffect(() => {
    if (selectedBarber && selectedDate) {
      const fetchTimes = async () => {
        const times = await apiService.getAvailableTimeSlots(selectedBarber.id, selectedDate);
        setAvailableTimes(times);
      };
      
      fetchTimes();
    }
  }, [selectedBarber, selectedDate]);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  
  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };
  
  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleBooking = async () => {
    // Create appointment object
    const appointmentData = {
      service: selectedService.name,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      date: selectedDate,
      time: selectedTime,
      price: selectedService.price,
      status: 'upcoming',
      notes: ''
    };
    
    // In a real app, you would send this to your backend
    try {
      const newAppointment = await apiService.createAppointment(appointmentData);
      console.log('Appointment created:', newAppointment);
      
      // Navigate to confirmation page
      navigate(`/confirmation/${newAppointment.id}`);
    } catch (error) {
      console.error('Error creating appointment:', error);
      // Handle error (show error message to user)
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Escolha o serviço</h2>
            <div className="grid grid-cols-1 gap-3">
              {mockServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`
                    flex justify-between items-center p-4 rounded-lg border
                    ${selectedService && selectedService.id === service.id 
                      ? 'bg-[#9b87f5] bg-opacity-20 border-[#9b87f5]' 
                      : 'bg-[#403E43] border-transparent hover:border-[#9b87f5]'}
                    transition-colors
                  `}
                >
                  <div className="flex-1">
                    <p className="font-medium text-left">{service.name}</p>
                    <div className="flex text-sm text-gray-300">
                      <span>{service.duration} min</span>
                      <span className="mx-2">•</span>
                      <span>R$ {service.price.toFixed(2)}</span>
                    </div>
                  </div>
                  {selectedService && selectedService.id === service.id && (
                    <div className="bg-[#9b87f5] p-1 rounded-full">
                      <Check size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-8">
              <button
                disabled={!selectedService}
                onClick={nextStep}
                className={`
                  w-full py-3 text-center rounded-lg
                  ${selectedService 
                    ? 'bg-[#9b87f5] hover:bg-[#8B5CF6]' 
                    : 'bg-[#403E43] text-gray-400 cursor-not-allowed'}
                  transition-colors
                `}
              >
                Continuar
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Escolha o barbeiro</h2>
            <div className="grid grid-cols-1 gap-3">
              {mockBarbers.map(barber => (
                <button
                  key={barber.id}
                  onClick={() => handleBarberSelect(barber)}
                  className={`
                    flex items-center p-4 rounded-lg border
                    ${selectedBarber && selectedBarber.id === barber.id 
                      ? 'bg-[#9b87f5] bg-opacity-20 border-[#9b87f5]' 
                      : 'bg-[#403E43] border-transparent hover:border-[#9b87f5]'}
                    transition-colors
                  `}
                >
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{barber.name}</p>
                    <p className="text-sm text-gray-300">{barber.specialty}</p>
                  </div>
                  {selectedBarber && selectedBarber.id === barber.id && (
                    <div className="bg-[#9b87f5] p-1 rounded-full">
                      <Check size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-8 flex space-x-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 text-center bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
              >
                Voltar
              </button>
              <button
                disabled={!selectedBarber}
                onClick={nextStep}
                className={`
                  flex-1 py-3 text-center rounded-lg
                  ${selectedBarber 
                    ? 'bg-[#9b87f5] hover:bg-[#8B5CF6]' 
                    : 'bg-[#403E43] text-gray-400 cursor-not-allowed'}
                  transition-colors
                `}
              >
                Continuar
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Escolha a data</h2>
            <div className="flex overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex space-x-2">
                {dates.map(date => (
                  <button
                    key={date.full}
                    onClick={() => handleDateSelect(date.full)}
                    className={`
                      flex flex-col items-center p-3 min-w-[70px] rounded-lg border
                      ${selectedDate === date.full
                        ? 'bg-[#9b87f5] bg-opacity-20 border-[#9b87f5]' 
                        : 'bg-[#403E43] border-transparent hover:border-[#9b87f5]'}
                      transition-colors
                    `}
                  >
                    <span className="text-xs text-gray-300 uppercase">{date.weekday}</span>
                    <span className="text-xl font-bold">{date.day}</span>
                    <span className="text-xs text-gray-300">{date.month}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Escolha o horário</h2>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-3">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`
                      py-2 px-4 rounded-lg border
                      ${selectedTime === time
                        ? 'bg-[#9b87f5] bg-opacity-20 border-[#9b87f5]' 
                        : 'bg-[#403E43] border-transparent hover:border-[#9b87f5]'}
                      transition-colors
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-center py-4">Selecione uma data para ver os horários disponíveis</p>
            )}
            
            <div className="mt-8 flex space-x-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 text-center bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
              >
                Voltar
              </button>
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={nextStep}
                className={`
                  flex-1 py-3 text-center rounded-lg
                  ${(selectedDate && selectedTime)
                    ? 'bg-[#9b87f5] hover:bg-[#8B5CF6]' 
                    : 'bg-[#403E43] text-gray-400 cursor-not-allowed'}
                  transition-colors
                `}
              >
                Revisar
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Confirme seu agendamento</h2>
            
            <div className="bg-[#403E43] rounded-lg p-4 mb-4">
              <h3 className="font-medium text-lg">{selectedService.name}</h3>
              <p className="text-gray-300">{selectedService.duration} min • R$ {selectedService.price.toFixed(2)}</p>
            </div>
            
            <div className="bg-[#403E43] rounded-lg p-4 mb-4 flex items-center">
              <img
                src={selectedBarber.image}
                alt={selectedBarber.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-medium">{selectedBarber.name}</h3>
                <p className="text-gray-300">{selectedBarber.specialty}</p>
              </div>
            </div>
            
            <div className="bg-[#403E43] rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="mr-2 text-[#9b87f5]" />
                <span>
                  {new Date(selectedDate).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-[#9b87f5]" />
                <span>{selectedTime}</span>
              </div>
            </div>
            
            <div className="mt-8 flex space-x-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 text-center bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 py-3 text-center bg-[#9b87f5] rounded-lg hover:bg-[#8B5CF6] transition-colors"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Header */}
      <header className="bg-[#1A1F2C] px-4 py-6 flex items-center border-b border-[#403E43]">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Agendar Serviço</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full
                ${step >= stepNum ? 'bg-[#9b87f5]' : 'bg-[#403E43]'} 
                ${step === stepNum ? 'ring-2 ring-[#9b87f5] ring-offset-2 ring-offset-[#1A1F2C]' : ''}
              `}>
                {step > stepNum ? (
                  <Check size={16} />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              {stepNum < 4 && (
                <div className={`
                  h-1 w-12 mx-1
                  ${step > stepNum ? 'bg-[#9b87f5]' : 'bg-[#403E43]'}
                `}></div>
              )}
            </div>
          ))}
        </div>
        
        {renderStepContent()}
      </main>
    </div>
  );
};

export default BookingPage;
