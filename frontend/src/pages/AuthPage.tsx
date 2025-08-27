import React, { useState } from 'react';
import AuthCarousel from '../components/AuthCarousel';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const handleToggleAuthMode = () => setIsLogin(prev => !prev);

  return (
    <div className="min-h-screen flex">
      {/* Left Half - Carousel */}
      <div className="hidden lg:flex lg:w-1/2">
        <AuthCarousel />
      </div>

      {/* Right Half - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
        <AuthForm isLogin={isLogin} onToggle={handleToggleAuthMode} />
      </div>
    </div>
  );
};

export default AuthPage;