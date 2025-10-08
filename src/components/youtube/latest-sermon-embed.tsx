'use client';

import { useState, useEffect } from 'react';

interface LatestSermonEmbedProps {
  autoplay?: boolean;
  className?: string;
}

export function LatestSermonEmbed({ autoplay = false, className = '' }: LatestSermonEmbedProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const response = await fetch('/api/youtube/latest-sermon');
        if (response.ok) {
          const data = await response.json();
          setVideoId(data.videoId);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching latest sermon:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVideo();
  }, []);

  if (loading) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Loading latest sermon...</p>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Unable to load video</p>
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
      title="Latest Sermon"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      frameBorder="0"
      style={{
        border: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
}

