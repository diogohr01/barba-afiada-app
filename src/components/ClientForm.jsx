
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';

const ClientForm = ({ onComplete, serviceId, barberId, dateTime }) => {
  const [formData, setFormData] = useState({
    name: localStorage.getItem('client_name') || '',
    phone: localStorage.getItem('client_phone') || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validatePhone = (phone) => {
    // Simple validation for Brazilian phone numbers
    const phoneRegex = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
    return phoneRegex.test(phone);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu nome.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de telefone válido.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Save client information to localStorage for future use
      localStorage.setItem('client_name', formData.name);
      localStorage.setItem('client_phone', formData.phone);
      
      // For mock, we'll just simulate the API call
      // In a real app, this would be sent to the server
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation: 
      // await apiClient.post('/clients', formData);
      
      toast({
        title: "Sucesso",
        description: "Seus dados foram salvos com sucesso.",
      });
      
      // Call the onComplete function with the client data
      if (onComplete) {
        onComplete(formData);
      }
    } catch (error) {
      console.error('Error saving client data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name" className="text-white">Seu nome completo</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="bg-[#32303A] border-[#6E59A5] text-white mt-1"
          placeholder="Digite seu nome completo"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-white">Telefone (WhatsApp)</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="bg-[#32303A] border-[#6E59A5] text-white mt-1"
          placeholder="(00) 00000-0000"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="notes" className="text-white">Observações (opcional)</Label>
        <Input
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="bg-[#32303A] border-[#6E59A5] text-white mt-1"
          placeholder="Alguma observação sobre o serviço?"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] text-white" 
        disabled={loading}
      >
        {loading ? "Salvando..." : "Continuar"}
      </Button>
    </form>
  );
};

export default ClientForm;
