
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Calendar, Clock, User } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const AppointmentCard = ({ appointment }) => {
  const isPast = new Date(appointment.date) < new Date();
  const statusColors = {
    completed: 'bg-green-500',
    upcoming: 'bg-blue-500',
    canceled: 'bg-red-500'
  };

  const getStatusLabel = () => {
    if (appointment.status === 'completed') return 'Concluído';
    if (appointment.status === 'upcoming') return 'Agendado';
    if (appointment.status === 'canceled') return 'Cancelado';
    return '';
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    // Modal confirmation could be added here
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        // In a real app, this would be an API call
        // await cancelAppointment(appointment.id);
        toast({
          title: "Agendamento cancelado",
          description: "Seu agendamento foi cancelado com sucesso.",
          variant: "default",
        });
      } catch (error) {
        console.error('Error canceling appointment:', error);
        toast({
          title: "Erro",
          description: "Não foi possível cancelar o agendamento.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-[#403E43] rounded-lg overflow-hidden shadow-md appointment-card animate-fade-in">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-white">{appointment.service}</h3>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusColors[appointment.status]} text-white`}>
                {getStatusLabel()}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center text-gray-300">
                <Calendar size={16} className="mr-2 text-[#9b87f5]" />
                <span>
                  {new Date(appointment.date).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock size={16} className="mr-2 text-[#9b87f5]" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center text-white">
                <User size={16} className="mr-2 text-[#9b87f5]" />
                <span>{appointment.barberName}</span>
              </div>
              <p className="text-white">
                <span className="text-gray-300">Valor: </span>
                R$ {appointment.price.toFixed(2)}
              </p>
            </div>
          </div>
          {appointment.status === 'completed' && (
            <div className="bg-green-500 p-2 rounded-full">
              <Check size={16} />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Link 
            to={`/appointment/${appointment.id}`}
            className="py-2 px-4 text-sm bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
          >
            Ver Detalhes
          </Link>
          {!isPast && appointment.status === 'upcoming' && (
            <button 
              onClick={handleCancel}
              className="py-2 px-4 text-sm bg-transparent border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors"
            >
              <X size={16} className="mr-1 inline" />
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
