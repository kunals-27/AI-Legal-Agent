import React, { useState } from 'react';
import { User, Bot, ExternalLink } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Citation {
  id: string;
  title: string;
  source: string;
  link: string;
}

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  citations?: Citation[];
  isError?: boolean;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, citations = [], isError = false, isLoading = false }) => {
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);

  const renderMessageWithCitations = (text: string) => {
    // 1) Convert Markdown -> HTML
    const rawHtml = marked.parse(text || '');
    // 2) Sanitize HTML
    let safeHtml = DOMPurify.sanitize(rawHtml as string);
    // 3) Replace [R#]/[W#] with clickable chips (by citation.id)
    citations.forEach((citation) => {
      const tag = `[${citation.id}]`;
      // Use global replacement; escape brackets for regex
      const re = new RegExp(escapeRegExp(tag), 'g');
      safeHtml = safeHtml.replace(
        re,
        `<span class="citation-chip" data-citation="${citation.id}">${tag}</span>`
      );
    });
    return safeHtml;
  };

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const handleCitationClick = (citationId: string) => {
    setExpandedCitation(expandedCitation === citationId ? null : citationId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-start mb-6">
        <div className="flex flex-row items-start space-x-3 max-w-4xl">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 border border-slate-200">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 ml-3">
            <div className="rounded-2xl px-6 py-4 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-4xl`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'mr-3' : 'ml-3'}`}>
          <div className={`rounded-2xl px-6 py-4 ${isUser ? 'bg-blue-600 text-white' : isError ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <div
              className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}
              dangerouslySetInnerHTML={{ __html: isError ? message : renderMessageWithCitations(message) }}
            />
            
            {/* Citations */}
            {citations.length > 0 && !isUser && !isError && (
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <div className="flex flex-wrap gap-2">
                  {citations.map((citation) => (
                    <button
                      key={citation.id}
                      onClick={() => handleCitationClick(citation.id)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {citation.id}
                    </button>
                  ))}
                </div>
                
                {/* Expanded Citation */}
                {expandedCitation && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    {citations.map((citation) => (
                      citation.id === expandedCitation && (
                        <div key={citation.id} className="space-y-2">
                          <h4 className="font-medium text-slate-900">{citation.title}</h4>
                          <p className="text-sm text-slate-600">{citation.source}</p>
                          {citation.link && (
                            <a
                              href={citation.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>View Source</span>
                            </a>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;