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
    // Function to handle scrolling to hash
    const scrollToHash = (hash: string) => {
      const targetElement = document.querySelector(hash) as HTMLElement;
      if (targetElement) {
        // Prevent any default scroll behavior
        window.scrollTo(0, 0);
        
        // Get the element's position
        const elementTop = targetElement.offsetTop;
        
        // Smooth scroll to the element
        window.scrollTo({
          top: elementTop - 100, // Offset for header
          behavior: 'smooth'
        });
      }
    };

    // Handle initial page load with hash
    const hash = window.location.hash;
    if (hash) {
      // Delay to ensure page is fully loaded
      setTimeout(() => {
        scrollToHash(hash);
      }, 500);
    }

    // Handle hash changes (from navigation)
    const handleHashChange = (e: HashChangeEvent) => {
      e.preventDefault();
      const newHash = window.location.hash;
      if (newHash) {
        setTimeout(() => {
          scrollToHash(newHash);
        }, 100);
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Also listen for popstate events
    const handlePopState = () => {
      const newHash = window.location.hash;
      if (newHash) {
        setTimeout(() => {
          scrollToHash(newHash);
        }, 100);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
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
