import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { mockBarbers, mockServices, mockAppointments, apiService } from '../data/mockData';
import { toast } from "@/hooks/use-toast";
import { isTimeSlotAvailable, generateAvailableTimeSlots } from '../utils/appointmentUtils';
import { formatDateFull, generateDateRange, isPastDate } from '../utils/dateUtils';
import { api } from '../utils/api';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Gerar datas para os próximos 14 dias usando a utilidade
  const dates = generateDateRange(14);
  
  useEffect(() => {
    // Se houver parametros, pré-selecionar barbeiro e serviço
    const initializeSelections = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Se barberId for fornecido na URL, pré-selecionar esse barbeiro
        if (barberId) {
          const barber = mockBarbers.find(b => b.id === parseInt(barberId));
          if (barber) {
            setSelectedBarber(barber);
            // Se o barbeiro for pré-selecionado, vá direto para a seleção de serviço
            setStep(1);
          }
        }
        
        // Se serviceId for fornecido na URL, pré-selecionar esse serviço
        if (serviceId) {
          const service = mockServices.find(s => s.id === parseInt(serviceId));
          if (service) {
            setSelectedService(service);
            // Se o serviço for pré-selecionado, vá para seleção do barbeiro (se não estiver já selecionado)
            if (!barberId) setStep(2);
          }
        }
        
        // Se ambos barbeiro e serviço estiverem selecionados, vá para seleção de data
        if (barberId && serviceId) {
          setStep(3);
        }
        
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setError("Não foi possível carregar as informações iniciais. Por favor, tente novamente.");
        toast({
          title: "Erro",
          description: "Não foi possível carregar as informações iniciais.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    initializeSelections();
  }, [barberId, serviceId]);
  
  // Quando a data é selecionada, buscar horários disponíveis
  useEffect(() => {
    if (selectedBarber && selectedDate) {
      const fetchTimes = async () => {
        setLoading(true);
        try {
          // Em um app real, isso seria uma chamada de API
          // const times = await api.get(`/barbers/${selectedBarber.id}/available-times?date=${selectedDate}`);
          
          // Usando nossa função utilitária para gerar horários e verificar disponibilidade
          const times = generateAvailableTimeSlots(
            selectedBarber.id,
            selectedDate,
            mockAppointments,
            { start: '09:00', end: '19:00' },
            30 // duração do agendamento em minutos
          );
          
          setAvailableTimes(times);
          setSelectedTime(''); // Resetar o horário selecionado
        } catch (error) {
          console.error("Erro ao buscar horários disponíveis:", error);
          toast({
            title: "Erro",
            description: "Não foi possível buscar horários disponíveis.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchTimes();
    }
  }, [selectedBarber, selectedDate]);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };
  
  const handleTimeSelect = (time) => {
    // Verificar novamente a disponibilidade do horário antes de selecionar
    if (isTimeSlotAvailable(selectedBarber.id, selectedDate, time, mockAppointments)) {
      setSelectedTime(time);
    } else {
      toast({
        title: "Horário indisponível",
        description: "Este horário já foi reservado. Por favor, escolha outro.",
        variant: "destructive"
      });
    }
  };
  
  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };
  
  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    // Se mudar o barbeiro, resetar a data e horário
    setSelectedDate('');
    setSelectedTime('');
  };
  
  const nextStep = () => {
    // Validar antes de avançar
    switch (step) {
      case 1:
        if (!selectedService) {
          toast({
            title: "Selecione um serviço",
            description: "Por favor, selecione um serviço antes de continuar.",
            variant: "destructive"
          });
          return;
        }
        break;
      case 2:
        if (!selectedBarber) {
          toast({
            title: "Selecione um barbeiro",
            description: "Por favor, selecione um barbeiro antes de continuar.",
            variant: "destructive"
          });
          return;
        }
        break;
      case 3:
        if (!selectedDate || !selectedTime) {
          toast({
            title: "Selecione data e horário",
            description: "Por favor, selecione uma data e horário antes de continuar.",
            variant: "destructive"
          });
          return;
        }
        break;
      default:
        break;
    }
    
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const handleBooking = async () => {
    setLoading(true);
    
    try {
      // Verificar novamente a disponibilidade antes de confirmar
      const isAvailable = isTimeSlotAvailable(
        selectedBarber.id, 
        selectedDate, 
        selectedTime,
        mockAppointments
      );
      
      if (!isAvailable) {
        toast({
          title: "Horário indisponível",
          description: "Este horário já foi reservado. Por favor, escolha outro.",
          variant: "destructive"
        });
        setStep(3); // Voltar para seleção de data/hora
        return;
      }
      
      // Criar objeto de agendamento
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
      
      // Em um app real, isso seria enviado para o backend
      // const newAppointment = await api.post('/appointments', appointmentData);
      const newAppointment = await apiService.createAppointment(appointmentData);
      console.log('Appointment created:', newAppointment);
      
      // Navegação para página de confirmação
      toast({
        title: "Agendamento confirmado!",
        description: "Seu agendamento foi realizado com sucesso.",
      });
      navigate(`/confirmation/${newAppointment.id}`);
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível concluir o agendamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar conteúdo baseado no passo atual
  const renderStepContent = () => {
    if (loading && step !== 3) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b87f5]"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="py-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 primary-button"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
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
                    <div className="flex items-center">
                      <p className="font-medium text-left">{service.name}</p>
                      {service.popular && (
                        <span className="ml-2 bg-[#6E59A5] text-white text-xs px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
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
          <div className="animate-fade-in">
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
                    loading="lazy"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{barber.name}</p>
                    <p className="text-sm text-gray-300">{barber.specialty}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill={i < barber.rating ? "#FFD700" : "none"} 
                          stroke="#FFD700" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="mr-0.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-300 ml-1">({barber.reviewCount})</span>
                    </div>
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
          <div className="animate-fade-in">
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
                      ${date.isToday ? 'ring-2 ring-[#9b87f5]' : ''}
                      transition-colors
                    `}
                  >
                    <span className="text-xs text-gray-300 uppercase">{date.weekday}</span>
                    <span className="text-xl font-bold">{date.day}</span>
                    <span className="text-xs text-gray-300">{date.month}</span>
                    {date.isToday && <span className="text-xs text-[#9b87f5]">Hoje</span>}
                  </button>
                ))}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Escolha o horário</h2>
            {selectedDate ? (
              <>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9b87f5]"></div>
                  </div>
                ) : (
                  <>
                    {availableTimes.length > 0 ? (
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
                      <div className="text-center py-8 bg-[#403E43] rounded-lg">
                        <p className="text-gray-300">Não há horários disponíveis para esta data.</p>
                        <p className="text-gray-300 mt-2">Por favor, selecione outra data.</p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <p className="text-gray-300 text-center py-8 bg-[#403E43] rounded-lg">
                Selecione uma data para ver os horários disponíveis
              </p>
            )}
            
            <div className="mt-8 flex space-x-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 text-center bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
              >
                Voltar
              </button>
              <button
                disabled={!selectedDate || !selectedTime || loading}
                onClick={nextStep}
                className={`
                  flex-1 py-3 text-center rounded-lg
                  ${(selectedDate && selectedTime && !loading)
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
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Confirme seu agendamento</h2>
            
            <div className="bg-[#403E43] rounded-lg p-4 mb-4">
              <h3 className="font-medium text-lg">{selectedService.name}</h3>
              <p className="text-gray-300">{selectedService.duration} min • R$ {selectedService.price.toFixed(2)}</p>
              {selectedService.description && (
                <p className="text-gray-300 mt-2 text-sm">{selectedService.description}</p>
              )}
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
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill={i < selectedBarber.rating ? "#FFD700" : "none"} 
                      stroke="#FFD700" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-0.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-[#403E43] rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="mr-2 text-[#9b87f5]" />
                <span>
                  {formatDateFull(selectedDate)}
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
                disabled={loading}
                className={`
                  flex-1 py-3 text-center bg-[#9b87f5] rounded-lg hover:bg-[#8B5CF6] transition-colors
                  ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processando...
                  </div>
                ) : 'Confirmar Agendamento'}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="page-container bg-[#1A1F2C] min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#1A1F2C] px-5 py-6 flex items-center border-b border-[#403E43] sticky top-0 z-10">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Agendar Serviço</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-5 py-6 flex-1">
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`
                flex items-center justify-center w-9 h-9 rounded-full
                ${step >= stepNum ? 'bg-[#9b87f5]' : 'bg-[#403E43]'} 
                ${step === stepNum ? 'ring-2 ring-[#9b87f5] ring-offset-2 ring-offset-[#1A1F2C]' : ''}
                transition-colors
              `}>
                {step > stepNum ? (
                  <Check size={16} />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              {stepNum < 4 && (
                <div className={`
                  h-1 w-12 md:w-16 mx-1
                  ${step > stepNum ? 'bg-[#9b87f5]' : 'bg-[#403E43]'}
                  transition-colors
                `}></div>
              )}
            </div>
          ))}
        </div>
        
        {renderStepContent()}
      </main>

      {/* Botão de Agendar Fixo */}
      <div className="fixed bottom-24 right-6 z-10">
        <Link 
          to="/booking" 
          className="flex items-center justify-center w-14 h-14 bg-[#8B5CF6] rounded-full shadow-lg hover:bg-[#7E69AB] transition-colors"
          aria-label="Agendar"
        >
          <Calendar size={22} />
        </Link>
      </div>

      {/* Navigation Bar */}
      <nav className="footer-navigation bg-[#1A1F2C] border-t border-[#403E43] py-4 sticky bottom-0 z-10">
        <div className="container mx-auto flex justify-around">
          <Link to="/" className="flex flex-col items-center text-gray-400 hover:text-[#9b87f5] transition-colors">
            <Calendar size={24} />
            <span className="text-xs mt-1">Início</span>
          </Link>
          <Link to="/booking" className="flex flex-col items-center text-[#9b87f5]">
            <Calendar size={24} />
            <span className="text-xs mt-1">Agendar</span>
          </Link>
          <Link to="/appointments" className="flex flex-col items-center text-gray-400 hover:text-[#9b87f5] transition-colors">
            <Clock size={24} />
            <span className="text-xs mt-1">Histórico</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-gray-400 hover:text-[#9b87f5] transition-colors">
            <User size={24} />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default BookingPage;
