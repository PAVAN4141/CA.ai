
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaxChat from './components/TaxChat';
import Advisory from './components/Advisory';
import Visualizer from './components/Visualizer';
import AuditPlanner from './components/AuditPlanner';
import TaxTracker from './components/TaxTracker';
import ClientData from './components/ClientData';
import ClientCommunication from './components/ClientCommunication';
import { ToolType, ClientDataEntry } from './types';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Centralized Client Database
  // This state is shared between Client Data (Edit) and Client Communication (Read/Filter)
  const [clients, setClients] = useState<ClientDataEntry[]>([
    { id: '1', name: 'Alpha Tech Solutions', email: 'accounts@alphatech.com' },
    { id: '2', name: 'Mehta Textiles', email: 'finance@mehtatextiles.in' },
    { id: '3', name: 'Dr. Anjali Gupta', email: 'anjali@clinic.com' },
    { id: '4', name: 'Sharma Traders', email: 'sharma@traders.com' },
  ]);

  const renderContent = () => {
    switch (currentTool) {
      case ToolType.DASHBOARD:
        return <Dashboard onNavigate={setCurrentTool} />;
      case ToolType.TAX_CHAT:
        return <TaxChat />;
      case ToolType.ADVISORY:
        return <Advisory />;
      case ToolType.FIN_VIZ:
        return <Visualizer />;
      case ToolType.AUDIT_PLANNER:
        return <AuditPlanner />;
      case ToolType.TAX_TRACKER:
        return <TaxTracker />;
      case ToolType.CLIENT_DATA:
        return <ClientData clients={clients} setClients={setClients} />;
      case ToolType.CLIENT_COMMUNICATION:
        return <ClientCommunication clients={clients} />;
      default:
        return <Dashboard onNavigate={setCurrentTool} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentTool={currentTool} 
        onToolChange={setCurrentTool} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <div className="font-bold text-slate-800">CA.ai</div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4 md:p-6 bg-slate-50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
