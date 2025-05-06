
import React, { useEffect } from 'react';

const ScrollReveal: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      
      const windowHeight = window.innerHeight;
      const elementVisible = 100; // Reduced to make animations appear sooner
      
      reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        } else {
          element.classList.remove('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    setTimeout(() => {
      handleScroll();
    }, 300); // Small delay to ensure elements are properly loaded
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return null;
};

export default ScrollReveal;
