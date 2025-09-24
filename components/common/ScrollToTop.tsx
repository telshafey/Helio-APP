// FIX: Import React to provide the React namespace for React.FC.
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls the main window (for public view)
    window.scrollTo(0, 0);
    
    // The admin dashboard has a specific scrollable main area
    const adminMainContent = document.querySelector('main.overflow-y-auto');
    if (adminMainContent) {
      adminMainContent.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;