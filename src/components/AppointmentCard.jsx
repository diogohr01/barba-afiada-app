
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Calendar, Clock, User } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { formatDateFull, formatTime } from '../utils/dateUtils';
import { api } from '../utils/api';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AppointmentCard = ({ appointment }) => {
  const isPast = new Date(appointment.date) < new Date();
  const statusColors = {
    completed: 'bg-green-500',
    upcoming: 'bg-[#9b87f5]',
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
        // Em um app real, isto seria uma API call
        // await api.put(`/appointments/${appointment.id}/cancel`);
        
        // Mock da resposta de sucesso
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({
          title: "Agendamento cancelado",
          description: "Seu agendamento foi cancelado com sucesso.",
          variant: "default",
        });
      } catch (error) {
        console.error('Error canceling appointment:', error);
        toast({
          title: "Erro",
          description: error.message || "Não foi possível cancelar o agendamento.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-[#403E43] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow appointment-card animate-fade-in">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-white">{appointment.service}</h3>
              <span className={`ml-3 px-3 py-1 text-xs rounded-full ${statusColors[appointment.status]} text-white font-medium`}>
                {getStatusLabel()}
              </span>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center text-gray-300">
                <Calendar size={18} className="mr-3 text-[#9b87f5]" />
                <span className="text-white">
                  {formatDateFull(appointment.date)}
                </span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <Clock size={18} className="mr-3 text-[#9b87f5]" />
                <span className="text-white">{formatTime(appointment.time)}</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <User size={18} className="mr-3 text-[#9b87f5]" />
                <span className="text-white font-medium">{appointment.barberName}</span>
              </div>
              
              <p className="flex items-center">
                <span className="text-gray-300 mr-2">Valor:</span>
                <span className="text-white font-medium">R$ {appointment.price.toFixed(2)}</span>
              </p>
            </div>
          </div>
          
          {appointment.status === 'completed' && (
            <div className="bg-green-500 p-2 rounded-full">
              <Check size={18} />
            </div>
          )}
        </div>
        
        {appointment.notes && (
          <Alert className="mt-4 bg-[#32303A] border-[#6E59A5]">
            <AlertTitle>Observações:</AlertTitle>
            <AlertDescription>{appointment.notes}</AlertDescription>
          </Alert>
        )}
        
        <div className="mt-5 flex justify-end space-x-3">
          <Link 
            to={`/appointment/${appointment.id}`}
            className="py-2 px-4 text-sm bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
          >
            Ver Detalhes
          </Link>
          
          {!isPast && appointment.status === 'upcoming' && (
            <button 
              onClick={handleCancel}
              className="py-2 px-4 text-sm bg-transparent border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors flex items-center"
            >
              <X size={16} className="mr-2" />
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
