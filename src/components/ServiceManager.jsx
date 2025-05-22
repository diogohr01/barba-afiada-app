
import React, { useState } from 'react';
import { Plus, Pencil, Trash, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiClient } from '../utils/apiClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockServices } from '../data/mockData';

const ServiceManager = () => {
  const [services, setServices] = useState(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    duration: '',
    popular: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const openCreateDialog = () => {
    setCurrentService({
      id: null,
      name: '',
      description: '',
      price: '',
      duration: '30',
      popular: false,
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (service) => {
    setCurrentService({
      ...service,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentService(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const serviceToSave = {
        ...currentService,
        price: parseFloat(currentService.price),
        duration: parseInt(currentService.duration),
      };
      
      // Validation
      if (!serviceToSave.name || !serviceToSave.price || !serviceToSave.duration) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // In a real app, this would be an API call
      // For mock, we'll just update the local state
      if (isEditing) {
        // Update existing service
        setServices(prev => 
          prev.map(s => s.id === serviceToSave.id ? serviceToSave : s)
        );
        
        // Example API call:
        // await apiClient.put(`/services/${serviceToSave.id}`, serviceToSave);
        
        toast({
          title: "Serviço atualizado",
          description: `O serviço ${serviceToSave.name} foi atualizado com sucesso.`,
        });
      } else {
        // Create new service
        const newId = Math.max(...services.map(s => s.id), 0) + 1;
        const newService = { ...serviceToSave, id: newId };
        
        setServices(prev => [...prev, newService]);
        
        // Example API call:
        // await apiClient.post('/services', serviceToSave);
        
        toast({
          title: "Serviço criado",
          description: `O serviço ${serviceToSave.name} foi criado com sucesso.`,
        });
      }
      
      // Close dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (service) => {
    if (!confirm(`Tem certeza que deseja excluir o serviço "${service.name}"?`)) {
      return;
    }
    
    try {
      // In a real app, this would be an API call
      // For mock, we'll just update the local state
      setServices(prev => prev.filter(s => s.id !== service.id));
      
      // Example API call:
      // await apiClient.delete(`/services/${service.id}`);
      
      toast({
        title: "Serviço excluído",
        description: `O serviço ${service.name} foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Gerenciar Serviços</h2>
        <Button 
          className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
          onClick={openCreateDialog}
        >
          <Plus size={16} className="mr-2" />
          Novo Serviço
        </Button>
      </div>
      
      {services.length === 0 ? (
        <div className="text-center py-8 bg-[#403E43] rounded-lg">
          <p className="text-gray-300">Nenhum serviço cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="bg-[#403E43] rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white">{service.name}</h3>
                <p className="text-sm text-gray-300">{service.description}</p>
                <div className="flex mt-1 text-sm">
                  <span className="text-[#9b87f5] font-medium">
                    R$ {service.price.toFixed(2)}
                  </span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-gray-300">
                    {service.duration} minutos
                  </span>
                  {service.popular && (
                    <span className="ml-2 bg-[#6E59A5] text-xs text-white px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(service)}
                  className="bg-transparent border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:bg-opacity-10"
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(service)}
                  className="bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10"
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Service Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#32303A] text-white border-[#6E59A5]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="text-white">Nome do serviço</Label>
              <Input
                id="name"
                name="name"
                value={currentService.name}
                onChange={handleInputChange}
                className="bg-[#403E43] border-[#6E59A5] text-white mt-1"
                placeholder="Ex: Corte de cabelo"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-white">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={currentService.description}
                onChange={handleInputChange}
                className="bg-[#403E43] border-[#6E59A5] text-white mt-1"
                placeholder="Ex: Corte moderno com máquina e tesoura"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-white">Preço (R$)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentService.price}
                  onChange={handleInputChange}
                  className="bg-[#403E43] border-[#6E59A5] text-white mt-1"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-white">Duração (minutos)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="5"
                  step="5"
                  value={currentService.duration}
                  onChange={handleInputChange}
                  className="bg-[#403E43] border-[#6E59A5] text-white mt-1"
                  placeholder="30"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="popular"
                name="popular"
                type="checkbox"
                checked={currentService.popular}
                onChange={handleInputChange}
                className="h-4 w-4 accent-[#9b87f5] bg-[#403E43]"
              />
              <Label htmlFor="popular" className="ml-2 text-white">
                Marcar como serviço popular
              </Label>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-transparent border-[#6E59A5] text-white hover:bg-[#6E59A5] hover:bg-opacity-10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManager;
