
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, Clock } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

const BarberCard = ({ barber }) => {
  const themeColors = APP_CONFIG.THEME;
  
  return (
    <div className="bg-[var(--card_background)] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow barber-card animate-fade-in">
      <div className="relative">
        <img 
          src={barber.image} 
          alt={barber.name} 
          className="w-full h-52 object-cover"
          loading="lazy"
        />
        {barber.isAvailable && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            Disponível Hoje
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white">{barber.name}</h3>
        <p className="text-gray-300 mt-1">{barber.specialty}</p>
        
        <div className="flex items-center mt-3">
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
          <p className="text-gray-300 mt-3 text-sm flex items-center">
            <Clock size={14} className={`mr-2 text-[${themeColors.PRIMARY}]`} />
            Próximo horário: <span className="text-white ml-1">{barber.nextAvailable}</span>
          </p>
        )}
        
        <Link 
          to={`/booking/${barber.id}`}
          className={`mt-4 flex items-center justify-center w-full py-3 px-4 bg-[${themeColors.PRIMARY}] text-white rounded-lg hover:bg-[${themeColors.PRIMARY_HOVER}] transition-colors`}
        >
          <Calendar size={16} className="mr-2" />
          Agendar
        </Link>
      </div>
    </div>
  );
};

export default BarberCard;
