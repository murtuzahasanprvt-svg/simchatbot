
import React, { useState, KeyboardEvent } from 'react';
import { Language } from '../types';
import { LABELS } from '../data/restaurantData';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  language: Language;
  onToggleNav: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, language, onToggleNav }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="px-3 py-2 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-30 relative">
      <div className="flex items-center gap-2">
        {/* Navigation Toggle Button */}
        <button
          onClick={onToggleNav}
          className="p-3.5 rounded-full bg-gray-50 text-gray-500 border border-transparent hover:border-gray-200 hover:bg-white hover:text-orange-600 hover:shadow-sm transition-all duration-200 active:scale-95 flex-shrink-0 group"
          title={LABELS[language].menu}
          aria-label="Open Navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
             <line x1="3" y1="12" x2="21" y2="12"></line>
             <line x1="3" y1="6" x2="21" y2="6"></line>
             <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Input Field */}
        <div className="flex-1 flex items-center bg-gray-50 rounded-full border border-gray-200 px-1 py-1 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-300 transition-all shadow-inner">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-base outline-none text-gray-700 placeholder-gray-400 min-w-0"
            placeholder={LABELS[language].typeMessage}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2.5 rounded-full transition-all duration-300 m-0.5 flex-shrink-0 flex items-center justify-center ${
              input.trim() 
                ? 'bg-gradient-to-tr from-orange-600 to-orange-500 text-white shadow-md shadow-orange-200 hover:shadow-lg hover:scale-105 active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send Message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={input.trim() ? 'ml-0.5' : ''}>
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
