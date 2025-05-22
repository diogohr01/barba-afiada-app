
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Calendar, Clock, MapPin } from 'lucide-react';
import { mockAppointments } from '../data/mockData';

const ConfirmationPage = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch the appointment from your API
    // Example: fetch(`/api/appointments/${id}`).then(res => res.json()).then(data => setAppointment(data));
    
    // For now, we'll use the mock data
    const found = mockAppointments.find(a => a.id === parseInt(id));
    setAppointment(found || mockAppointments[0]); // Fallback to first appointment if not found
    
    // Simulate loading time with countdown
    const timer = setTimeout(() => {
      setCountdownCompleted(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#9b87f5] border-[#403E43] rounded-full animate-spin mb-4 mx-auto"></div>
          <p>Carregando informações do agendamento...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {!countdownCompleted ? (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 mb-6 rounded-full bg-[#9b87f5] flex items-center justify-center">
            <Check size={36} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Agendamento Confirmado!</h1>
          <p className="text-gray-300 text-center mb-8">
            Seu agendamento foi realizado com sucesso.
          </p>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-[#9b87f5] rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-[#9b87f5] rounded-full animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-[#9b87f5] rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-[#1A1F2C] px-4 py-6 border-b border-[#403E43]">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">Confirmação</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] p-1 rounded-lg mb-8">
              <div className="bg-[#1A1F2C] rounded-lg p-6 flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-[#9b87f5] flex items-center justify-center">
                  <Check size={28} />
                </div>
                <h2 className="text-xl font-bold mb-1">Agendamento Confirmado!</h2>
                <p className="text-gray-300 text-center">
                  Seu agendamento foi realizado com sucesso.
                </p>
              </div>
            </div>
            
            <div className="bg-[#403E43] rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Detalhes do Agendamento</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#6E59A5] p-2 rounded-full mr-4">
                    <Scissors size={20} />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Serviço</p>
                    <p className="font-medium">{appointment.service}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#6E59A5] p-2 rounded-full mr-4">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Data</p>
                    <p className="font-medium">
                      {new Date(appointment.date).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#6E59A5] p-2 rounded-full mr-4">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Horário</p>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#6E59A5] p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Profissional</p>
                    <p className="font-medium">{appointment.barberName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#6E59A5] p-2 rounded-full mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Local</p>
                    <p className="font-medium">Barbearia Premium</p>
                    <p className="text-gray-300 text-sm">Rua Exemplo, 123 - Centro</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#6E59A5] p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Valor</p>
                    <p className="font-medium">R$ {appointment.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between space-x-3 mt-8">
              <button 
                className="flex-1 py-3 bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
              >
                Adicionar ao Calendário
              </button>
              <Link 
                to="/appointments"
                className="flex-1 py-3 bg-[#9b87f5] text-center text-white rounded-lg hover:bg-[#8B5CF6] transition-colors"
              >
                Ver Meus Agendamentos
              </Link>
            </div>
            
            <Link 
              to="/"
              className="block mt-4 text-center text-gray-300 hover:text-white"
            >
              Voltar para a Página Inicial
            </Link>
          </main>
        </>
      )}
    </div>
  );
};

export default ConfirmationPage;
