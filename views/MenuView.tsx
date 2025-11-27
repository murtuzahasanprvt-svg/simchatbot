
import React, { useState, useMemo } from 'react';
import { MenuItem, Language, CartItem } from '../types';
import { MENU, LABELS } from '../data/restaurantData';

interface MenuViewProps {
  language: Language;
  cart: CartItem[];
  favorites: string[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onToggleFavorite: (itemId: string) => void;
  onGoToCheckout: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  language,
  cart,
  favorites,
  onAddToCart,
  onUpdateQuantity,
  onToggleFavorite,
  onGoToCheckout
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state for filtered items
  const filteredItems = useMemo(() => {
    let items: (MenuItem & { originalCategory: string })[] = [];
    
    // Flatten menu
    MENU.forEach(cat => {
      cat.items.forEach(item => {
        items.push({ ...item, originalCategory: cat.id });
      });
    });

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        (i.name_bn && i.name_bn.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (activeCategory !== 'all') {
      items = items.filter(i => i.originalCategory === activeCategory);
    }

    return items;
  }, [searchQuery, activeCategory]);

  const categories = [{ id: 'all', name: 'All', name_bn: 'সব' }, ...MENU];
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getQty = (id: string) => cart.find(i => i.id === id)?.quantity || 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 bg-white z-10 p-1 pb-1 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder={language === 'bn' ? 'খাবার খুঁজুন...' : 'Search for food...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-xl py-2 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
          />
          <svg className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 mt-4 pb-2 hide-scrollbar snap-x">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all snap-start
                ${activeCategory === cat.id 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-100 shadow-sm'}
              `}
            >
              {language === 'bn' ? cat.name_bn || cat.name : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-40 space-y-4">
        <h2 className="font-bold text-lg text-gray-800">
          {activeCategory === 'all' 
             ? (language === 'bn' ? 'জনপ্রিয় খাবার' : 'Popular Items') 
             : (language === 'bn' ? MENU.find(m => m.id === activeCategory)?.name_bn : MENU.find(m => m.id === activeCategory)?.name)}
        </h2>

        {/* 2-Column Vertical Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {filteredItems.map(item => {
            const qty = getQty(item.id);
            const isFav = favorites.includes(item.id);
            const name = language === 'bn' ? item.name_bn || item.name : item.name;

            return (
              <div key={item.id} className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex flex-col group h-full">
                {/* Image Section */}
                <div className="w-full aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden relative flex-shrink-0 mb-2.5">
                  <img src={item.image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <button 
                    onClick={() => onToggleFavorite(item.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
                
                {/* Content Section */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 leading-tight mb-1 text-sm line-clamp-2">{name}</h3>
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{language === 'bn' ? item.description_bn : item.description}</p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-3">
                    <span className="font-extrabold text-gray-900 text-sm">৳{item.price}</span>
                    
                    {qty === 0 ? (
                      <button 
                        onClick={() => onAddToCart(item)}
                        className="bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </button>
                    ) : (
                      <div className="flex items-center bg-gray-900 rounded-full h-7 px-1 shadow-md">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-full text-white flex items-center justify-center hover:text-orange-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <span className="text-white text-[10px] font-bold w-4 text-center">{qty}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-full text-white flex items-center justify-center hover:text-orange-300">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button - Moved up to avoid overlaps with sticky nav */}
      {cartCount > 0 && (
        <div className="absolute bottom-32 left-10 right-11 z-20 animate-scaleIn">
          <button 
            onClick={onGoToCheckout}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white p-2 rounded-xl shadow-xl shadow-orange-200 flex items-center justify-between active:scale-[0.98] transition-transform"
          >
             <div className="flex items-center gap-3">
               <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold backdrop-blur-sm">
                 {cartCount}
               </div>
               <div className="flex flex-col items-start leading-none gap-1">
                 <span className="text-xs opacity-90">{LABELS[language].viewCart}</span>
                 <span className="font-bold text-lg">৳{cartTotal}</span>
               </div>
             </div>
             <div className="flex items-center gap-1 font-bold text-sm">
                <span>{LABELS[language].checkout}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
             </div>
          </button>
        </div>
      )}
    </div>
  );
};
