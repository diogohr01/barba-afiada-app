
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

const BusinessHeader = () => {
  const openMap = () => {
    // Open Google Maps with the business address
    const encodedAddress = encodeURIComponent(APP_CONFIG.BUSINESS_ADDRESS);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const openWhatsApp = () => {
    // Open WhatsApp with the business number
    window.open(`https://wa.me/${APP_CONFIG.BUSINESS_WHATSAPP}`, '_blank');
  };

  return (
    <div className="bg-[#1A1F2C] overflow-hidden">
      <div className="relative h-48 md:h-64">
        <img 
          src="/images/barbershop-header.jpg" 
          alt={APP_CONFIG.BUSINESS_NAME} 
          className="w-full h-full object-cover brightness-75"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1621605815971-fbc98d665033";
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] via-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-[#403E43] rounded-lg p-4 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#9b87f5]">{APP_CONFIG.BUSINESS_NAME}</h1>
              <div 
                className="flex items-center mt-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                onClick={openMap}
              >
                <MapPin size={16} className="mr-2 text-[#9b87f5]" />
                <span>{APP_CONFIG.BUSINESS_ADDRESS}</span>
                <ExternalLink size={14} className="ml-1" />
              </div>
            </div>
            
            <div 
              className="mt-3 md:mt-0 flex items-center cursor-pointer hover:text-white transition-colors text-gray-300"
              onClick={openWhatsApp}
            >
              <Phone size={16} className="mr-2 text-[#9b87f5]" />
              <span>{APP_CONFIG.BUSINESS_PHONE}</span>
              <ExternalLink size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;
