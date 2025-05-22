
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BarberCard from '../components/BarberCard';
import ServiceCard from '../components/ServiceCard';
import AppointmentCard from '../components/AppointmentCard';
import { mockBarbers, mockServices, mockAppointments } from '../data/mockData';
import { Check, Calendar, Clock, Scissors } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('barbers');
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);

  useEffect(() => {
    // Find the next upcoming appointment
    const upcoming = mockAppointments.find(appointment => 
      new Date(appointment.date) > new Date()
    );
    setUpcomingAppointment(upcoming);
    
    // Here you would fetch data from your API
    // Example:
    // fetch('your-api-url/barbers')
    //   .then(response => response.json())
    //   .then(data => setBarbers(data))
    //   .catch(error => console.error('Error fetching barbers:', error));
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Header */}
      <header className="bg-[#1A1F2C] px-4 py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#9b87f5]">BarberApp</h1>
          <Link to="/profile" className="p-2 rounded-full bg-[#8B5CF6] hover:bg-[#7E69AB] transition-colors">
            <span className="sr-only">Profile</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Upcoming Appointment Banner */}
        {upcomingAppointment && (
          <div className="mb-8 p-4 bg-[#6E59A5] rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Próximo Agendamento</h2>
                <p className="text-sm text-gray-200">
                  {new Date(upcomingAppointment.date).toLocaleDateString()} às {upcomingAppointment.time}
                </p>
                <p className="text-white font-medium">{upcomingAppointment.barberName}</p>
              </div>
              <Link 
                to={`/appointment/${upcomingAppointment.id}`}
                className="py-2 px-4 bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex bg-[#403E43] rounded-lg mb-6 overflow-hidden">
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'barbers' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('barbers')}
          >
            Barbeiros
          </button>
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'services' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('services')}
          >
            Serviços
          </button>
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'appointments' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('appointments')}
          >
            Histórico
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'barbers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockBarbers.map(barber => (
                <BarberCard key={barber.id} barber={barber} />
              ))}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {mockAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </div>

        {/* Book Appointment Button */}
        <div className="fixed bottom-8 right-8">
          <Link 
            to="/booking" 
            className="flex items-center justify-center w-16 h-16 bg-[#8B5CF6] rounded-full shadow-lg hover:bg-[#7E69AB] transition-colors"
          >
            <Calendar size={24} />
          </Link>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1F2C] border-t border-[#403E43] py-4">
        <div className="container mx-auto flex justify-around">
          <Link to="/" className="flex flex-col items-center text-[#9b87f5]">
            <Scissors size={24} />
            <span className="text-xs mt-1">Início</span>
          </Link>
          <Link to="/booking" className="flex flex-col items-center text-gray-400 hover:text-[#9b87f5]">
            <Calendar size={24} />
            <span className="text-xs mt-1">Agendar</span>
          </Link>
          <Link to="/appointments" className="flex flex-col items-center text-gray-400 hover:text-[#9b87f5]">
            <Clock size={24} />
            <span className="text-xs mt-1">Histórico</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-gray-400 hover:text-[#9b87f5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Index;
