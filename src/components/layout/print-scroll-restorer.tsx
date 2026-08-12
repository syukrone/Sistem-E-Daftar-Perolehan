"use client";

import { useEffect } from "react";

export function PrintScrollRestorer() {
  useEffect(() => {
    const handleAfterPrint = () => {
      // Force scroll to top after printing finishes
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Force a reflow to fix any stuck fixed elements in Chrome
      document.body.style.display = 'none';
      void document.body.offsetHeight; 
      document.body.style.display = '';
    };

    window.addEventListener("afterprint", handleAfterPrint);
    
    // Also reset on mount just in case
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return null;
}
