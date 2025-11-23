import React, { useState } from 'react';
import { Plus, Trash2, Calendar, FileText, CheckCircle } from 'lucide-react';
import { TaxEntry } from '../types';

const TaxTracker: React.FC = () => {
  const [returns, setReturns] = useState<TaxEntry[]>([
    { id: '1', clientName: 'Sharma Traders', returnType: 'GSTR-1', dueDate: '2024-04-11', status: 'Filed' },
    { id: '2', clientName: 'Sharma Traders', returnType: 'GSTR-3B', dueDate: '2024-04-20', status: 'Not Started' },
    { id: '3', clientName: 'Innovate Pvt Ltd', returnType: 'TDS Q4', dueDate: '2024-05-31', status: 'Processing' },
    { id: '4', clientName: 'Dr. Anjali Gupta', returnType: 'ITR-4', dueDate: '2024-07-31', status: 'Not Started' },
  ]);

  const [newReturn, setNewReturn] = useState<Omit<TaxEntry, 'id'>>({
    clientName: '', returnType: '', dueDate: '', status: 'Not Started'
  });

  const handleAdd = () => {
    if (!newReturn.clientName) return;
    setReturns([...returns, { ...newReturn, id: Date.now().toString() }]);
    setNewReturn({ clientName: '', returnType: '', dueDate: '', status: 'Not Started' });
  };

  const handleDelete = (id: string) => {
    setReturns(returns.filter(r => r.id !== id));
  };

  const handleChange = (id: string, field: keyof TaxEntry, value: string) => {
    setReturns(returns.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="h-full flex flex-col p-2 space-y-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-50 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tax Return Tracker</h2>
            <p className="text-sm text-slate-500">Monitor upcoming deadlines and filing statuses.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Return Type</th>
                <th className="px-6 py-4"><div className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Due Date</div></th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {returns.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-3">
                    <input 
                      value={entry.clientName} 
                      onChange={(e) => handleChange(entry.id, 'clientName', e.target.value)}
                      className="bg-transparent w-full focus:outline-none focus:border-b focus:border-orange-500 font-medium text-slate-900"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      value={entry.returnType} 
                      onChange={(e) => handleChange(entry.id, 'returnType', e.target.value)}
                      className="bg-transparent w-full focus:outline-none focus:border-b focus:border-orange-500"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="date"
                      value={entry.dueDate} 
                      onChange={(e) => handleChange(entry.id, 'dueDate', e.target.value)}
                      className={`bg-transparent w-full focus:outline-none focus:border-b focus:border-orange-500
                        ${new Date(entry.dueDate) < new Date() && entry.status !== 'Filed' ? 'text-red-600 font-bold' : 'text-slate-600'}
                      `}
                    />
                  </td>
                  <td className="px-6 py-3">
                     <select 
                      value={entry.status}
                      onChange={(e) => handleChange(entry.id, 'status', e.target.value as any)}
                      className={`text-xs px-2 py-1 rounded-full font-medium focus:outline-none cursor-pointer border-0
                        ${entry.status === 'Filed' ? 'bg-green-100 text-green-700' : 
                          entry.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}
                    >
                      <option>Not Started</option>
                      <option>Processing</option>
                      <option>Filed</option>
                    </select>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button 
                      onClick={() => handleDelete(entry.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Add New Row */}
              <tr className="bg-slate-50 border-t-2 border-slate-100">
                <td className="px-6 py-3">
                  <input 
                    placeholder="Client Name..."
                    value={newReturn.clientName}
                    onChange={(e) => setNewReturn({...newReturn, clientName: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-2 py-1 w-full text-sm"
                  />
                </td>
                <td className="px-6 py-3">
                  <input 
                    placeholder="e.g. GST, ITR"
                    value={newReturn.returnType}
                    onChange={(e) => setNewReturn({...newReturn, returnType: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-2 py-1 w-full text-sm"
                  />
                </td>
                <td className="px-6 py-3">
                  <input 
                    type="date"
                    value={newReturn.dueDate}
                    onChange={(e) => setNewReturn({...newReturn, dueDate: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-2 py-1 w-full text-sm"
                  />
                </td>
                <td className="px-6 py-3">
                  <span className="text-xs text-slate-400">Status: Not Started</span>
                </td>
                <td className="px-6 py-3 text-center">
                  <button 
                    onClick={handleAdd}
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
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

export default TaxTracker;