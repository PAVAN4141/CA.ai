import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Users, Clock, Briefcase } from 'lucide-react';
import { AuditEntry } from '../types';

const AuditPlanner: React.FC = () => {
  const [audits, setAudits] = useState<AuditEntry[]>([
    { id: '1', clientName: 'Alpha Tech Solutions', auditType: 'Statutory Audit', date: '2024-03-31', team: 'Amit, Sarah', timeEstimate: '40 hrs', status: 'In Progress' },
    { id: '2', clientName: 'Green Earth NGOs', auditType: 'Internal Audit', date: '2024-04-15', team: 'Raj', timeEstimate: '20 hrs', status: 'Pending' },
    { id: '3', clientName: 'Mehta Textiles', auditType: 'Tax Audit', date: '2024-09-30', team: 'Amit, Priya', timeEstimate: '60 hrs', status: 'Pending' },
  ]);

  const [newAudit, setNewAudit] = useState<Omit<AuditEntry, 'id'>>({
    clientName: '', auditType: '', date: '', team: '', timeEstimate: '', status: 'Pending'
  });

  const handleAdd = () => {
    if (!newAudit.clientName) return;
    setAudits([...audits, { ...newAudit, id: Date.now().toString() }]);
    setNewAudit({ clientName: '', auditType: '', date: '', team: '', timeEstimate: '', status: 'Pending' });
  };

  const handleDelete = (id: string) => {
    setAudits(audits.filter(a => a.id !== id));
  };

  const handleChange = (id: string, field: keyof AuditEntry, value: string) => {
    setAudits(audits.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="h-full flex flex-col p-2 space-y-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Audit Planner</h2>
            <p className="text-sm text-slate-500">Manage client audits, resource allocation, and timelines.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Type of Audit</th>
                <th className="px-6 py-4"><div className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Date</div></th>
                <th className="px-6 py-4"><div className="flex items-center"><Users className="w-4 h-4 mr-1"/> Team</div></th>
                <th className="px-6 py-4"><div className="flex items-center"><Clock className="w-4 h-4 mr-1"/> Est. Time</div></th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audits.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-3">
                    <input 
                      value={audit.clientName} 
                      onChange={(e) => handleChange(audit.id, 'clientName', e.target.value)}
                      className="bg-transparent w-full focus:outline-none focus:border-b focus:border-blue-500 font-medium text-slate-900"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      value={audit.auditType} 
                      onChange={(e) => handleChange(audit.id, 'auditType', e.target.value)}
                      className="bg-transparent w-full focus:outline-none focus:border-b focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="date"
                      value={audit.date} 
                      onChange={(e) => handleChange(audit.id, 'date', e.target.value)}
                      className="bg-transparent w-full focus:outline-none focus:border-b focus:border-blue-500 text-slate-600"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      value={audit.team} 
                      onChange={(e) => handleChange(audit.id, 'team', e.target.value)}
                      className="bg-transparent w-full focus:outline-none focus:border-b focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      value={audit.timeEstimate} 
                      onChange={(e) => handleChange(audit.id, 'timeEstimate', e.target.value)}
                      className="bg-transparent w-full focus:outline-none focus:border-b focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <select 
                      value={audit.status}
                      onChange={(e) => handleChange(audit.id, 'status', e.target.value as any)}
                      className={`text-xs px-2 py-1 rounded-full font-medium focus:outline-none
                        ${audit.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          audit.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button 
                      onClick={() => handleDelete(audit.id)}
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
                    placeholder="New Client..."
                    value={newAudit.clientName}
                    onChange={(e) => setNewAudit({...newAudit, clientName: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-2 py-1 w-full text-sm"
                  />
                </td>
                <td className="px-6 py-3">
                  <input 
                    placeholder="Audit Type"
                    value={newAudit.auditType}
                    onChange={(e) => setNewAudit({...newAudit, auditType: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-2 py-1 w-full text-sm"
                  />
                </td>
                <td className="px-6 py-3">
                  <input 
                    type="date"
                    value={newAudit.date}
                    onChange={(e) => setNewAudit({...newAudit, date: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-2 py-1 w-full text-sm"
                  />
                </td>
                <td className="px-6 py-3">
                  <input 
                    placeholder="Team"
                    value={newAudit.team}
                    onChange={(e) => setNewAudit({...newAudit, team: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-2 py-1 w-full text-sm"
                  />
                </td>
                <td className="px-6 py-3">
                  <input 
                    placeholder="Est. Time"
                    value={newAudit.timeEstimate}
                    onChange={(e) => setNewAudit({...newAudit, timeEstimate: e.target.value})}
                    className="bg-white border border-slate-300 rounded px-2 py-1 w-full text-sm"
                  />
                </td>
                <td className="px-6 py-3">
                  <span className="text-xs text-slate-400">Default: Pending</span>
                </td>
                <td className="px-6 py-3 text-center">
                  <button 
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 transition-colors"
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

export default AuditPlanner;