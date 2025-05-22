
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'Ricardo Almeida',
    email: 'ricardo@email.com',
    phone: '(11) 99999-8888',
    photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  const saveChanges = () => {
    setUser(editedUser);
    setIsEditing(false);
    
    // Here you would make an API call to update the user profile
    // Example:
    // fetch('/api/users/profile', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(editedUser)
    // })
    //   .then(response => response.json())
    //   .then(data => console.log('Success:', data))
    //   .catch(error => console.error('Error:', error));
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Header */}
      <header className="bg-[#1A1F2C] px-4 py-6 flex items-center border-b border-[#403E43]">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Meu Perfil</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
            <img 
              src={user.photo} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-300">{user.email}</p>
        </div>

        {isEditing ? (
          <div className="bg-[#403E43] rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Editar Perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Nome</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editedUser.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#2A2A2E] border border-[#6E59A5] text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editedUser.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#2A2A2E] border border-[#6E59A5] text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Telefone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={editedUser.phone}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#2A2A2E] border border-[#6E59A5] text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">URL da Foto</label>
                <input 
                  type="text" 
                  name="photo" 
                  value={editedUser.photo}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#2A2A2E] border border-[#6E59A5] text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser({...user});
                  }}
                  className="py-2 px-4 bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={saveChanges}
                  className="py-2 px-4 bg-[#9b87f5] text-white rounded-lg hover:bg-[#8B5CF6] transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#403E43] rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Informações Pessoais</h3>
              <button 
                onClick={() => setIsEditing(true)}
                className="py-1 px-3 text-sm bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors"
              >
                Editar
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300">Nome</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-300">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-300">Telefone</p>
                <p className="text-white font-medium">{user.phone}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <button className="w-full py-3 bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors">
            Histórico de Pagamentos
          </button>
          <button className="w-full py-3 bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors">
            Métodos de Pagamento
          </button>
          <button className="w-full py-3 bg-transparent border border-[#9b87f5] text-[#9b87f5] rounded-lg hover:bg-[#9b87f5] hover:bg-opacity-10 transition-colors">
            Notificações
          </button>
          <button className="w-full py-3 bg-transparent border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors">
            Sair da Conta
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
