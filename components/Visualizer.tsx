import React, { useState } from 'react';
import { PieChart, FileText, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { analyzeFinancialData } from '../services/geminiService';
import { VisualizationResponse } from '../types';

const Visualizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<VisualizationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVisualize = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeFinancialData(inputText);
      setResult(data);
    } catch (error) {
      alert("Failed to analyze data. Please ensure the text contains financial figures.");
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

  return (
    <div className="h-full flex flex-col gap-6 p-2">
      {/* Top Input Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-4 text-slate-800">
          <FileText className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-lg">Financial Data Extractor</h2>
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              placeholder="Paste financial text here. E.g., 'Revenue for Q1 was $50,000, Q2 $75,000, and Q3 projected at $90,000. Operating expenses remained steady at $30,000 per quarter.'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="flex items-end">
             <button
              onClick={handleVisualize}
              disabled={loading || !inputText.trim()}
              className="h-12 px-6 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow transition-colors flex items-center whitespace-nowrap disabled:opacity-50"
             >
               {loading ? 'Analyzing...' : (
                 <>Visualize Data <ArrowRight className="ml-2 w-4 h-4" /></>
               )}
             </button>
          </div>
        </div>
      </div>

      {/* Bottom Visualization Area */}
      {result && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h3 className="font-semibold text-slate-700 mb-6 flex items-center">
              <PieChart className="w-5 h-5 text-brand-500 mr-2" />
              Generated Chart
            </h3>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                    {result.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto">
            <h3 className="font-semibold text-slate-700 mb-4">Executive Summary</h3>
            <div className="prose prose-sm prose-slate">
              <p className="text-slate-600 leading-relaxed">
                {result.summary}
              </p>
            </div>
            
            <div className="mt-8">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Raw Data Extracted</h4>
              <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {result.data.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-slate-700">{item.category}</td>
                        <td className="px-4 py-2 text-sm text-slate-900 font-medium text-right">{item.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!result && !loading && (
        <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
          <div className="text-center">
            <BarChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Data visualization will appear here after analysis.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizer;