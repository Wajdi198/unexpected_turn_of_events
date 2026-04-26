import React from 'react';
import { Lightbulb, Send } from 'lucide-react';

interface ExampleQuestionsProps {
  onSelect: (question: string) => void;
}

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({ onSelect }) => {
  const frenchQuestions = [
    "Quelles institutions dépassent 95% du budget?",
    "Combien d'étudiants au total dans le réseau?",
    "Montre-moi les alertes critiques",
    "Quel est le taux d'abandon moyen?",
    "Quelle institution a le plus de publications?",
    "Compare le taux d'employabilité entre les institutions"
  ];

  const englishQuestions = [
    "Which institutions have over 90% budget execution?",
    "Show me critical alerts",
    "What's the average success rate across the network?",
    "List institutions sorted by student count"
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-fit sticky top-8">
      <div className="flex items-center gap-2 mb-6 text-indigo-400 font-bold uppercase tracking-wider text-sm">
        <Lightbulb size={18} />
        <span>Try asking...</span>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3 px-1">In French</h3>
          <div className="flex flex-wrap gap-2">
            {frenchQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSelect(q)}
                className="text-left text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-slate-300 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                {q}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3 px-1">In English</h3>
          <div className="flex flex-wrap gap-2">
            {englishQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSelect(q)}
                className="text-left text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-slate-300 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                {q}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Connected to UCARiq Live Data
      </div>
    </div>
  );
};
