'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

interface SermonVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
}

export function LatestSermonVideo() {
  const [video, setVideo] = useState<SermonVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch('/api/youtube/latest-all-sermons');
        if (!response.ok) throw new Error('Failed to fetch video');
        const data = await response.json();
        setVideo(data);
      } catch (err) {
        console.error('Error loading sermon video:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, []);

  // Auto-fade overlay after 5 seconds
  useEffect(() => {
    if (!video) return;
    
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [video]);

  if (loading) {
    return (
      <Card className="!bg-indigo-900 border-0 shadow-none text-white max-w-4xl mx-auto mt-8" style={{ backgroundColor: 'rgb(49 46 129)' }}>
        <CardContent className="p-8 text-center">
          <p className="text-white text-lg">Loading latest sermon...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !video) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto mt-8">
      <div className="relative w-full overflow-hidden rounded-lg">
        <iframe
          ref={iframeRef}
          src={`${video.embedUrl}?autoplay=1&mute=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full rounded-lg"
          style={{ 
            border: 'none', 
            display: 'block', 
            verticalAlign: 'bottom', 
            aspectRatio: '16 / 9',
            height: '450px'
          }}
        />
          
          {/* Auto-fading Overlay */}
          <div 
            className={`absolute top-0 left-0 w-full flex items-center pointer-events-none transition-opacity duration-1000 px-8 rounded-t-lg ${showOverlay ? 'opacity-100' : 'opacity-0'}`}
            style={{ height: '100px', backgroundColor: 'rgb(49 46 129)' }}
          >
            <h3 className="text-3xl md:text-4xl font-bold font-serif italic text-white">
              A Recent Message from FCC
            </h3>
          </div>
      </div>
    </div>
  );
}

