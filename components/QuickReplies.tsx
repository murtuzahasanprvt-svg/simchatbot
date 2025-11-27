import React from 'react';

interface QuickRepliesProps {
  options: string[];
  onSelect: (option: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 py-2">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          style={{ animationDelay: `${index * 50}ms` }}
          className="
            opacity-0 animate-scaleIn
            bg-white text-gray-700 font-semibold text-sm 
            px-6 py-2.5 rounded-full 
            shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
            hover:shadow-[0_12px_20px_-6px_rgba(234,88,12,0.25),0_4px_8px_-2px_rgba(234,88,12,0.1)]
            hover:-translate-y-1 hover:text-orange-600 hover:bg-white
            active:scale-95 active:shadow-sm active:translate-y-0
            transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
            whitespace-nowrap
            outline-none ring-0 focus:ring-2 focus:ring-orange-200/50
            border border-transparent
          "
        >
          {option}
        </button>
      ))}
    </div>
  );
};