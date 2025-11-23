import React, { useState, useEffect } from 'react';
import { Mail, Send, X, Paperclip, CheckCircle, User, Loader2, Lock, LogIn, LogOut, AlertTriangle, Inbox, RefreshCw, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { ClientQueryEntry, ClientDataEntry } from '../types';

interface ClientCommunicationProps {
  clients: ClientDataEntry[];
}

const ClientCommunication: React.FC<ClientCommunicationProps> = ({ clients }) => {
  // --- AUTH STATE ---
  const [authStep, setAuthStep] = useState<'email' | 'login-password' | 'register-password' | 'authenticated'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // --- APP STATE ---
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [queries, setQueries] = useState<ClientQueryEntry[]>([]);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyMode, setReplyMode] = useState<'view' | 'edit' | 'options'>('options');
  const [currentReplyText, setCurrentReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- AUTHENTICATION HANDLERS ---

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!emailInput.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setIsLoadingAuth(true);
    // Simulate checking database
    setTimeout(() => {
      const storedUser = localStorage.getItem(`user_${emailInput.toLowerCase()}`);
      if (storedUser) {
        setAuthStep('login-password');
      } else {
        setAuthStep('register-password');
      }
      setIsLoadingAuth(false);
    }, 500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.length < 4) {
      setAuthError('Password must be at least 4 characters.');
      return;
    }

    setIsLoadingAuth(true);
    setTimeout(() => {
      // Save user to local storage (Simulating a backend database)
      localStorage.setItem(`user_${emailInput.toLowerCase()}`, JSON.stringify({
        email: emailInput,
        password: passwordInput // In a real app, this would be hashed
      }));
      setAuthStep('authenticated');
      setIsLoadingAuth(false);
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setAuthError('');

    setTimeout(() => {
      const storedData = localStorage.getItem(`user_${emailInput.toLowerCase()}`);
      if (storedData) {
        const user = JSON.parse(storedData);
        if (user.password === passwordInput) {
          setAuthStep('authenticated');
        } else {
          setAuthError('Incorrect password. Please try again.');
        }
      } else {
        setAuthError('User not found. Please register.');
        setAuthStep('email');
      }
      setIsLoadingAuth(false);
    }, 800);
  };

  const handleLogout = () => {
    setAuthStep('email');
    setEmailInput('');
    setPasswordInput('');
    setAuthError('');
    setQueries([]);
  };

  // --- SYNC MESSAGES LOGIC ---
  
  useEffect(() => {
    if (authStep === 'authenticated') {
      setIsLoadingMessages(true);
      
      // Simulate connecting to Gmail API and fetching messages
      // STRICT FILTER: Only fetch messages from emails present in ClientData
      const timer = setTimeout(() => {
        const generatedMessages = clients.map((client, idx) => {
          const templates = [
             { s: "Clarification on TDS Rate", q: "Could you please clarify the TDS rate for Technical Services under the new amendment?" },
             { s: "Audit Invoice Received", q: "We have received the invoice for the March 2024 Audit. Processing payment shortly." },
             { s: "Investment Proof Submission", q: "What is the deadline for submitting investment proofs for this FY?" },
             { s: "GSTR-1 Filing Status", q: "Have we filed the GSTR-1 for last month yet? Please confirm." },
             { s: "Urgent: Notice u/s 143(1)", q: "We received an intimation from the IT department today. Can we discuss this?" },
          ];
          const template = templates[idx % templates.length];

          return {
            id: `msg-${client.id}`,
            fromEmail: client.email,
            subject: template.s,
            queryText: template.q,
            status: 'New' as const,
            timestamp: 'Today, 9:00 AM',
            replyText: ''
          };
        });

        setQueries(generatedMessages);
        setIsLoadingMessages(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [authStep, clients]); // Re-run if clients change or we log in

  // --- UI ACTIONS ---

  const getClientName = (email: string) => {
    const client = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
    return client ? client.name : 'Unknown Client';
  };

  const handleOpenReply = (id: string) => {
    const query = queries.find(q => q.id === id);
    if (!query) return;

    setActiveReplyId(id);
    if (query.status === 'New') {
      setReplyMode('edit');
      setCurrentReplyText('');
    } else {
      setReplyMode('options');
      setCurrentReplyText(query.replyText || '');
    }
  };

  const handleCloseReply = () => {
    setActiveReplyId(null);
    setReplyMode('options');
    setCurrentReplyText('');
    setIsSending(false);
  };

  const handleSendReply = async () => {
    if (!activeReplyId) return;
    const query = queries.find(q => q.id === activeReplyId);
    if (!query) return;

    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update local state
    setQueries(queries.map(q => 
      q.id === activeReplyId ? { ...q, status: 'Replied', replyText: currentReplyText } : q
    ));

    // Open Gmail Compose Window
    const subject = encodeURIComponent(`Re: ${query.subject}`);
    const body = encodeURIComponent(currentReplyText);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${query.fromEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, 'GmailCompose', 'width=700,height=600,left=200,top=100');

    setIsSending(false);
    handleCloseReply();
  };

  // --- RENDER: AUTH SCREEN ---

  if (authStep !== 'authenticated') {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Practice Login</h2>
            <p className="text-slate-500 text-sm">Secure access to client communications</p>
          </div>

          {/* STEP 1: EMAIL */}
          {authStep === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  autoFocus
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@firm.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <button 
                type="submit"
                disabled={isLoadingAuth}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoadingAuth ? <Loader2 className="animate-spin w-5 h-5" /> : <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
              </button>
            </form>
          )}

          {/* STEP 2: REGISTER (SET PASSWORD) */}
          {authStep === 'register-password' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                Looks like you're new here! Please set a password for <b>{emailInput}</b>.
              </div>
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Set Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <button 
                type="submit"
                disabled={isLoadingAuth}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoadingAuth ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account & Login'}
              </button>
              <button type="button" onClick={() => setAuthStep('email')} className="w-full text-slate-400 text-sm hover:text-slate-600 mt-2">Back</button>
            </form>
          )}

          {/* STEP 3: LOGIN (ENTER PASSWORD) */}
          {authStep === 'login-password' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-2">
                <p className="text-slate-600 font-medium">Welcome back, {emailInput}</p>
              </div>
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{authError}</p>}
              <button 
                type="submit"
                disabled={isLoadingAuth}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoadingAuth ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
              </button>
              <button type="button" onClick={() => setAuthStep('email')} className="w-full text-slate-400 text-sm hover:text-slate-600 mt-2">Switch Account</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: INBOX ---

  const activeQuery = queries.find(q => q.id === activeReplyId);

  return (
    <div className="h-full flex flex-col p-2 space-y-4 relative">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <Mail className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Communication Hub</h2>
            <div className="flex items-center space-x-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <p className="text-sm text-slate-500">Synced with <span className="font-semibold text-slate-700">{emailInput}</span></p>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-500 flex items-center space-x-1 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Message Table */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
        {isLoadingMessages && (
          <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Securely syncing messages from Client Database...</p>
          </div>
        )}

        {queries.length === 0 && !isLoadingMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Inbox className="w-16 h-16 mb-4 opacity-20" />
            <p>No new messages found.</p>
            <p className="text-xs mt-2 max-w-xs text-center">We checked for emails from your "Client Data" list but found no new queries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">Client Name</th>
                  <th className="px-6 py-4 text-left">Subject</th>
                  <th className="px-6 py-4 text-left w-1/3">Message Preview</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queries.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 group">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {getClientName(q.fromEmail)}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {q.subject}
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">
                      {q.queryText}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                        q.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {q.status === 'Replied' && <CheckCircle className="w-3 h-3" />}
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenReply(q.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors shadow-sm"
                      >
                        {q.status === 'New' ? 'Reply' : 'View Thread'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Overlay */}
      {activeQuery && (
        <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Window Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
              <div className="font-medium text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-300" />
                <span>Message from <span className="font-bold text-white">{getClientName(activeQuery.fromEmail)}</span></span>
              </div>
              <button onClick={handleCloseReply} className="hover:bg-slate-700 p-1 rounded transition-colors"><X className="w-4 h-4" /></button>
            </div>

            {/* Read-Only Query View */}
            <div className="bg-slate-50 p-6 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-800 mb-1">{activeQuery.subject}</h3>
              <div className="flex items-center text-xs text-slate-500 mb-4 space-x-2">
                 <span>{activeQuery.timestamp}</span>
                 <span>•</span>
                 <span>{activeQuery.fromEmail}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-slate-700 text-sm leading-relaxed shadow-sm">
                {activeQuery.queryText}
              </div>
            </div>

            {/* Reply Area */}
            <div className="p-0 flex-1 flex flex-col bg-white min-h-[300px]">
              {replyMode === 'options' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800">You have replied to this query.</h3>
                   <div className="flex gap-4 mt-6">
                     <button onClick={() => setReplyMode('view')} className="px-4 py-2 border rounded-lg hover:bg-slate-50 font-medium text-slate-700">View Reply</button>
                     <button onClick={() => setReplyMode('edit')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Edit / Send New</button>
                   </div>
                </div>
              )}

              {replyMode === 'view' && (
                 <div className="flex-1 p-6">
                    <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">{currentReplyText}</div>
                    <button onClick={() => setReplyMode('options')} className="mt-4 text-sm text-blue-600 underline">Back</button>
                 </div>
              )}

              {replyMode === 'edit' && (
                <div className="flex flex-col h-full">
                  <div className="px-6 py-2 bg-yellow-50 text-xs text-yellow-800 border-b border-yellow-100 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-2" />
                    Replying as <b>&nbsp;{emailInput}</b>
                  </div>
                  <textarea 
                    className="flex-1 p-6 focus:outline-none resize-none text-sm leading-relaxed text-slate-800 placeholder:text-slate-300"
                    placeholder="Write your professional reply here..."
                    value={currentReplyText}
                    onChange={(e) => setCurrentReplyText(e.target.value)}
                    autoFocus
                  />
                  <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><Paperclip className="w-4 h-4" /></button>
                    </div>
                    <button 
                      onClick={handleSendReply}
                      disabled={isSending || !currentReplyText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-full font-medium text-sm flex items-center shadow-lg transition-all"
                    >
                      {isSending ? 'Opening Gmail...' : 'Send via Gmail'} <Send className="w-3 h-3 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCommunication;