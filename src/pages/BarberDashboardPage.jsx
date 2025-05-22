
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Settings, ClipboardCheck } from 'lucide-react';
import { mockAppointments, mockBarbers } from '../data/mockData';
import AppointmentCard from '../components/AppointmentCard';
import FinancialReport from '../components/FinancialReport';
import { isBusinessMode } from '../config/appConfig';
import { formatFriendlyDate, getCurrentDate } from '../utils/dateUtils';

const BarberDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  
  // In a real app, this would come from authentication state
  const barber = mockBarbers[0];
  
  // Filter appointments for the current barber and date
  const todaysAppointments = mockAppointments.filter(appointment => 
    appointment.barberId === barber.id && 
    appointment.date === currentDate &&
    appointment.status === 'upcoming'
  );
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white pb-20">
      {/* Header */}
      <header className="bg-[#1A1F2C] px-4 py-6 flex items-center border-b border-[#403E43]">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Painel do Barbeiro</h1>
          <p className="text-sm text-gray-300">Bem-vindo, {barber.name}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Summary Card */}
        <div className="bg-[#403E43] rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <img 
              src={barber.image} 
              alt={barber.name} 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-white">{barber.name}</h2>
              <p className="text-sm text-gray-300">{barber.specialty}</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-300">Agendamentos de Hoje</p>
              <p className="text-xl font-bold text-white">{todaysAppointments.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Data</p>
              <p className="text-xl font-bold text-white">{formatFriendlyDate(currentDate)}</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Link 
              to="/barber/services" 
              className="py-2 px-4 bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors inline-flex items-center"
            >
              <Settings size={16} className="mr-2" />
              Gerenciar Serviços
            </Link>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-[#403E43] rounded-lg mb-6 overflow-hidden">
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'appointments' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('appointments')}
          >
            <span className="flex items-center justify-center">
              <Calendar size={16} className="mr-2" />
              Agendamentos
            </span>
          </button>
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'financial' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setActiveTab('financial')}
          >
            <span className="flex items-center justify-center">
              <ClipboardCheck size={16} className="mr-2" />
              Financeiro
            </span>
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Agendamentos de Hoje</h3>
            {todaysAppointments.length === 0 ? (
              <div className="bg-[#403E43] rounded-lg p-8 text-center">
                <p className="text-gray-300 mb-2">Você não tem agendamentos para hoje.</p>
                <p className="text-sm text-gray-400">Aproveite para descansar ou atualizar seu perfil!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'financial' && (
          <FinancialReport barberId={barber.id} />
        )}
      </main>
    </div>
  );
};

export default BarberDashboardPage;
