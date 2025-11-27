import React from 'react';
import { CartItem, Language } from '../types';
import { LABELS } from '../data/restaurantData';

interface CartBubbleProps {
  items: CartItem[];
  onCheckout: () => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  language: Language;
}

export const CartBubble: React.FC<CartBubbleProps> = ({ 
  items, 
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
  language
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </div>
        <p className="text-gray-500 font-medium text-sm">{LABELS[language].emptyCart}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-[260px] max-w-full overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-base">{LABELS[language].yourCart}</h3>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {items.reduce((acc, i) => acc + i.quantity, 0)} {LABELS[language].items}
        </span>
      </div>
      
      <div className="max-h-auto overflow-y-auto py-3 space-y-4 custom-scrollbar pr-1">
        {items.map((item) => {
          const name = language === 'bn' && item.name_bn ? item.name_bn : item.name;
          return (
            <div key={item.id} className="flex gap-3 group items-start">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm mt-1">
                 <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
              
              {/* Details & Controls */}
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight pr-2">{name}</span>
                    <span className="font-bold text-sm text-gray-900 whitespace-nowrap">৳{item.price * item.quantity}</span>
                 </div>
                 
                 <div className="flex items-center justify-between mt-2">
                   {/* Quantity Control */}
                   <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-orange-600 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-orange-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </button>
                   </div>
  
                   {/* Remove Button */}
                   <button 
                     onClick={() => onRemoveItem(item.id)}
                     className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     title="Remove Item"
                   >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                   </button>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 mt-2 pt-4">
        <div className="flex justify-between items-center mb-5">
          <span className="text-sm font-medium text-gray-500">{LABELS[language].totalAmount}</span>
          <span className="font-extrabold text-2xl text-gray-900">৳{total}</span>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300/50 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 active:scale-95 flex justify-center items-center gap-2 group relative overflow-hidden"
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ animationDuration: '1s' }} />
          
          <span className="relative z-10">{LABELS[language].checkout}</span>
          <svg className="relative z-10 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};