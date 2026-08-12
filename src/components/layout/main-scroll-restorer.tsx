"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MainScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    let frameId: number;
    let attempts = 0;

    const resetScrolls = () => {
      // Reset the main scrolling container
      const mainContent = document.getElementById("main-scroll-container");
      if (mainContent) {
        mainContent.scrollTo(0, 0);
      }
      
      // Also reset the parent flex-col in case Next.js focus management scrolled the overflow-hidden container
      const layoutCol = document.getElementById("layout-flex-col");
      if (layoutCol) {
        layoutCol.scrollTo(0, 0);
      }
      
      const dashboardRoot = document.getElementById("dashboard-root");
      if (dashboardRoot) {
        dashboardRoot.scrollTo(0, 0);
      }
      
      // VIGOROUS RESET: Next.js focus management overrides overflow-hidden on body/html
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);

      // Next.js scroll restoration is asynchronous, so we must enforce this for a few frames
      if (attempts < 5) {
        attempts++;
        frameId = requestAnimationFrame(resetScrolls);
      }
    };

    frameId = requestAnimationFrame(resetScrolls);

    return () => cancelAnimationFrame(frameId);
  }, [pathname]);

  return null;
}
