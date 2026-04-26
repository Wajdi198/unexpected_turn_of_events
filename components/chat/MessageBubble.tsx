import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell
} from 'recharts';
import { Database, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  data?: any[];
  visualization?: 'table' | 'bar_chart' | 'line_chart' | 'single_value' | 'none';
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [showSql, setShowSql] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div 
        className={`
          max-w-[85%] rounded-2xl p-5 shadow-lg transition-all
          ${isUser 
            ? 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tr-none' 
            : 'bg-slate-900 border-l-4 border-l-indigo-500 border border-slate-800 text-slate-200 rounded-tl-none'
          }
        `}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {!isUser && message.visualization && message.data && message.data.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            {message.visualization === 'table' && (
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400">
                      {Object.keys(message.data[0]).map((key) => (
                        <th key={key} className="px-4 py-2 font-semibold uppercase tracking-wider">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {message.data.map((row, i) => (
                      <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-4 py-3 font-normal text-slate-300">
                            {typeof val === 'number' ? val.toLocaleString() : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {message.visualization === 'bar_chart' && (
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={message.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey={Object.keys(message.data[0])[0]} 
                      stroke="#64748b" 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                    />
                    <YAxis stroke="#64748b" fontSize={10} tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Bar dataKey={Object.keys(message.data[0])[1]} fill="#6366f1" radius={[4, 4, 0, 0]}>
                      {message.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#4f46e5'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {message.visualization === 'line_chart' && (
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={message.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey={Object.keys(message.data[0])[0]} 
                      stroke="#64748b" 
                      fontSize={10}
                    />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={Object.keys(message.data[0])[1]} 
                      stroke="#6366f1" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: '#6366f1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {message.visualization === 'single_value' && (
              <div className="flex flex-col items-center justify-center py-6 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-4xl font-bold text-indigo-400 mb-1">
                  {typeof message.data[0][Object.keys(message.data[0])[0]] === 'number' 
                    ? message.data[0][Object.keys(message.data[0])[0]].toLocaleString() 
                    : message.data[0][Object.keys(message.data[0])[0]]}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  {Object.keys(message.data[0])[0].replace(/_/g, ' ')}
                </div>
              </div>
            )}
          </div>
        )}

        {!isUser && (
          <div className="mt-4 flex flex-col gap-3">
            {message.sql && (
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setShowSql(!showSql)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-950 text-[10px] font-mono text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Database size={12} />
                    <span>VIEW GENERATED SQL</span>
                  </div>
                  {showSql ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showSql && (
                  <div className="p-3 bg-slate-950 border-t border-slate-800">
                    <pre className="text-[10px] font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed">
                      {message.sql}
                    </pre>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
              <CheckCircle2 size={10} className="text-green-500" />
              Powered by Llama 3.3 + Postgres
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
