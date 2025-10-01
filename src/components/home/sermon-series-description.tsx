"use client";

import { useState } from "react";

interface SermonSeriesDescriptionProps {
  description: string;
}

export function SermonSeriesDescription({ description }: SermonSeriesDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150; // Character limit before showing "more..."
  
  const shouldTruncate = description.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? description : description.substring(0, maxLength);
  
  return (
    <div>
      <p className="text-white text-base md:text-lg leading-relaxed">
        {displayText}
        {shouldTruncate && !isExpanded && '...'}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/80 hover:text-white text-sm underline mt-2 transition-colors"
        >
          {isExpanded ? 'Show less' : 'more...'}
        </button>
      )}
    </div>
  );
}
