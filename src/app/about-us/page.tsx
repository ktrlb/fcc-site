"use client";

import { useEffect, useRef } from "react";
import { AboutHero } from "@/components/about/about-hero";
import { MissionVision } from "@/components/about/mission-vision";
import { Staff } from "@/components/about/staff";
import { History } from "@/components/about/history";
import { LayLeadership } from "@/components/about/lay-leadership";

export default function AboutUsPage() {
  const hasScrolled = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        // Create an intersection observer to watch when the element is visible
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasScrolled.current) {
                // Element is visible and we haven't scrolled yet
                entry.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                hasScrolled.current = true;
                
                // Disconnect observer after scrolling
                if (observerRef.current) {
                  observerRef.current.disconnect();
                }
              }
            });
          },
          { threshold: 0.1 }
        );

        // Start observing the target element
        observerRef.current.observe(targetElement);

        // Fallback: scroll after a delay if observer doesn't trigger
        const fallbackTimeout = setTimeout(() => {
          if (!hasScrolled.current && targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            hasScrolled.current = true;
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        }, 1000);
      }
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <AboutHero />
      <MissionVision />
      <Staff />
      <LayLeadership />
      <History />
    </div>
  );
}
