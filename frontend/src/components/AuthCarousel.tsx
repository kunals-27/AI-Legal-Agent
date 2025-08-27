import React, { useState, useEffect } from 'react';
import { Scale, FileText, Building } from 'lucide-react';

const carouselSlides = [
  {
    tagline: "Law, at the speed of thought.",
    subtext: "Ask complex questions, get cited answers.",
    icon: Scale,
    gradient: "from-blue-600 to-slate-800"
  },
  {
    tagline: "From statutes to sense.",
    subtext: "Clear summaries grounded in real sources.",
    icon: FileText,
    gradient: "from-slate-700 to-blue-800"
  },
  {
    tagline: "Evidence first.",
    subtext: "Every answer backed by documents.",
    icon: Building,
    gradient: "from-slate-800 to-blue-900"
  }
];

const AuthCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {carouselSlides.map((slide, index) => {
        const Icon = slide.icon;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 transform translate-x-0'
                : index < currentSlide
                ? 'opacity-0 transform -translate-x-full'
                : 'opacity-0 transform translate-x-full'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-br ${slide.gradient} relative overflow-hidden`}>
              {/* Particles Background */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-12 text-white">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <Icon className="w-16 h-16 mb-8 mx-auto opacity-90" />
                </div>
                
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  {slide.tagline}
                </h2>
                
                <p className="text-xl opacity-90 leading-relaxed max-w-md">
                  {slide.subtext}
                </p>
              </div>

              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        );
      })}

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthCarousel;