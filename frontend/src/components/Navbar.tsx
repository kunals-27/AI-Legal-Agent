import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPage = location.pathname.replace('/', '') || 'home';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About', isAnchor: true },
    { id: 'features', label: 'Features', isAnchor: true },
    { id: 'legal-library', label: 'Legal Library' },
    { id: 'chatbot', label: 'Chatbot' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isAnchor && currentPage === 'home') {
      // Smooth scroll to section
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.isAnchor) {
      // Navigate to home page with anchor state
      navigate('/home', { state: { scrollTo: item.id } });
    } else {
      navigate(`/${item.id === 'home' ? '' : item.id}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 to-blue-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate('/home')}
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
              LegalEase AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'text-blue-400 bg-slate-800/50'
                    : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-blue-400 hover:bg-slate-800/30 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/50 rounded-lg mt-2 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'text-blue-400 bg-slate-700/50'
                      : 'text-slate-300 hover:text-blue-400 hover:bg-slate-700/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}