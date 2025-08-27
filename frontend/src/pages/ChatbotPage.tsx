import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import ChatMessage from '../components/ChatMessage';
import QuickActions from '../components/QuickActions';
import { Send, Paperclip, Image, Menu, X, FileText } from 'lucide-react';

interface Source {
  source: string;
  section: string;
  score: number;
  text: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  citations?: Array<{
    id: string;
    title: string;
    source: string;
    link: string;
  }>;
  sources?: Source[];
  isError?: boolean;
}

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  status: 'processing' | 'ready' | 'error';
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [activeTab, setActiveTab] = useState('General');
  const [lastSources, setLastSources] = useState<Source[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = ['General', 'Contracts', 'Case Law', 'Regulations', 'Custom Docs'];

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from the server.');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isUser: false,
        citations: data.citations.map((cit: any, index: number) => ({ ...cit, id: `cit-${index}`})),
        sources: data.sources,
      };

      setMessages(prev => [...prev, aiMessage]);
      setLastSources(data.sources);

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc: UploadedDocument = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          status: 'processing'
        };
        setUploadedDocs(prev => [...prev, newDoc]);

        // Simulate processing
        setTimeout(() => {
          setUploadedDocs(prev => 
            prev.map(doc => 
              doc.id === newDoc.id ? { ...doc, status: 'ready' } : doc
            )
          );
        }, 2000);
      });
    }
  };

  const handleAskQuestion = () => {
    inputRef.current?.focus();
  };

  const handleUploadDocument = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting Section */}
        <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-blue-600 to-slate-800 rounded-2xl p-8 text-white">
          {/* Rotating gradient sphere */}
          <div className="absolute top-1/2 right-8 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl animate-spin" style={{ animationDuration: '20s' }} />
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, User!</h1>
            <p className="text-blue-100">How can I assist you with your legal research today?</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <QuickActions 
              onAskQuestion={handleAskQuestion}
              onUploadDocument={handleUploadDocument}
            />

            {/* Chat Messages */}
            <div className="bg-white rounded-2xl border border-slate-200 min-h-[500px]">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Legal AI Assistant</h2>
              </div>
              
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <p>Start a conversation by asking a legal question or uploading a document.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <ChatMessage
                        key={message.id}
                        message={message.text}
                        isUser={message.isUser}
                        citations={message.citations}
                        isError={message.isError}
                      />
                    ))}
                    {isLoading && (
                      <ChatMessage
                        key="loading"
                        isUser={false}
                        message="Thinking..."
                        isLoading={true}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-200">
                {/* Tabs */}
                <div className="flex space-x-2 mb-4 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask a legal question..."
                      className="w-full p-4 pr-24 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none min-h-[56px] max-h-32"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    {/* Upload buttons */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <button
                        onClick={handleUploadDocument}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Upload PDF"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleUploadDocument}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Upload Image"
                      >
                        <Image className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Drawer */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Mobile drawer toggle */}
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="lg:hidden fixed top-24 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
              >
                {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className={`${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:relative top-0 right-0 h-full lg:h-auto w-80 lg:w-full bg-white lg:bg-transparent z-40 transform transition-transform duration-300 lg:transform-none`}>
                <div className="p-6 lg:p-0 space-y-6 h-full overflow-y-auto">
                  {/* Uploaded Documents */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Documents</h3>
                    <div className="space-y-3">
                      {uploadedDocs.length === 0 ? (
                        <p className="text-slate-500 text-sm">No documents uploaded yet.</p>
                      ) : (
                        uploadedDocs.map(doc => (
                          <div key={doc.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                              <p className="text-xs text-slate-500">{doc.size}</p>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              doc.status === 'ready' ? 'bg-green-500' :
                              doc.status === 'processing' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Context Sources */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Context Sources</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {lastSources.length === 0 ? (
                        <p className="text-slate-500 text-sm">Sources from your last query will appear here.</p>
                      ) : (
                        lastSources.map((source, index) => (
                          <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-sm font-medium text-slate-800 truncate" title={source.source}>{source.source}</p>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{source.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay for mobile */}
              {isDrawerOpen && (
                <div
                  className="lg:hidden fixed inset-0 bg-black/50 z-30"
                  onClick={() => setIsDrawerOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ChatbotPage;