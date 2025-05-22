
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import AppointmentCard from '../components/AppointmentCard';
import { mockAppointments } from '../data/mockData';
import { formatFriendlyDate } from '../utils/dateUtils';

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState({
    upcoming: [],
    past: []
  });
  
  useEffect(() => {
    // In a real app, you would fetch appointments from your API
    // Example: 
    // fetch('/api/appointments')
    //   .then(response => response.json())
    //   .then(data => {
    //     const now = new Date();
    //     const upcoming = data.filter(appointment => new Date(appointment.date) >= now && appointment.status !== 'canceled');
    //     const past = data.filter(appointment => new Date(appointment.date) < now || appointment.status === 'canceled');
    //     setAppointments({ upcoming, past });
    //   })
    //   .catch(error => console.error('Error fetching appointments:', error));
    
    // For now, we'll use the mock data
    const now = new Date();
    const upcoming = mockAppointments.filter(
      appointment => new Date(appointment.date) >= now && appointment.status !== 'canceled'
    );
    const past = mockAppointments.filter(
      appointment => new Date(appointment.date) < now || appointment.status === 'canceled'
    );
    setAppointments({ upcoming, past });
  }, []);
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Header */}
      <header className="bg-[#1A1F2C] px-4 py-6 flex items-center border-b border-[#403E43]">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Meus Agendamentos</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex bg-[#403E43] rounded-lg mb-6 overflow-hidden">
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'upcoming' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Próximos
          </button>
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'past' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('past')}
          >
            Histórico
          </button>
        </div>
        
        {/* Display date heading for upcoming appointments */}
        {activeTab === 'upcoming' && appointments.upcoming.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-300">
              {appointments.upcoming.length} {appointments.upcoming.length === 1 ? 'agendamento' : 'agendamentos'} próximo{appointments.upcoming.length !== 1 && 's'}
            </h2>
          </div>
        )}
        
        {/* Appointments List */}
        <div className="space-y-4">
          {activeTab === 'upcoming' && appointments.upcoming.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-300 mb-4">Você não tem agendamentos próximos.</p>
              <Link 
                to="/booking" 
                className="py-2 px-4 bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors"
              >
                Agendar Serviço
              </Link>
            </div>
          )}
          
          {activeTab === 'past' && appointments.past.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-300">Você não tem agendamentos anteriores.</p>
            </div>
          )}
          
          {/* Group appointments by date for better organization */}
          {activeTab === 'upcoming' && appointments.upcoming.length > 0 && (
            <>
              {/* Group appointments by date and display them */}
              {Object.entries(
                appointments.upcoming.reduce((acc, appointment) => {
                  const date = appointment.date;
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(appointment);
                  return acc;
                }, {})
              ).map(([date, dateAppointments]) => (
                <div key={date} className="mb-8">
                  <h3 className="text-md font-medium text-[#9b87f5] mb-3">{formatFriendlyDate(date)}</h3>
                  <div className="space-y-4">
                    {dateAppointments.map(appointment => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
          
          {activeTab === 'past' && appointments.past.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
        
        {/* Book Now Button (only on upcoming tab when no appointments) */}
        {activeTab === 'upcoming' && appointments.upcoming.length === 0 && (
          <div className="fixed bottom-8 right-8">
            <Link 
              to="/booking" 
              className="flex items-center justify-center w-16 h-16 bg-[#8B5CF6] rounded-full shadow-lg hover:bg-[#7E69AB] transition-colors"
            >
              <Calendar size={24} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppointmentsPage;
