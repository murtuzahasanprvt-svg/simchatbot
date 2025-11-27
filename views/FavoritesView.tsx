
import React from 'react';
import { MenuItem, Language, CartItem } from '../types';
import { MENU, LABELS } from '../data/restaurantData';

interface FavoritesViewProps {
  favorites: string[];
  language: Language;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFavorite: (id: string) => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ 
  favorites, 
  language, 
  onAddToCart,
  onRemoveFavorite,
  cart,
  onUpdateQuantity
}) => {
  // Flatten menu to find items by ID
  const allItems = MENU.flatMap(cat => cat.items);
  const favoriteItems = allItems.filter(item => favorites.includes(item.id));
  
  const getQty = (id: string) => cart.find(i => i.id === id)?.quantity || 0;

  if (favoriteItems.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50">
         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
         </div>
         <h2 className="font-bold text-xl text-gray-800 mb-2">{language === 'bn' ? 'কোন প্রিয় খাবার নেই' : 'No Favorites Yet'}</h2>
         <p className="text-gray-500 text-sm max-w-[200px]">
           {language === 'bn' ? 'মেনু থেকে আপনার পছন্দের খাবারগুলোতে লাইক দিন।' : 'Heart items from the menu to see them here.'}
         </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col">
       <div className="bg-white p-4 shadow-sm z-10 sticky top-0">
        <h1 className="font-bold text-xl text-gray-800">{language === 'bn' ? 'প্রিয় খাবার' : 'Favorites'}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
         <div className="grid grid-cols-1 gap-4">
           {favoriteItems.map(item => {
              const qty = getQty(item.id);
              const name = language === 'bn' ? item.name_bn || item.name : item.name;

              return (
                 <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                       <img src={item.image} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="font-bold text-gray-800 truncate">{name}</h3>
                       <p className="text-sm font-bold text-orange-600 mt-1">৳{item.price}</p>
                       
                       <div className="flex justify-between items-center mt-2">
                          {qty === 0 ? (
                            <button 
                                onClick={() => onAddToCart(item)}
                                className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all"
                            >
                                {LABELS[language].add}
                            </button>
                          ) : (
                             <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100">
                                <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-2 py-1 text-gray-600 hover:text-orange-600">-</button>
                                <span className="text-xs font-bold px-1">{qty}</span>
                                <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-2 py-1 text-gray-600 hover:text-orange-600">+</button>
                             </div>
                          )}

                          <button 
                             onClick={() => onRemoveFavorite(item.id)}
                             className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                          </button>
                       </div>
                    </div>
                 </div>
              )
           })}
         </div>
      </div>
    </div>
  );
};
