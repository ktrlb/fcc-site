'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Image {
  id: string;
  name: string;
  description: string | null;
  fileUrl: string;
}

interface ImageCarouselProps {
  category: string;
  title?: string;
  autoPlay?: boolean;
  interval?: number;
}

export function ImageCarousel({ 
  category, 
  title, 
  autoPlay = false, 
  interval = 5000 
}: ImageCarouselProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch(`/api/images/${category}`);
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        setImages(data);
      } catch (err) {
        console.error('Error loading images:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [category]);

  useEffect(() => {
    if (!autoPlay || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading images...</p>
      </div>
    );
  }

  if (error || images.length === 0) {
    return null; // Don't show anything if there are no images
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
      )}
      
      <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100">
        {/* Current Image */}
        <img
          src={images[currentIndex].fileUrl}
          alt={images[currentIndex].name}
          className="w-full h-full object-cover"
        />

        {/* Image Caption */}
        {images[currentIndex].description && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
            <p className="text-sm md:text-base">{images[currentIndex].description}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <p className="text-center text-sm text-gray-600 mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      )}
    </div>
  );
}



