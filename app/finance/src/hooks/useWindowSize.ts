"use client";

import { useState, useEffect, useMemo } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const screenSize = useMemo<"lg" | "md" | "sm">(() => {
    if (windowSize.width >= 1024) {
      return "lg";
    } else if (windowSize.width >= 768) {
      return "md";
    } else {
      return "sm"
    }
  }, [windowSize.width]);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

export default useWindowSize;
