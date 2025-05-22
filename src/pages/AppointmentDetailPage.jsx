
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Scissors, MapPin } from 'lucide-react';
import { mockAppointments, apiService } from '../data/mockData';

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch the appointment from your API
    // Example: fetch(`/api/appointments/${id}`).then(res => res.json()).then(data => setAppointment(data));
    
    // For now, we'll use the mock data
    setIsLoading(true);
    setTimeout(() => {
      const found = mockAppointments.find(a => a.id === parseInt(id));
      setAppointment(found);
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const handleCancelAppointment = async () => {
    // In a real app, you would call your API to cancel the appointment
    try {
      const updatedAppointment = await apiService.cancelAppointment(parseInt(id));
      setAppointment(updatedAppointment);
      setIsConfirmingCancel(false);
      
      // Show a success message to the user
      alert('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      // Show an error message to the user
      alert('Erro ao cancelar agendamento. Tente novamente.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#9b87f5] border-[#403E43] rounded-full animate-spin mb-4 mx-auto"></div>
          <p>Carregando informações do agendamento...</p>
        </div>
      </div>
    );
  }
  
  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] text-white">
        <header className="bg-[#1A1F2C] px-4 py-6 flex items-center border-b border-[#403E43]">
          <Link to="/" className="mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold">Detalhes do Agendamento</h1>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Agendamento não encontrado</h2>
            <p className="text-gray-300 mb-6">O agendamento que você procura não existe ou foi removido.</p>
            <Link 
              to="/appointments"
              className="inline-block py-2 px-4 bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors"
            >
              Ver Meus Agendamentos
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const isPast = new Date(appointment.date) < new Date();
  const isCancellable = !isPast && appointment.status === 'upcoming';
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Header */}
      <header className="bg-[#1A1F2C] px-4 py-6 flex items-center border-b border-[#403E43]">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Detalhes do Agendamento</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div 
          className={`
            mb-6 p-3 rounded-lg text-white text-center text-sm
            ${appointment.status === 'upcoming' ? 'bg-blue-500' : 
              appointment.status === 'completed' ? 'bg-green-500' : 
              'bg-red-500'}
          `}
        >
          {appointment.status === 'upcoming' ? 'Agendamento Confirmado' : 
           appointment.status === 'completed' ? 'Atendimento Concluído' : 
           'Agendamento Cancelado'}
        </div>
        
        <div className="bg-[#403E43] rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="space-y-6">
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
                      month: 'long', 
                      year: 'numeric'
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
                  <Link 
                    to="#"
                    className="text-[#9b87f5] text-sm hover:underline mt-1 inline-block"
                  >
                    Ver no Mapa
                  </Link>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#6E59A5] p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Valor</p>
                  <p className="font-medium">R$ {appointment.price.toFixed(2)}</p>
                  <p className="text-gray-300 text-sm">Pagamento na loja</p>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="flex items-start">
                  <div className="bg-[#6E59A5] p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Observações</p>
                    <p className="font-medium">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {appointment.status === 'completed' && (
          <div className="bg-[#403E43] rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Como foi sua experiência?</h3>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="mx-1 text-2xl">
                  &#9733;
                </button>
              ))}
            </div>
            <textarea 
              className="w-full bg-[#2A2A2E] text-white rounded-lg p-3 border border-[#6E59A5]"
              rows={3}
              placeholder="Deixe seu comentário (opcional)"
            ></textarea>
            <button className="mt-4 w-full py-2 bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors">
              Enviar Avaliação
            </button>
          </div>
        )}
        
        {isConfirmingCancel ? (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-2">Confirmar Cancelamento</h3>
            <p className="text-gray-300 mb-4">
              Tem certeza que deseja cancelar este agendamento? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsConfirmingCancel(false)}
                className="flex-1 py-2 bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {isCancellable && (
              <button
                onClick={() => setIsConfirmingCancel(true)}
                className="w-full py-3 bg-transparent border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors"
              >
                Cancelar Agendamento
              </button>
            )}
            
            <Link 
              to="/booking"
              className="block w-full py-3 text-center bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors"
            >
              Agendar Novo Serviço
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppointmentDetailPage;
