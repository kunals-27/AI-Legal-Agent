import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, BookOpen, Scale, FileText, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                AI-Powered
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-300">
                  Legal Assistant
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                Upload documents, explore laws, and get instant, cited answers. 
                Transform your legal research with AI that understands context and provides reliable sources.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/chatbot"
                className="bg-gradient-to-r from-blue-600 to-slate-800 text-white font-semibold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-slate-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Try the Chatbot</span>
              </Link>
              
              <Link
                to="/legal-library"
                className="border border-slate-400 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-slate-300 transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Legal Library</span>
              </Link>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative">
            <div className="relative z-10 space-y-6">
              {/* Main illustration container */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-500/20 rounded-xl p-6 flex items-center justify-center">
                    <Scale className="w-12 h-12 text-blue-300" />
                  </div>
                  <div className="bg-slate-500/20 rounded-xl p-6 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-300" />
                  </div>
                  <div className="bg-blue-500/20 rounded-xl p-6 flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-blue-300" />
                  </div>
                  <div className="bg-slate-600/20 rounded-xl p-6 flex items-center justify-center">
                    <Zap className="w-12 h-12 text-slate-300" />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-slate-700 rounded-full p-4 shadow-lg animate-bounce">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;