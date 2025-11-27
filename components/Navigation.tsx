
import React from 'react';
import { ViewState, Language } from '../types';

interface NavigationProps {
  isOpen: boolean;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  onClose: () => void;
  language: Language;
  mode: 'modal' | 'sticky';
}

export const Navigation: React.FC<NavigationProps> = ({ 
  isOpen, 
  activeView, 
  onNavigate, 
  onClose,
  language,
  mode
}) => {
  const navItems: { id: ViewState; icon: React.ReactNode; label: string; label_bn: string }[] = [
    {
      id: 'CHAT',
      label: 'Chat',
      label_bn: 'চ্যাট',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    },
    {
      id: 'MENU',
      label: 'Menu',
      label_bn: 'মেনু',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
    },
    {
      id: 'ORDERS',
      label: 'Orders',
      label_bn: 'অর্ডার',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    },
    {
      id: 'FAVORITES',
      label: 'Favorites',
      label_bn: 'প্রিয়',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
    },
    {
      id: 'PROFILE',
      label: 'Profile',
      label_bn: 'প্রোফাইল',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    }
  ];

  const isSticky = mode === 'sticky';

  // Completely unmount/remove from DOM if in modal mode and closed.
  // This ensures absolutely zero layout interference or whitespace when hidden.
  if (!isSticky && !isOpen) return null;

  return (
    <>
      {/* Backdrop - Only for Modal mode */}
      {!isSticky && isOpen && (
        <div 
          className="absolute inset-0 bg-black/30 z-40 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Navigation Bar */}
      <div 
        className={`
          absolute bottom-0 left-0 right-0 z-50 
          bg-white rounded-t-3xl border-t border-gray-100 pb-safe
          ${!isSticky ? 'animate-slideUp shadow-[0_-10px_40px_rgba(0,0,0,0.15)]' : 'shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'}
        `}
      >
        {/* Handle for modal mode */}
        {!isSticky && (
           <div className="flex justify-center p-2" onClick={onClose}>
               <div className="w-12 h-1 bg-gray-200 rounded-full" />
           </div>
        )}
        
        <div className={`flex justify-between items-center px-4 pb-4 ${isSticky ? 'pt-4' : 'pt-2'}`}>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  // When navigating from the modal, we rely on the parent to close/change view
                }}
                className={`flex flex-col items-center gap-1.5 p-2 min-w-[64px] transition-all duration-200 rounded-xl ${
                   isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? '-translate-y-0.5' : ''}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, {
                    strokeWidth: isActive ? 3 : 2,
                    className: isActive ? "drop-shadow-sm" : ""
                  })}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                  {language === 'bn' ? item.label_bn : item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
