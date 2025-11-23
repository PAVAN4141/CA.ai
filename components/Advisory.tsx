import React, { useState } from 'react';
import { BrainCircuit, Lightbulb, AlertCircle, PlayCircle } from 'lucide-react';
import { getStrategicAdvisory } from '../services/geminiService';

const Advisory: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await getStrategicAdvisory(prompt);
      setAnalysis(result || "No analysis generated.");
    } catch (error) {
      setAnalysis("Error: Unable to generate strategic analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-2">
      {/* Input Section */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-indigo-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-900">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold">Strategic Case Advisory</h2>
          </div>
          <span className="text-xs font-medium text-indigo-600 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100">
            Deep Thinking Model
          </span>
        </div>
        
        <div className="flex-1 p-6 flex flex-col">
          <p className="text-sm text-slate-500 mb-4">
            Describe a complex financial scenario (e.g., M&A implications, Ethical conflicts in Audit, Business restructuring) for deep AI reasoning.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: My client, a manufacturing firm, is considering a merger with a supplier. The supplier has some pending litigation regarding environmental compliance. Analyze the risks and benefits..."
            className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none outline-none mb-4"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !prompt.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Thinking deeply...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                <span>Generate Strategic Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="flex-[1.5] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-700 flex items-center">
            <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
            Analysis Result
          </h2>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-white relative">
          {!analysis && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
              <p>Enter a scenario to receive a structured strategic breakdown.</p>
            </div>
          )}
          
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              <div className="h-32 bg-slate-50 rounded w-full border border-slate-100 border-dashed"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            </div>
          )}

          {analysis && (
            <div className="prose prose-sm prose-slate max-w-none">
               {/* Simple rendering preserving whitespace */}
               <div className="whitespace-pre-wrap leading-relaxed text-slate-800">
                 {analysis}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advisory;