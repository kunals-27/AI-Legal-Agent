import React from 'react';
import { ExternalLink, Bookmark, Copy } from 'lucide-react';

interface DocumentCardProps {
  title: string;
  abstract: string;
  type: 'Act' | 'Case' | 'Regulation';
  jurisdiction: string;
  year: number;
  onOpen: () => void;
  onSave: () => void;
  onCopyCitation: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  abstract,
  type,
  jurisdiction,
  year,
  onOpen,
  onSave,
  onCopyCitation
}) => {
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Act':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Case':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Regulation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeBadgeColor(type)}`}>
              {type}
            </span>
            <span className="text-sm text-slate-600">{jurisdiction}</span>
            <span className="text-sm text-slate-500">•</span>
            <span className="text-sm text-slate-600">{year}</span>
          </div>
        </div>

        {/* Abstract */}
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {abstract}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onOpen}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 text-sm font-medium flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open</span>
          </button>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={onCopyCitation}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Copy citation"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onSave}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Save document"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;