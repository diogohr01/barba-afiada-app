
import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

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

  return (
    <div className="bg-[#403E43] rounded-lg overflow-hidden shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-white">{appointment.service}</h3>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusColors[appointment.status]} text-white`}>
                {getStatusLabel()}
              </span>
            </div>
            <p className="text-gray-300 mt-1">
              {new Date(appointment.date).toLocaleDateString()} às {appointment.time}
            </p>
            <p className="text-white mt-1">
              <span className="text-gray-300">Barbeiro: </span>
              {appointment.barberName}
            </p>
            <p className="text-white mt-1">
              <span className="text-gray-300">Valor: </span>
              R$ {appointment.price.toFixed(2)}
            </p>
          </div>
          {appointment.status === 'completed' && (
            <div className="bg-green-500 p-2 rounded-full">
              <Check size={16} />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/appointment/${appointment.id}`}
            className="py-2 px-4 text-sm bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
          >
            Ver Detalhes
          </Link>
          {!isPast && appointment.status === 'upcoming' && (
            <button 
              className="ml-2 py-2 px-4 text-sm bg-transparent border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
