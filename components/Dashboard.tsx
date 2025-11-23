
import React from 'react';
import { ToolType } from '../types';
import { Scale, BrainCircuit, PieChart, ArrowRight, Briefcase, FileText, Mail } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tool: ToolType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Audit Planner', value: '3 Active', icon: Briefcase, tool: ToolType.AUDIT_PLANNER, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tax Return Tracker', value: '12 Due', icon: FileText, tool: ToolType.TAX_TRACKER, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Client Messages', value: 'Inbox', icon: Mail, tool: ToolType.CLIENT_COMMUNICATION, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-2 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, CA Admin</h1>
        <p className="text-brand-100 opacity-90 max-w-xl">
          Your intelligent practice workspace is ready. Access the latest regulatory updates, 
          analyze complex cases, or visualize client data instantly.
        </p>
      </div>

      {/* Quick Stats - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <button 
              key={idx} 
              onClick={() => onNavigate(stat.tool)}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left flex flex-col group"
            >
              <div className="flex justify-between items-start w-full mb-3">
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <div className={`${stat.bg} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              <div className="mt-2 text-xs text-brand-600 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                Manage <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </button>
          )
        })}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mt-8">AI Tools & Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <button 
          onClick={() => onNavigate(ToolType.TAX_CHAT)}
          className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <Scale className="w-6 h-6 text-brand-600" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800 mb-2">Regulatory Assistant</h3>
          <p className="text-sm text-slate-500 mb-4 h-10">Get instant answers on Tax, GST, and Compliance backed by Google Search.</p>
          <div className="flex items-center text-brand-600 font-medium text-sm">
            Launch Tool <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </button>

        {/* Card 2 */}
        <button 
          onClick={() => onNavigate(ToolType.ADVISORY)}
          className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <BrainCircuit className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800 mb-2">Strategic Advisory</h3>
          <p className="text-sm text-slate-500 mb-4 h-10">Deep reasoning for complex M&A, restructuring, and ethical case studies.</p>
          <div className="flex items-center text-purple-600 font-medium text-sm">
            Launch Tool <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </button>

        {/* Card 3 */}
        <button 
          onClick={() => onNavigate(ToolType.FIN_VIZ)}
          className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
            <PieChart className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800 mb-2">Financial Visualizer</h3>
          <p className="text-sm text-slate-500 mb-4 h-10">Turn textual financial reports into clear, executive-ready charts instantly.</p>
          <div className="flex items-center text-emerald-600 font-medium text-sm">
            Launch Tool <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
