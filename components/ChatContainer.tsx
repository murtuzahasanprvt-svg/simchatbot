
import React from 'react';
import { Message, MenuItem, CartItem, Language, OrderType, CustomerDetails } from '../types';
import { MessageBubble } from './MessageBubble';
import { ASSETS } from '../data/restaurantData';

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  onQuickReply: (option: string) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  cartItems: CartItem[];
  onCheckout: () => void;
  language: Language;
  onUpdateOrder: (type: OrderType, details: CustomerDetails) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isTyping, 
  onQuickReply, 
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  cartItems,
  onCheckout,
  language,
  onUpdateOrder
}) => {
  return (
    <div className="pl-2 pr-1 flex flex-col min-h-full justify-end">
      {/* Welcome timestamp or spacer could go here */}
      <div className="flex-1" />
      
      {messages.map((msg, index) => (
        <MessageBubble 
          key={msg.id} 
          message={msg} 
          isLast={index === messages.length - 1} 
          onQuickReply={onQuickReply}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          cartItems={cartItems}
          onCheckout={onCheckout}
          language={language}
          onUpdateOrder={onUpdateOrder}
        />
      ))}

      {isTyping && (
        <div className="flex w-full mb-4 justify-start animate-fadeIn">
          <div className="flex max-w-[85%] flex-row">
            <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex-shrink-0 mr-2 mt-1 overflow-hidden shadow-sm p-0.5">
               <img src={ASSETS.bot_avatar} alt="Bot" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
