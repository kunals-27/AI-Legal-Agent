import React from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">LegalEase AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              AI-powered legal research assistant helping professionals access, analyze, 
              and understand legal information with precision and speed.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/home" className="block text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/chatbot" className="block text-slate-400 hover:text-white transition-colors">
                Chatbot
              </Link>
              <Link to="/legal-library" className="block text-slate-400 hover:text-white transition-colors">
                Legal Library
              </Link>
              <Link to="/contact" className="block text-slate-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">
                Legal Disclaimer
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <p className="text-slate-500 text-sm leading-relaxed text-center">
            © 2024 LegalEase AI. All rights reserved. This service is not a substitute for professional legal advice. 
            Always consult with a qualified attorney for legal matters.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;