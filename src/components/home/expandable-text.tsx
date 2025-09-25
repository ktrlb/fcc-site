"use client";

import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  collapsedChars?: number;
  className?: string;
  toggleClassName?: string;
}

export function ExpandableText({
  text,
  collapsedChars = 180,
  className,
  toggleClassName,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTruncatable = text && text.length > collapsedChars;
  const visibleText = isExpanded || !isTruncatable
    ? text
    : `${text.slice(0, collapsedChars).trim()}…`;

  function handleToggle() {
    setIsExpanded((prev) => !prev);
  }

  return (
    <div>
      <p className={className}>{visibleText}</p>
      {isTruncatable && (
        <button
          type="button"
          onClick={handleToggle}
          className={toggleClassName ?? "mt-1 text-sm text-indigo-700 hover:text-indigo-800 underline"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}




