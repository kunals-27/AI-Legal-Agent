import React from 'react';
import { FileUp, MessageCircle, BookOpen, Quote, Search, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: FileUp,
      title: 'PDF Ingestion',
      description: 'Upload & analyze contracts, briefs, and legal documents with intelligent parsing.',
      color: 'from-blue-500 to-slate-700'
    },
    {
      icon: MessageCircle,
      title: 'Smart Q&A',
      description: 'Context-aware legal answers with natural language understanding.',
      color: 'from-slate-600 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Legal Library',
      description: 'Access comprehensive database of acts, cases, and regulations.',
      color: 'from-blue-600 to-slate-800'
    },
    {
      icon: Quote,
      title: 'Citations',
      description: 'Evidence-linked responses with proper legal citations and references.',
      color: 'from-slate-700 to-blue-700'
    },
    {
      icon: Search,
      title: 'Hybrid Search',
      description: 'Combines semantic understanding with precise keyword retrieval.',
      color: 'from-blue-700 to-slate-600'
    },
    {
      icon: Shield,
      title: 'Privacy-first',
      description: 'Your data stays yours with enterprise-grade security and encryption.',
      color: 'from-slate-800 to-blue-800'
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-slate-900">
            Powerful Features for Legal Professionals
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools designed to streamline your legal research and document analysis workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                </div>
                
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;