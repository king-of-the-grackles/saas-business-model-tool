import { useState } from 'react';

export default function Tooltip({ content, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </span>
      {isVisible && (
        <div
          className="absolute z-50 left-1/2 bottom-full mb-2 -translate-x-1/2 px-3 py-2 text-xs leading-relaxed text-white bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl whitespace-normal w-56 animate-fade-in"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900/95 rotate-45" />
        </div>
      )}
    </span>
  );
}

// Info icon component for use with Tooltip
export function InfoIcon({ className = '' }) {
  return (
    <svg
      className={`w-3.5 h-3.5 text-gray-400 hover:text-brand-500 transition-colors ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
