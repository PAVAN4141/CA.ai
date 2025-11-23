
import React from 'react';
import { LayoutDashboard, Scale, BrainCircuit, PieChart, Calculator, Briefcase, FileText, Users, Mail } from 'lucide-react';
import { ToolType } from '../types';

interface SidebarProps {
  currentTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTool, onToolChange, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: ToolType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ToolType.AUDIT_PLANNER, label: 'Audit Planner', icon: Briefcase },
    { id: ToolType.TAX_TRACKER, label: 'Tax Return Tracker', icon: FileText },
    { id: ToolType.CLIENT_DATA, label: 'Client Data', icon: Users },
    { id: ToolType.CLIENT_COMMUNICATION, label: 'Client Communication', icon: Mail },
    { type: 'divider' }, // Visual separator
    { id: ToolType.TAX_CHAT, label: 'Regulatory Chat', icon: Scale },
    { id: ToolType.ADVISORY, label: 'Strategic Advisory', icon: BrainCircuit },
    { id: ToolType.FIN_VIZ, label: 'Financial Visualizer', icon: PieChart },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col h-full shadow-xl
      `}>
        <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
          <Calculator className="w-8 h-8 text-brand-400" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">CA.ai</h1>
            <p className="text-xs text-slate-400">Practice Companion</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={`div-${idx}`} className="my-2 border-t border-slate-700/50" />;
            }

            // Type guard to ensure item has id, label, icon if not divider
            if (!item.id) return null;
            const Icon = item.icon!;
            const isActive = currentTool === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onToolChange(item.id as ToolType);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">System Status</p>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-slate-200">AI Models Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
