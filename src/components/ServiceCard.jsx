
import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Clock } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

const ServiceCard = ({ service }) => {
  const themeColors = APP_CONFIG.THEME;

  return (
    <div className="bg-[var(--card_background)] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow service-card animate-fade-in">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white">{service.name}</h3>
            <div className="flex items-center mt-2 text-gray-300">
              <Clock size={16} className={`mr-2 text-[${themeColors.PRIMARY}]`} />
              <span className="mr-3">{service.duration} min</span>
              {service.popular && (
                <span className={`bg-[${themeColors.TERTIARY}] text-white text-xs px-3 py-1 rounded-full`}>
                  Popular
                </span>
              )}
            </div>
            <p className="text-gray-300 mt-3">{service.description}</p>
          </div>
          <div className={`bg-[${themeColors.TERTIARY}] p-3 rounded-full`}>
            <Scissors size={20} />
          </div>
        </div>
        <div className="mt-5 flex justify-between items-center">
          <span className="text-xl font-bold text-white">R$ {service.price.toFixed(2)}</span>
          <Link 
            to={`/booking?service=${service.id}`}
            className={`py-2 px-5 bg-[${themeColors.PRIMARY}] text-white rounded-lg hover:bg-[${themeColors.PRIMARY_HOVER}] transition-colors`}
          >
            Agendar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
