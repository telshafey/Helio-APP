import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
    mainContentRef?: React.RefObject<HTMLElement>;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ mainContentRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls the main window (for public view)
    window.scrollTo(0, 0);
    
    // Scrolls the admin dashboard's main content area via ref
    if (mainContentRef?.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [pathname, mainContentRef]);

  return null;
};

export default ScrollToTop;
