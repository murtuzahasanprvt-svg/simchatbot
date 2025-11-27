
import React from 'react';
import { MenuItem, CartItem, Language } from '../types';
import { LABELS } from '../data/restaurantData';

interface MenuCarouselProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  cartItems: CartItem[];
  onViewCart: () => void;
  language: Language;
}

export const MenuCarousel: React.FC<MenuCarouselProps> = ({ 
  items, 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveItem, 
  cartItems, 
  onViewCart,
  language
}) => {
  
  const getQuantity = (itemId: string) => {
    return cartItems.find(i => i.id === itemId)?.quantity || 0;
  };

  return (
    <div className="relative w-full flex flex-col">
      {/* Scrollable Container - Adjusted padding for full width layout */}
      <div className="flex overflow-x-auto gap-2.5 pt-1 pb-2 px-2 snap-x snap-mandatory scroll-pl-4 hide-scrollbar">
        {items.map((item) => {
          const qty = getQuantity(item.id);
          const name = language === 'bn' && item.name_bn ? item.name_bn : item.name;
          const description = language === 'bn' && item.description_bn ? item.description_bn : item.description;
          const category = language === 'bn' && item.category_bn ? item.category_bn : item.category;

          return (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-[55vw] sm:w-[220px] bg-white rounded-xl shadow-sm border border-gray-100 snap-start flex flex-col overflow-hidden group transition-all duration-300"
            >
              {/* Image Container - 1:1 Ratio */}
              <div className="aspect-square w-full relative overflow-hidden bg-gray-100">
                 <img 
                   src={item.image} 
                   alt={name} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                 
                 {/* Category Tag */}
                 <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/95 backdrop-blur-sm shadow-sm border border-white/50 flex items-center gap-1.5">
                    <span className="text-[8px] font-bold text-gray-800 uppercase tracking-wider leading-none">
                      {category}
                    </span>
                 </div>
              </div>
              
              {/* Content */}
              <div className="p-1.5 flex flex-col flex-1 relative bg-white">
                <div className="">
                   <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 font-display tracking-tight line-clamp-1">{name}</h3>
                   <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{description}</p>
                </div>
                
                <div className="mt-auto pt-1 flex items-center justify-between border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{LABELS[language].price}</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-md font-semibold text-orange-600">৳</span>
                      <span className="font-extrabold text-base text-gray-900">{item.price}</span>
                    </div>
                  </div>
                  
                  {qty > 0 ? (
                    // Quantity Controller
                    <div className="h-7 bg-green-500 rounded-full flex items-center shadow-sm shadow-green-200 animate-scaleIn">
                      <button 
                        onClick={() => qty === 1 ? onRemoveItem(item.id) : onUpdateQuantity(item.id, -1)}
                        className="w-7 h-full flex items-center justify-center text-white hover:bg-green-600 rounded-l-full transition-colors active:bg-green-700"
                        title="Decrease"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          {qty === 1 ? (
                             <>
                               <polyline points="3 6 5 6 21 6"></polyline>
                               <path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                             </>
                          ) : (
                             <line x1="5" y1="12" x2="19" y2="12"></line>
                          )}
                        </svg>
                      </button>
                      <span className="font-bold text-white text-[10px] w-3 text-center select-none">{qty}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-full flex items-center justify-center text-white hover:bg-green-600 rounded-r-full transition-colors active:bg-green-700"
                        title="Increase"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </button>
                    </div>
                  ) : (
                    // Add Button
                    <button
                      onClick={() => onAddToCart(item)}
                      className="h-7 px-2.5 rounded-full flex items-center gap-1.5 transition-all duration-300 font-bold text-[10px] shadow-sm active:scale-95 bg-gray-900 text-white shadow-gray-200 hover:bg-orange-600 hover:shadow-orange-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      <span>{LABELS[language].add}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* Spacer for scroll padding */}
        <div className="w-1 flex-shrink-0" />
      </div>
    </div>
  );
};