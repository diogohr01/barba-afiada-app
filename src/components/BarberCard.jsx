
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star } from 'lucide-react';

const BarberCard = ({ barber }) => {
  return (
    <div className="bg-[#403E43] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow barber-card animate-fade-in">
      <div className="relative">
        <img 
          src={barber.image} 
          alt={barber.name} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {barber.isAvailable && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Disponível Hoje
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white">{barber.name}</h3>
        <p className="text-gray-300 mt-1">{barber.specialty}</p>
        
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className="mr-1" 
              fill={i < barber.rating ? "#FFD700" : "none"} 
              stroke="#FFD700" 
            />
          ))}
          <span className="text-gray-300 ml-1">({barber.reviewCount})</span>
        </div>
        
        {barber.nextAvailable && (
          <p className="text-gray-300 mt-2 text-sm">
            Próximo horário: <span className="text-white">{barber.nextAvailable}</span>
          </p>
        )}
        
        <Link 
          to={`/booking/${barber.id}`}
          className="mt-4 flex items-center justify-center w-full py-2 bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors"
        >
          <Calendar size={16} className="mr-2" />
          Agendar
        </Link>
      </div>
    </div>
  );
};

export default BarberCard;
