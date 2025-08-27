import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layouts = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Add smooth scroll behavior and loading state
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Set loaded after a brief delay to show the transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      clearTimeout(timer);
    };
  }, []);

  // Parallax scroll effect for decorative elements
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  return (
    <main className='bg-gradient-to-br from-[#F8F5F2] via-[#EADBC8]/30 to-[#D4A373]/10 
      w-full flex flex-col min-h-screen relative'>
      
      {/* Premium decorative top border */}
      <div className="h-1 bg-gradient-to-r from-[#3A2E2E] via-[#D4A373] to-[#3A2E2E] 
        shadow-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
          animate-pulse"></div>
      </div>
      
      {/* Background decorative elements - Reduced size */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Smaller floating orbs */}
        <div className="absolute top-40 left-20 w-64 h-64 bg-[#D4A373]/3 rounded-full blur-3xl 
          animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-[#3A2E2E]/2 rounded-full blur-3xl 
          animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-[#EADBC8]/4 rounded-full blur-3xl 
          animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
      </div>

      <Header />
      
      {/* Content wrapper - No extra padding */}
      <div className={`flex-grow flex flex-col relative transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Subtle side decorative elements */}
        <div className="hidden xl:block fixed left-0 top-1/2 z-0 pointer-events-none">
          <div 
            className="w-16 h-64 opacity-3 bg-gradient-to-b from-[#D4A373] via-transparent to-[#3A2E2E] 
              rounded-r-full transition-transform duration-1000 ease-out"
            style={{
              transform: `translateY(calc(-50% + ${scrollY * 0.05}px))`
            }}
          >
          </div>
        </div>
        
        <div className="hidden xl:block fixed right-0 top-1/2 z-0 pointer-events-none">
          <div 
            className="w-16 h-64 opacity-3 bg-gradient-to-b from-[#3A2E2E] via-transparent to-[#D4A373] 
              rounded-l-full transition-transform duration-1000 ease-out"
            style={{
              transform: `translateY(calc(-50% + ${scrollY * -0.05}px))`
            }}
          >
          </div>
        </div>
        
        {/* Main content container - Compact spacing */}
        <div className="w-full relative z-10">
          {/* Main content */}
          <div className="relative">
            <Outlet />
          </div>
        </div>
        
        {/* Floating scroll to top button */}
        <div className="fixed bottom-8 right-8 z-30 hidden lg:block">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-[#3A2E2E]/80 backdrop-blur-sm rounded-full 
              flex items-center justify-center text-[#EADBC8] 
              hover:bg-[#3A2E2E] hover:scale-110 transition-all duration-300 
              shadow-lg hover:shadow-xl hover:shadow-[#3A2E2E]/30
              border border-[#D4A373]/30 hover:border-[#D4A373]/60
              focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <Footer />
      
      {/* Premium decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-[#3A2E2E] via-[#D4A373] to-[#3A2E2E] 
        shadow-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
          animate-pulse"></div>
      </div>
    </main>
  );
};

export default Layouts;