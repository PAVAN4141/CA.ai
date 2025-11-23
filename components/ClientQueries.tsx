
import React, { useState } from 'react';
import { Mail, Sheet, Send, X, Paperclip, Trash2, Edit2, Eye, LogIn, LogOut, CheckCircle, User, Loader2 } from 'lucide-react';

interface ClientQueryEntry {
  id: string;
  clientName: string;
  email: string;
  lastQuery: string;
  status: 'New' | 'Replied';
  timestamp: string;
  replyText?: string;
}

const ClientQueries: React.FC = () => {
  const [queries, setQueries] = useState<ClientQueryEntry[]>([
    { id: '1', clientName: 'Alpha Tech', email: 'accounts@alphatech.com', lastQuery: 'Clarification on TDS rate for Technical Services', status: 'New', timestamp: '10:30 AM', replyText: '' },
    { id: '2', clientName: 'Mehta Textiles', email: 'finance@mehtatextiles.in', lastQuery: 'Sent Invoice for March 2024 Audit', status: 'Replied', timestamp: 'Yesterday', replyText: 'Received with thanks. We will process the audit report by Friday.' },
    { id: '3', clientName: 'Dr. Anjali Gupta', email: 'anjali@clinic.com', lastQuery: 'Investment proof submission deadline?', status: 'New', timestamp: '2 days ago', replyText: '' },
  ]);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyMode, setReplyMode] = useState<'view' | 'edit' | 'options'>('options');
  const [currentReplyText, setCurrentReplyText] = useState('');
  
  // Google Account State
  const [googleAccount, setGoogleAccount] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Handle Google Login Simulation
  const handleGoogleLogin = () => {
    // In a real app, this would be a Google OAuth popup.
    // For this demo, we simulate it by asking for the email.
    const email = window.prompt("Enter your Google Workspace / Gmail address to connect:", "ca.admin@gmail.com");
    if (email) {
      setGoogleAccount(email);
    }
  };

  const handleGoogleLogout = () => {
    setGoogleAccount(null);
  };

  // Handle opening the reply interface
  const handleOpenReply = (id: string) => {
    const query = queries.find(q => q.id === id);
    if (!query) return;

    setActiveReplyId(id);
    if (query.status === 'New') {
      setReplyMode('edit');
      setCurrentReplyText('');
    } else {
      setReplyMode('options'); // Show "View" or "Edit" options if already replied
      setCurrentReplyText(query.replyText || '');
    }
  };

  const handleCloseReply = () => {
    setActiveReplyId(null);
    setReplyMode('options');
    setCurrentReplyText('');
    setIsSending(false);
  };

  // Handle sending the email via Gmail Popup
  const handleSendReply = async () => {
    if (!activeReplyId) return;
    
    const query = queries.find(q => q.id === activeReplyId);
    if (!query) return;

    setIsSending(true);

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // 1. Update Internal State
    setQueries(queries.map(q => 
      q.id === activeReplyId ? { ...q, status: 'Replied', replyText: currentReplyText } : q
    ));

    // 2. Open Gmail in a Popup Window (Direct Integration Feel)
    // using "view=cm" (compose mode) ensures it opens the composer directly
    const subject = encodeURIComponent(`Re: ${query.lastQuery}`);
    const body = encodeURIComponent(currentReplyText);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${query.email}&su=${subject}&body=${body}`;
    
    // Open a smaller popup window for the "App-like" feel
    window.open(gmailUrl, 'GmailCompose', 'width=700,height=600,left=200,top=100');

    setIsSending(false);
    handleCloseReply();
    
    // Optional: Alert the user
    // alert("Gmail composer opened. Please click 'Send' in the popup window.");
  };

  const handleDelete = (id: string) => {
    setQueries(queries.filter(q => q.id !== id));
  };

  // Inline Editing
  const handleFieldChange = (id: string, field: keyof ClientQueryEntry, value: string) => {
    setQueries(queries.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const activeQuery = queries.find(q => q.id === activeReplyId);

  return (
    <div className="h-full flex flex-col p-2 space-y-4 relative">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <Sheet className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Client Communications Manager</h2>
            <p className="text-sm text-slate-500">Manage client queries and sync with Google Mail.</p>
          </div>
        </div>
        
        {/* Google Account Connect Button */}
        <div>
          {googleAccount ? (
            <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                 {googleAccount.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Connected as</span>
                <span className="text-sm font-medium text-slate-800">{googleAccount}</span>
              </div>
              <button onClick={handleGoogleLogout} className="text-slate-400 hover:text-red-500 ml-2">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-full border border-slate-300 shadow-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Connect Google Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Editable Table */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-green-50/50 border-b border-green-200 px-4 py-2 flex items-center space-x-2 text-xs text-green-800 font-mono">
           <div className={`w-2 h-2 rounded-full ${googleAccount ? 'bg-green-500' : 'bg-slate-300'} animate-pulse`}></div>
           <span>{googleAccount ? 'Sync Active' : 'Offline Mode (Connect Account to sync)'}</span>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left w-48">Client Name</th>
                <th className="px-4 py-3 text-left w-64">Email Address</th>
                <th className="px-4 py-3 text-left">Latest Query</th>
                <th className="px-4 py-3 text-center w-32">Status</th>
                <th className="px-4 py-3 text-center w-32">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {queries.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 group">
                  <td className="px-4 py-2 border-r border-slate-100">
                    <input 
                      value={q.clientName}
                      onChange={(e) => handleFieldChange(q.id, 'clientName', e.target.value)}
                      onClick={() => handleOpenReply(q.id)}
                      className="w-full bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 rounded px-2 py-1 cursor-pointer hover:text-blue-600 font-medium"
                    />
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100">
                    <input 
                      value={q.email}
                      onChange={(e) => handleFieldChange(q.id, 'email', e.target.value)}
                      className="w-full bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 rounded px-2 py-1 font-mono text-xs text-slate-600"
                    />
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100">
                    <input 
                      value={q.lastQuery}
                      onChange={(e) => handleFieldChange(q.id, 'lastQuery', e.target.value)}
                      className="w-full bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 rounded px-2 py-1 text-slate-700"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                      q.status === 'New' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                    }`}>
                      {q.status === 'Replied' && <CheckCircle className="w-3 h-3" />}
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleOpenReply(q.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors shadow-sm"
                    >
                      {q.status === 'New' ? 'Reply' : 'Actions'}
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="ml-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gmail-Style Reply Overlay */}
      {activeQuery && (
        <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-t-xl md:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200 border border-slate-200 ring-1 ring-black/5">
            
            {/* Window Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
              <div className="font-medium text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-300" />
                {replyMode === 'edit' ? 'New Message' : `Thread: ${activeQuery.clientName}`}
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={handleCloseReply} className="hover:bg-slate-700 p-1 rounded transition-colors text-slate-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-0 flex-1 flex flex-col bg-white min-h-[400px]">
              
              {/* If Replied: Show Options Screen */}
              {replyMode === 'options' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8 relative">
                   <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
                      <CheckCircle className="w-10 h-10" />
                   </div>
                   <div className="text-center">
                     <h3 className="text-xl font-bold text-slate-800">Response Logged</h3>
                     <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                       You replied to this query on <span className="font-semibold">{new Date().toLocaleDateString()}</span>.
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
                     <button 
                        onClick={() => setReplyMode('view')}
                        className="flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-slate-700 bg-white shadow-sm"
                     >
                       <Eye className="w-4 h-4 mr-2 text-slate-500" /> Show Reply
                     </button>
                     <button 
                        onClick={() => setReplyMode('edit')}
                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg transform active:scale-95"
                     >
                       <Edit2 className="w-4 h-4 mr-2" /> Edit Reply
                     </button>
                   </div>
                   
                   {!googleAccount && (
                     <p className="absolute bottom-4 text-xs text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                       Note: Reply was sent using external mail client.
                     </p>
                   )}
                </div>
              )}

              {/* View Only Mode */}
              {replyMode === 'view' && (
                 <div className="flex-1 flex flex-col p-6 bg-slate-50/50">
                    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm mb-4">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-slate-800">Re: {activeQuery.lastQuery}</h4>
                          <div className="flex items-center mt-2 text-sm text-slate-500">
                             <User className="w-4 h-4 mr-2" />
                             <span className="font-medium text-slate-900 mr-2">To: {activeQuery.clientName}</span>
                             <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">&lt;{activeQuery.email}&gt;</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Replied</span>
                      </div>
                      <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {currentReplyText}
                      </div>
                    </div>
                    <div className="mt-auto flex justify-end">
                       <button onClick={() => setReplyMode('options')} className="text-slate-500 hover:text-slate-800 text-sm font-medium px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">
                         Back to Options
                       </button>
                    </div>
                 </div>
              )}

              {/* Edit Mode (Gmail Composer Simulation) */}
              {replyMode === 'edit' && (
                <>
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center bg-white">
                    <span className="text-slate-400 w-16 text-sm font-medium">To</span>
                    <div className="flex-1 flex items-center">
                      <div className="bg-slate-100 rounded-full px-3 py-1 text-sm text-slate-700 border border-slate-200 flex items-center">
                        {activeQuery.email}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center bg-white">
                    <span className="text-slate-400 w-16 text-sm font-medium">Subject</span>
                    <input 
                      className="flex-1 focus:outline-none text-sm font-semibold text-slate-800" 
                      value={`Re: ${activeQuery.lastQuery}`} 
                      readOnly
                    />
                  </div>
                  
                  <textarea 
                    className="flex-1 p-6 focus:outline-none resize-none text-sm leading-relaxed text-slate-800 placeholder:text-slate-300"
                    placeholder="Write your professional reply here..."
                    value={currentReplyText}
                    onChange={(e) => setCurrentReplyText(e.target.value)}
                    autoFocus
                  />

                  {/* Toolbar */}
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={handleSendReply}
                        disabled={isSending || !currentReplyText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-full font-medium text-sm flex items-center shadow-lg shadow-blue-200 transition-all active:scale-95"
                      >
                        {isSending ? (
                          <>Sending <Loader2 className="w-3 h-3 ml-2 animate-spin" /></>
                        ) : (
                          <>Send via Gmail <Send className="w-3 h-3 ml-2" /></>
                        )}
                      </button>
                      <div className="h-6 w-px bg-slate-200"></div>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <Paperclip className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {googleAccount && (
                       <span className="text-xs text-slate-400">Sending as {googleAccount}</span>
                    )}
                    
                    <button 
                      onClick={handleCloseReply}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientQueries;
