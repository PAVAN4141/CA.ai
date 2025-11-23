
import React, { useState } from 'react';
import { Plus, Trash2, Users, Mail, Search } from 'lucide-react';
import { ClientDataEntry } from '../types';

interface ClientDataProps {
  clients: ClientDataEntry[];
  setClients: React.Dispatch<React.SetStateAction<ClientDataEntry[]>>;
}

const ClientData: React.FC<ClientDataProps> = ({ clients, setClients }) => {
  const [newClient, setNewClient] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (!newClient.name || !newClient.email) return;
    setClients([...clients, { ...newClient, id: Date.now().toString() }]);
    setNewClient({ name: '', email: '' });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    // Prevent event bubbling to row click (if any)
    e.stopPropagation();
    e.preventDefault();
    setClients(prevClients => prevClients.filter(c => c.id !== id));
  };

  const handleChange = (id: string, field: keyof ClientDataEntry, value: string) => {
    setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-2 space-y-4">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-50 p-3 rounded-lg">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Client Data Management</h2>
            <p className="text-sm text-slate-500">Maintain your central client database. Communication is linked to these emails.</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-1/3">Client Name</th>
                <th className="px-6 py-4 w-1/3">Email Address (Key Identifier)</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-3">
                    <input 
                      value={client.name} 
                      onChange={(e) => handleChange(client.id, 'name', e.target.value)}
                      className="bg-transparent w-full focus:outline-none focus:border-b focus:border-indigo-500 font-medium text-slate-900 py-1"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 text-slate-400 mr-2" />
                      <input 
                        value={client.email} 
                        onChange={(e) => handleChange(client.id, 'email', e.target.value)}
                        className="bg-transparent w-full focus:outline-none focus:border-b focus:border-indigo-500 font-mono text-slate-600 py-1"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button 
                      type="button"
                      onClick={(e) => handleDelete(client.id, e)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                      title="Delete Client"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Add New Row */}
              <tr className="bg-indigo-50/30 border-t-2 border-slate-100">
                <td className="px-6 py-4">
                  <input 
                    placeholder="New Client Name..."
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-3 py-2 w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    placeholder="client@email.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-3 py-2 w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    type="button"
                    onClick={handleAdd}
                    disabled={!newClient.name || !newClient.email}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center mx-auto text-xs font-medium"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Client
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientData;
