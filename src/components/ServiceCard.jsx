
import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-[#403E43] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow service-card animate-fade-in">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white">{service.name}</h3>
            <div className="flex items-center mt-1 text-gray-300">
              <span className="mr-3">{service.duration} min</span>
              {service.popular && (
                <span className="bg-[#6E59A5] text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <p className="text-gray-300 mt-2">{service.description}</p>
          </div>
          <div className="bg-[#6E59A5] p-3 rounded-full">
            <Scissors size={20} />
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-white">R$ {service.price.toFixed(2)}</span>
          <Link 
            to={`/booking?service=${service.id}`}
            className="py-2 px-4 bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors"
          >
            Agendar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
