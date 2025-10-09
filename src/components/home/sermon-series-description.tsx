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
      <p className="text-white text-base md:text-lg leading-[1.25]">
        {displayText}
        {shouldTruncate && !isExpanded && '... '}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/80 hover:text-white text-sm underline transition-colors ml-1"
          >
            {isExpanded ? 'Show less' : 'more'}
          </button>
        )}
      </p>
    </div>
  );
}
