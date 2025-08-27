import React from 'react';
import { MessageCircle, Upload, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onAskQuestion: () => void;
  onUploadDocument: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAskQuestion, onUploadDocument }) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: MessageCircle,
      title: 'Ask a Legal Question',
      description: 'Get instant answers with citations',
      color: 'from-blue-500 to-slate-700',
      action: onAskQuestion
    },
    {
      icon: Upload,
      title: 'Upload PDF/Image',
      description: 'Analyze documents with AI',
      color: 'from-slate-600 to-blue-600',
      action: onUploadDocument
    },
    {
      icon: BookOpen,
      title: 'Open Legal Library',
      description: 'Browse acts, cases & regulations',
      color: 'from-blue-600 to-slate-800',
      action: () => navigate('/legal-library')
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={action.action}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
              </div>
            </div>
            <p className="text-slate-600 text-sm">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;