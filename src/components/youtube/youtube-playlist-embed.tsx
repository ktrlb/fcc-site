'use client';

import { useState, useEffect } from 'react';

interface YouTubePlaylistEmbedProps {
  apiEndpoint: string; // e.g., '/api/youtube/latest-sermon' or '/api/youtube/latest-modern'
  autoplay?: boolean;
  className?: string;
}

export function YouTubePlaylistEmbed({ apiEndpoint, autoplay = false, className = '' }: YouTubePlaylistEmbedProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (response.ok) {
          const data = await response.json();
          setVideoId(data.videoId);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVideo();
  }, [apiEndpoint]);

  if (loading) {
    return (
      <div className={`bg-gray-800/50 flex items-center justify-center ${className}`}>
        <p className="text-white/70 text-sm">Loading video...</p>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className={`bg-gray-800/50 flex items-center justify-center ${className}`}>
        <p className="text-white/70 text-sm">Unable to load video</p>
      </div>
    );
  }

  const embedParams = autoplay 
    ? `autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=0&end=0&enablejsapi=1`
    : `rel=0&modestbranding=1`;

  return (
    <iframe
      className={className}
      src={`https://www.youtube.com/embed/${videoId}?${embedParams}`}
      title="YouTube Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      frameBorder="0"
      style={{
        border: 'none',
        width: '100%',
        height: '100%',
        display: 'block',
        verticalAlign: 'bottom',
      }}
    />
  );
}

