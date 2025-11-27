import React from 'react';
import { RESTAURANT_NAME, RESTAURANT_NAME_BN, LABELS, ASSETS } from '../data/restaurantData';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onToggleLanguage }) => {
  return (
    <div className="bg-orange-600 text-white p-4 shadow-md flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm p-1.5">
          <img 
            src={ASSETS.logo} 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">
            {language === 'bn' ? RESTAURANT_NAME_BN : RESTAURANT_NAME}
          </h1>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-orange-100">{LABELS[language].online}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleLanguage}
          className="text-xs font-bold bg-orange-700/50 hover:bg-orange-700 px-2.5 py-1.5 rounded-lg border border-orange-500/30 transition-colors"
        >
          {language === 'en' ? 'বাং' : 'EN'}
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="text-orange-100 hover:text-white transition-colors"
          title={LABELS[language].restart}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 21h5v-5"/>
          </svg>
        </button>
      </div>
    </div>
  );
};