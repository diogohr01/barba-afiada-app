
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const BarberCard = ({ barber }) => {
  return (
    <div className="bg-[#403E43] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative">
        <img 
          src={barber.image} 
          alt={barber.name} 
          className="w-full h-48 object-cover"
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
            <svg 
              key={i}
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill={i < barber.rating ? "#FFD700" : "none"} 
              stroke="#FFD700" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-1"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="text-gray-300 ml-1">({barber.reviewCount})</span>
        </div>
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
