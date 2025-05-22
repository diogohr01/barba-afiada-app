
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ServiceManager from '../components/ServiceManager';

const ServiceManagementPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white pb-20">
      {/* Header */}
      <header className="bg-[#1A1F2C] px-4 py-6 flex items-center border-b border-[#403E43]">
        <Link to="/barber/dashboard" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Gerenciar Serviços</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ServiceManager />
      </main>
    </div>
  );
};

export default ServiceManagementPage;
