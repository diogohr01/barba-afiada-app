
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Calendar, Boxes, TrendingUp, ArrowRight } from 'lucide-react';
import { mockAppointments } from '../data/mockData';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

const FinancialReport = ({ barberId }) => {
  const [timeframe, setTimeframe] = useState('week');
  
  // Get date range based on timeframe
  const getDateRange = () => {
    const today = new Date();
    
    switch (timeframe) {
      case 'week':
        return {
          start: startOfWeek(today, { weekStartsOn: 1 }), // Start on Monday
          end: endOfWeek(today, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(today),
          end: endOfMonth(today)
        };
      case 'year':
        return {
          start: startOfYear(today),
          end: endOfYear(today)
        };
      default:
        return {
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 })
        };
    }
  };
  
  // Filter appointments based on timeframe and barber
  const filterAppointments = () => {
    const { start, end } = getDateRange();
    
    return mockAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const isInDateRange = isWithinInterval(appointmentDate, { start, end });
      const isForBarber = !barberId || appointment.barberId === barberId;
      const isCompleted = appointment.status === 'completed';
      
      return isInDateRange && isForBarber && isCompleted;
    });
  };
  
  // Calculate financial metrics
  const getFinancialMetrics = () => {
    const filteredAppointments = filterAppointments();
    
    // Total revenue
    const totalRevenue = filteredAppointments.reduce(
      (sum, appointment) => sum + appointment.price,
      0
    );
    
    // Services count
    const servicesCount = filteredAppointments.length;
    
    // Average ticket
    const averageTicket = servicesCount > 0 ? totalRevenue / servicesCount : 0;
    
    // Revenue by service type
    const revenueByService = filteredAppointments.reduce((acc, appointment) => {
      const serviceType = appointment.service;
      if (!acc[serviceType]) {
        acc[serviceType] = {
          name: serviceType,
          value: 0,
          count: 0
        };
      }
      acc[serviceType].value += appointment.price;
      acc[serviceType].count += 1;
      return acc;
    }, {});
    
    // Convert to array and sort by value
    const serviceRevenueData = Object.values(revenueByService).sort(
      (a, b) => b.value - a.value
    );
    
    // Daily revenue (for bar chart)
    const dailyRevenue = filteredAppointments.reduce((acc, appointment) => {
      const date = appointment.date;
      const formattedDate = timeframe === 'year' 
        ? format(new Date(date), 'MMM') 
        : format(new Date(date), 'dd/MM');
      
      if (!acc[formattedDate]) {
        acc[formattedDate] = {
          date: formattedDate,
          revenue: 0
        };
      }
      acc[formattedDate].revenue += appointment.price;
      return acc;
    }, {});
    
    // Convert to array and sort by date
    const dailyRevenueData = Object.values(dailyRevenue).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    
    return {
      totalRevenue,
      servicesCount,
      averageTicket,
      serviceRevenueData,
      dailyRevenueData
    };
  };
  
  const { 
    totalRevenue, 
    servicesCount, 
    averageTicket,
    serviceRevenueData,
    dailyRevenueData
  } = getFinancialMetrics();
  
  // Colors for the pie chart
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#8B5CF6', '#D6BCFA'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Relatório Financeiro</h2>
        <div className="flex bg-[#403E43] rounded-lg overflow-hidden">
          <button 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'week' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setTimeframe('week')}
          >
            Semana
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'month' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setTimeframe('month')}
          >
            Mês
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'year' ? 'bg-[#9b87f5] text-white' : 'text-gray-300'}`}
            onClick={() => setTimeframe('year')}
          >
            Ano
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#403E43] p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp size={20} className="text-[#9b87f5] mr-2" />
            <h3 className="text-gray-300 text-sm">Faturamento Total</h3>
          </div>
          <p className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-[#403E43] p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar size={20} className="text-[#9b87f5] mr-2" />
            <h3 className="text-gray-300 text-sm">Serviços Realizados</h3>
          </div>
          <p className="text-2xl font-bold text-white">{servicesCount}</p>
        </div>
        
        <div className="bg-[#403E43] p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Boxes size={20} className="text-[#9b87f5] mr-2" />
            <h3 className="text-gray-300 text-sm">Ticket Médio</h3>
          </div>
          <p className="text-2xl font-bold text-white">R$ {averageTicket.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="space-y-6">
        {/* Revenue Over Time Chart */}
        <div className="bg-[#403E43] p-4 rounded-lg">
          <h3 className="text-white font-medium mb-4">Faturamento por Período</h3>
          <div className="h-64">
            {dailyRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyRevenueData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" vertical={false} />
                  <XAxis dataKey="date" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#32303A', border: 'none', borderRadius: '8px' }}
                    formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Faturamento']}
                  />
                  <Bar dataKey="revenue" name="Faturamento" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400">Sem dados para o período selecionado</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Services Breakdown Chart */}
        <div className="bg-[#403E43] p-4 rounded-lg">
          <h3 className="text-white font-medium mb-4">Distribuição por Serviços</h3>
          <div className="h-64">
            {serviceRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceRevenueData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#32303A', border: 'none', borderRadius: '8px' }}
                    formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400">Sem dados para o período selecionado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
