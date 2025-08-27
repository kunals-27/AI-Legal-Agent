import React from 'react';
import { Shield, Zap, Target, Lock } from 'lucide-react';

const About = () => {
  const features = [
    { icon: Shield, label: 'Reliable' },
    { icon: Zap, label: 'Fast' },
    { icon: Target, label: 'Accurate' },
    { icon: Lock, label: 'Secure' }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Mission Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">
                Revolutionizing Legal Research with AI
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our AI Legal Assistant transforms how legal professionals access, analyze, 
                and understand legal information. By combining advanced natural language 
                processing with comprehensive legal databases, we deliver precise, 
                cited answers in seconds.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Whether you're drafting contracts, researching case law, or analyzing 
                regulations, our platform ensures you have the most relevant information 
                at your fingertips, backed by authoritative sources.
              </p>
            </div>

            {/* Feature chips */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3 bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                  >
                    <Icon className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-slate-800">{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl p-12 border border-blue-100">
              <div className="relative">
                {/* Digital law book illustration */}
                <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-6 bg-blue-200 rounded" />
                    <div className="w-6 h-6 bg-slate-300 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-slate-200 rounded" />
                    <div className="w-3/4 h-2 bg-slate-200 rounded" />
                    <div className="w-5/6 h-2 bg-slate-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-slate-200 rounded" />
                    <div className="w-2/3 h-2 bg-slate-200 rounded" />
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 bg-gradient-to-r from-blue-500 to-slate-700 rounded-full p-3 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-slate-600 to-blue-700 rounded-full p-3 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;