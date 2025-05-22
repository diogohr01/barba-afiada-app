
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BarberCard from '../components/BarberCard';
import ServiceCard from '../components/ServiceCard';
import AppointmentCard from '../components/AppointmentCard';
import BusinessHeader from '../components/BusinessHeader';
import ClientForm from '../components/ClientForm';
import { mockBarbers, mockServices, mockAppointments } from '../data/mockData';
import { Scissors, Calendar, Clock, User, Search, Bell } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { APP_CONFIG, isBusinessMode } from '../config/appConfig';

const Index = () => {
  const [activeTab, setActiveTab] = useState('barbers');
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Get the theme colors from the configuration
  const themeColors = APP_CONFIG.THEME;

  useEffect(() => {
    // Simular carregamento dos dados
    const loadData = async () => {
      try {
        setLoadingData(true);
        
        // Em um app real, estas seriam chamadas de API
        // const barbers = await fetchBarbers();
        // const appointments = await fetchAppointments();
        
        // Find the next upcoming appointment
        const upcoming = mockAppointments.find(appointment => 
          new Date(appointment.date) > new Date() && appointment.status === 'upcoming'
        );
        setUpcomingAppointment(upcoming);
        
        setTimeout(() => {
          setLoadingData(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoadingData(false);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
    
    // Check if user already has stored client info
    const hasClientInfo = localStorage.getItem('client_name') && localStorage.getItem('client_phone');
    setShowForm(!hasClientInfo);
  }, []);

  // Filtrar barbeiros e serviços baseado na busca
  const filteredBarbers = mockBarbers.filter(barber => 
    barber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    barber.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientFormComplete = (clientData) => {
    setShowForm(false);
    toast({
      title: "Bem-vindo!",
      description: `Olá ${clientData.name}, agora você pode fazer agendamentos facilmente.`,
    });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className={`bg-[${themeColors.BACKGROUND}] px-4 py-6 shadow-md sticky top-0 z-20`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className={`text-2xl font-bold text-[${themeColors.PRIMARY}]`}>{APP_CONFIG.APP_NAME}</h1>
          <div className="flex items-center space-x-3">
            <Link to="/notifications" className={`p-2 rounded-full bg-[${themeColors.CARD_BACKGROUND}] hover:bg-[${themeColors.TERTIARY}] transition-colors`}>
              <Bell size={20} />
            </Link>
            <Link to="/profile" className={`p-2 rounded-full bg-[${themeColors.TERTIARY}] hover:bg-[${themeColors.PRIMARY_HOVER}] transition-colors`}>
              <User size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Business Header with Location */}
      <BusinessHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Client Registration Form (if needed) */}
        {showForm && (
          <div className={`mb-8 p-6 bg-[${themeColors.CARD_BACKGROUND}] rounded-lg shadow-lg animate-fade-in`}>
            <h2 className="text-lg font-semibold mb-4">Complete seu perfil para continuar</h2>
            <ClientForm onComplete={handleClientFormComplete} />
          </div>
        )}
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar barbeiros ou serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-[${themeColors.CARD_BACKGROUND}] rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[${themeColors.PRIMARY}]`}
          />
        </div>

        {/* Upcoming Appointment Banner */}
        {!loadingData && upcomingAppointment && (
          <div className={`mb-8 p-4 bg-[${themeColors.TERTIARY}] rounded-lg shadow-lg animate-fade-in`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Próximo Agendamento</h2>
                <p className="text-sm text-gray-200">
                  {new Date(upcomingAppointment.date).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })} às {upcomingAppointment.time}
                </p>
                <p className="text-white font-medium">{upcomingAppointment.barberName}</p>
              </div>
              <Link 
                to={`/appointment/${upcomingAppointment.id}`}
                className={`py-2 px-4 bg-[${themeColors.PRIMARY}] text-white rounded-lg hover:bg-[${themeColors.PRIMARY_HOVER}] transition-colors`}
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className={`flex bg-[${themeColors.CARD_BACKGROUND}] rounded-lg mb-6 overflow-hidden`}>
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'barbers' ? `bg-[${themeColors.PRIMARY}] text-white` : 'text-gray-300'}`}
            onClick={() => setActiveTab('barbers')}
          >
            {isBusinessMode() ? 'Barbeiros' : 'Profissionais'}
          </button>
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'services' ? `bg-[${themeColors.PRIMARY}] text-white` : 'text-gray-300'}`}
            onClick={() => setActiveTab('services')}
          >
            Serviços
          </button>
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'appointments' ? `bg-[${themeColors.PRIMARY}] text-white` : 'text-gray-300'}`}
            onClick={() => setActiveTab('appointments')}
          >
            Histórico
          </button>
        </div>

        {/* Loading State */}
        {loadingData && (
          <div className="flex justify-center items-center py-12">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[${themeColors.PRIMARY}]`}></div>
          </div>
        )}

        {/* Tab Content */}
        {!loadingData && (
          <div className="mt-6">
            {activeTab === 'barbers' && (
              <>
                {filteredBarbers.length === 0 ? (
                  <p className="text-center py-8 text-gray-300">Nenhum profissional encontrado.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredBarbers.map(barber => (
                      <BarberCard key={barber.id} barber={barber} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'services' && (
              <>
                {filteredServices.length === 0 ? (
                  <p className="text-center py-8 text-gray-300">Nenhum serviço encontrado.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.map(service => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-4">
                {mockAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-300 mb-4">Você não tem agendamentos anteriores.</p>
                    <Link 
                      to="/booking" 
                      className="primary-button"
                    >
                      Agendar Serviço
                    </Link>
                  </div>
                ) : (
                  mockAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Book Appointment Button */}
        <div className="fixed bottom-20 right-8 floating-button">
          <Link 
            to="/booking" 
            className={`flex items-center justify-center w-16 h-16 bg-[${themeColors.PRIMARY_HOVER}] rounded-full shadow-lg hover:bg-[${themeColors.SECONDARY}] transition-colors z-50`}
            aria-label="Agendar"
          >
            <Calendar size={24} />
          </Link>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className={`footer-navigation bg-[${themeColors.BACKGROUND}] border-t border-[${themeColors.CARD_BACKGROUND}] py-4`}>
        <div className="container mx-auto flex justify-around">
          <Link to="/" className={`flex flex-col items-center text-[${themeColors.PRIMARY}]`}>
            <Scissors size={24} />
            <span className="text-xs mt-1">Início</span>
          </Link>
          <Link to="/booking" className="flex flex-col items-center text-gray-400 hover:text-[#9b87f5] transition-colors">
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

export default Index;
