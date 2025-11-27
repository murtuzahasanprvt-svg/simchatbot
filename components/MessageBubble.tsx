import React, { useState } from 'react';
import { Message, UserRole, MessageType, MenuItem, CartItem, Language, OrderType, CustomerDetails } from '../types';
import { QuickReplies } from './QuickReplies';
import { MenuCarousel } from './MenuCarousel';
import { CartBubble } from './CartBubble';
import { OrderTracker } from './OrderTracker';
import { LABELS, RESTAURANT_NAME, RESTAURANT_NAME_BN, ASSETS } from '../data/restaurantData';

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
  onQuickReply: (option: string) => void;
  onAddToCart?: (item: MenuItem) => void;
  onUpdateQuantity?: (itemId: string, delta: number) => void;
  onRemoveItem?: (itemId: string) => void;
  cartItems?: CartItem[];
  onCheckout?: () => void;
  language: Language;
  onUpdateOrder?: (type: OrderType, details: CustomerDetails) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onQuickReply, 
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  cartItems,
  onCheckout,
  language,
  onUpdateOrder
}) => {
  const isBot = message.role === UserRole.BOT;

  // Calculate cart totals for the "View Cart" button
  const totalItems = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const totalPrice = cartItems ? cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        <span dangerouslySetInnerHTML={{ 
          __html: line
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/_(.*?)_/g, '<i>$1</i>') 
        }} />
        <br />
      </React.Fragment>
    ));
  };

  // Internal component for the editing form
  // We can reuse this logic, but for inline editing in ORDER_SUMMARY, we'll embed similar logic directly
  // to share state more easily or refactor the form to be reusable.
  // For simplicity within this file, we'll define a RenderForm function.

  // Special handling for Menu Carousel to allow full-width breakout
  if (message.type === MessageType.MENU_CAROUSEL) {
    return (
      <div className="flex flex-col w-full mb-6 animate-fadeIn">
        {/* Top Section: Avatar + Text Bubble */}
        <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
          <div className={`flex max-w-[92%] sm:max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
            
            {/* Avatar */}
            <div className="flex-shrink-0">
              {isBot ? (
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex-shrink-0 mr-2 sm:mr-3 mt-0.5 overflow-hidden shadow-sm p-0.5">
                   <img src={ASSETS.bot_avatar} alt="Bot" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex-shrink-0 ml-2 sm:ml-3 mt-0.5 overflow-hidden shadow-sm p-0.5">
                   <img src={ASSETS.user_avatar} alt="User" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Text Bubble */}
            <div className={`flex flex-col min-w-0 flex-1 ${isBot ? 'items-start' : 'items-end'}`}>
              <div
                className={`px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm relative w-fit ${
                  isBot
                    ? 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100'
                    : 'bg-orange-600 text-white rounded-2xl rounded-tr-none'
                }`}
              >
                <div className={`text-base leading-relaxed ${!isBot ? 'font-medium' : ''}`}>
                  {formatText(message.text)}
                </div>
              </div>
              
              <span className={`text-[10px] text-gray-300 mt-1.5 font-medium ${isBot ? 'text-left ml-1' : 'text-right mr-1'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Section - Full Width Breakout */}
        {/* Negative margin corrects for ChatContainer's padding (p-4) to span full width */}
        <div className="mt-1 -mx-4 w-[calc(100%+2rem)]">
           <MenuCarousel 
              items={message.payload} 
              onAddToCart={onAddToCart!} 
              onUpdateQuantity={onUpdateQuantity!}
              onRemoveItem={onRemoveItem!}
              cartItems={cartItems || []}
              onViewCart={() => onQuickReply('View Cart')}
              language={language}
           />
        </div>

        {/* Options Section */}
        {isBot && message.options && message.options.length > 0 && (
           <div className="mt-3 ml-1 sm:ml-2 animate-fadeIn">
              <QuickReplies options={message.options} onSelect={onQuickReply} />
           </div>
        )}

        {/* New Cart Summary Button - Placed AFTER Quick Replies */}
        {totalItems > 0 && (
           <div className="mt-4 px-1 animate-fadeIn">
              <button
                onClick={() => onQuickReply('View Cart')}
                className="w-full bg-gray-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg shadow-gray-200 active:scale-[0.99] transition-transform group border border-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-gray-300">{totalItems} {LABELS[language].itemsInCart}</span>
                    <span className="text-xl font-bold text-white">৳{totalPrice}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                  <span>{LABELS[language].viewCart}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </button>
           </div>
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (message.type) {
      case MessageType.CART:
        return (
          <div className="w-full">
            <div className={`mb-2 text-base ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 mt-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <CartBubble 
                items={cartItems || []} 
                onCheckout={onCheckout!} 
                onUpdateQuantity={onUpdateQuantity!}
                onRemoveItem={onRemoveItem!}
                language={language}
              />
            </div>
          </div>
        );
      
      case MessageType.ORDER_SUMMARY:
        // Use local state to handle inline editing toggle
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isEditing, setIsEditing] = useState(false);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [currentDetails, setCurrentDetails] = useState<CustomerDetails>(message.payload.details);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [currentType, setCurrentType] = useState<OrderType>(message.payload.type);
        
        // Form states
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [editType, setEditType] = useState<OrderType>(currentType);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [editName, setEditName] = useState(currentDetails.name || '');
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [editPhone, setEditPhone] = useState(currentDetails.phone || '');
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [editAddress, setEditAddress] = useState(currentDetails.address || '');
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [editPickup, setEditPickup] = useState(currentDetails.pickupTime || '');
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [editTable, setEditTable] = useState(currentDetails.tableNumber || '');

        const { total, labels, timeSlots, tables } = message.payload;
        
        const handleStartEdit = () => {
            setEditType(currentType);
            setEditName(currentDetails.name || '');
            setEditPhone(currentDetails.phone || '');
            setEditAddress(currentDetails.address || '');
            setEditPickup(currentDetails.pickupTime || '');
            setEditTable(currentDetails.tableNumber || '');
            setIsEditing(true);
        };

        const handleSaveEdit = () => {
             const newDetails: CustomerDetails = {
                 name: editName,
                 phone: editPhone
             };
             if (editType === 'Delivery') newDetails.address = editAddress;
             if (editType === 'Takeaway') newDetails.pickupTime = editPickup;
             if (editType === 'Dine-in') newDetails.tableNumber = editTable;

             setCurrentType(editType);
             setCurrentDetails(newDetails);
             setIsEditing(false);
             onUpdateOrder?.(editType, newDetails);
        };

        if (isEditing) {
            return (
                <div className="w-full">
                   <div className={`mb-2 text-base ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>
                   <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mt-2 space-y-4 animate-scaleIn">
                        {/* Order Type */}
                        <div className="space-y-1">
                           <label className="text-xs font-bold text-gray-500 uppercase">{labels.type}</label>
                           <div className="flex gap-2">
                              {(['Dine-in', 'Takeaway', 'Delivery'] as OrderType[]).map((t) => (
                                 <button
                                   key={t}
                                   onClick={() => setEditType(t)}
                                   className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                                       editType === t 
                                       ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                                       : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                   }`}
                                 >
                                    {t}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Name & Phone */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">{labels.name}</label>
                            <input 
                               type="text" 
                               value={editName} 
                               onChange={(e) => setEditName(e.target.value)}
                               className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none"
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">{labels.phone}</label>
                            <input 
                               type="tel" 
                               value={editPhone} 
                               onChange={(e) => setEditPhone(e.target.value)}
                               className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none"
                            />
                        </div>

                        {/* Dynamic Third Field */}
                        {editType === 'Delivery' && (
                            <div className="space-y-1 animate-fadeIn">
                                <label className="text-xs font-bold text-gray-500 uppercase">{labels.address}</label>
                                <textarea 
                                   value={editAddress} 
                                   onChange={(e) => setEditAddress(e.target.value)}
                                   rows={2}
                                   className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none resize-none"
                                />
                            </div>
                        )}

                        {editType === 'Takeaway' && (
                            <div className="space-y-1 animate-fadeIn">
                                <label className="text-xs font-bold text-gray-500 uppercase">{labels.pickup}</label>
                                <select
                                   value={editPickup}
                                   onChange={(e) => setEditPickup(e.target.value)}
                                   className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none"
                                >
                                    <option value="" disabled>Select Time</option>
                                    {timeSlots && timeSlots.map((t: string) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {editType === 'Dine-in' && (
                            <div className="space-y-1 animate-fadeIn">
                                <label className="text-xs font-bold text-gray-500 uppercase">{labels.table}</label>
                                <select
                                   value={editTable}
                                   onChange={(e) => setEditTable(e.target.value)}
                                   className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none"
                                >
                                    <option value="" disabled>Select Table</option>
                                    {tables && tables.map((t: string) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                             <button 
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-bold text-sm hover:bg-white hover:border-gray-400 transition-all"
                             >
                                {labels.cancel}
                             </button>
                             <button 
                                onClick={handleSaveEdit}
                                className="flex-[2] bg-gray-900 text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95"
                             >
                                {labels.save}
                             </button>
                        </div>
                   </div>
                </div>
            );
        }

        return (
          <div className="w-full">
             <div className={`mb-2 text-base ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>
             
             <div className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 mt-2">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50 to-white p-4 border-b border-orange-100/50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </div>
                      <span className="font-bold text-gray-800 text-sm">{labels.title}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{LABELS[language].totalAmount}</span>
                      <span className="font-extrabold text-lg text-orange-600 leading-none">৳{total}</span>
                   </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{labels.type}</p>
                         <p className="text-sm font-semibold text-gray-800">{currentType}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{labels.name}</p>
                         <p className="text-sm font-semibold text-gray-800">{currentDetails.name}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{labels.phone}</p>
                         <p className="text-sm font-semibold text-gray-800">{currentDetails.phone}</p>
                      </div>
                   </div>

                   {currentDetails.address && (
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{labels.address}</p>
                             <p className="text-sm font-semibold text-gray-800 leading-snug">{currentDetails.address}</p>
                          </div>
                       </div>
                   )}

                   {currentDetails.pickupTime && (
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{labels.time}</p>
                             <p className="text-sm font-semibold text-gray-800">{currentDetails.pickupTime}</p>
                          </div>
                       </div>
                   )}

                   {currentDetails.tableNumber && (
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="16" rx="2"/><path d="M2 10h20"/><path d="M8 2v6"/><path d="M16 2v6"/></svg>
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{labels.table}</p>
                             <p className="text-sm font-semibold text-gray-800">{currentDetails.tableNumber}</p>
                          </div>
                       </div>
                   )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button 
                       onClick={handleStartEdit}
                       className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-600 font-bold text-sm hover:bg-white hover:border-gray-400 transition-all active:scale-[0.98]"
                    >
                       {labels.editBtn}
                    </button>
                    <button 
                       onClick={() => onQuickReply(labels.placeBtn)}
                       className="flex-[2] py-2.5 px-4 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-md shadow-gray-300 hover:bg-gray-800 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                       <span>{labels.placeBtn}</span>
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
             </div>
          </div>
        );

      case MessageType.TABLE_SELECT:
        return (
          <div className="w-full">
            <div className={`mb-2 text-base ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>
            <div className="mt-2 p-1 bg-gray-50 rounded-xl border border-gray-200 shadow-sm relative">
                <div className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                </div>
                <select 
                    className="w-full p-2.5 pl-10 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-gray-700 font-medium transition-all appearance-none"
                    onChange={(e) => onQuickReply(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled className="text-gray-400">
                      {language === 'bn' ? 'টেবিল নির্বাচন করুন...' : 'Select a Table...'}
                    </option>
                    {message.payload && message.payload.map((t: string) => (
                        <option key={t} value={t} className="py-1">
                          {t}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div className="px-2 pb-1 pt-2">
                   <p className="text-[10px] text-gray-400 text-center">
                     {language === 'bn' ? 'অর্ডার করতে একটি টেবিল নির্বাচন করুন' : 'Select a table to proceed'}
                   </p>
                </div>
            </div>
          </div>
        );

      case MessageType.TIME_SELECT:
        return (
          <div className="w-full">
            <div className={`mb-2 text-base ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>
            <div className="mt-2 p-1 bg-gray-50 rounded-xl border border-gray-200 shadow-sm relative">
                <div className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <select 
                    className="w-full p-2.5 pl-10 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 text-gray-700 font-medium transition-all appearance-none"
                    onChange={(e) => onQuickReply(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled className="text-gray-400">
                      {language === 'bn' ? 'পিকআপের সময় নির্বাচন করুন...' : 'Select Pickup Time...'}
                    </option>
                    {message.payload && message.payload.map((t: string) => (
                        <option key={t} value={t} className="py-1">
                          {t}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div className="px-2 pb-1 pt-2">
                   <p className="text-[10px] text-gray-400 text-center">
                     {language === 'bn' ? 'পিকআপের জন্য একটি সময় বেছে নিন' : 'Choose a time for pickup'}
                   </p>
                </div>
            </div>
          </div>
        );
      
      case MessageType.ORDER_FORM:
        // Fallback or deprecated if we move everything to inline.
        // But kept for compatibility if any old logic uses it.
        return (
           <div className="w-full">
               <div className={`mb-2 text-base ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>
               {/* Reuse or copy logic if needed, but current user flow prefers inline edit in ORDER_SUMMARY */}
           </div>
        );

      case MessageType.ORDER_TRACKING:
        return (
          <div className="w-full">
             <div className={`mb-2 text-base ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>
             <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 mt-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <OrderTracker 
                orderId={message.payload.id} 
                language={language}
                orderType={message.payload.orderType}
                items={message.payload.items}
                total={message.payload.total}
              />
             </div>
          </div>
        );

      case MessageType.RECEIPT:
        return (
          <div className="w-full">
            <div className={`mb-2 text-base ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>
            
            {/* Realistic Receipt Design */}
            <div className="relative bg-white pt-6 pb-2 px-5 mt-3 shadow-md w-full max-w-[280px] sm:max-w-[300px] mx-auto text-gray-800 font-mono text-xs overflow-hidden">
               {/* Top jagged edge simulated with CSS or simple border */}
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-gray-200 to-white opacity-20"></div>

               <div className="text-center mb-4 border-b-2 border-dashed border-gray-300 pb-3">
                 <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden">
                   <img src={ASSETS.logo} className="w-full h-full object-contain p-1" alt="" />
                 </div>
                 <div className="font-bold text-lg mb-1">{language === 'bn' ? RESTAURANT_NAME_BN : RESTAURANT_NAME}</div>
                 <div className="text-gray-500 mb-0.5">{LABELS[language].orderStatus} #{message.payload.id}</div>
                 <div className="text-gray-500 mb-2">{new Date().toLocaleString()}</div>
                 
                 {/* New Customer Info Section */}
                 {message.payload.customerDetails && (
                    <div className="text-left bg-gray-50 p-2 rounded text-[10px] space-y-0.5 border border-gray-100">
                      <div className="flex justify-between">
                         <span className="text-gray-500">Type:</span>
                         <span className="font-bold uppercase">{message.payload.orderType}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-500">Name:</span>
                         <span className="font-medium">{message.payload.customerDetails.name}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-500">Phone:</span>
                         <span className="font-medium">{message.payload.customerDetails.phone}</span>
                      </div>
                      {/* Optional fields based on type */}
                      {message.payload.customerDetails.tableNumber && (
                        <div className="flex justify-between">
                           <span className="text-gray-500">Table:</span>
                           <span className="font-medium">{message.payload.customerDetails.tableNumber}</span>
                        </div>
                      )}
                      {message.payload.customerDetails.pickupTime && (
                        <div className="flex justify-between">
                           <span className="text-gray-500">Pickup:</span>
                           <span className="font-medium">{message.payload.customerDetails.pickupTime}</span>
                        </div>
                      )}
                      {message.payload.customerDetails.address && (
                        <div className="flex justify-between items-start">
                           <span className="text-gray-500 whitespace-nowrap mr-2">Addr:</span>
                           <span className="font-medium text-right leading-tight">{message.payload.customerDetails.address}</span>
                        </div>
                      )}
                    </div>
                 )}
               </div>

               <div className="space-y-2 mb-4">
                 {message.payload.items.map((it: CartItem) => {
                   const itemName = language === 'bn' && it.name_bn ? it.name_bn : it.name;
                   return (
                     <div key={it.id} className="flex justify-between items-end">
                       <div className="flex flex-col">
                         <span className="font-bold text-gray-700">{itemName}</span>
                         <span className="text-gray-400 text-[10px]">{it.quantity} x {it.price}</span>
                       </div>
                       <span className="font-medium">৳{it.price * it.quantity}</span>
                     </div>
                   );
                 })}
               </div>

               <div className="border-t-2 border-dashed border-gray-300 pt-3 mb-4">
                 <div className="flex justify-between text-base font-bold">
                   <span>{LABELS[language].totalAmount}</span>
                   <span>৳{message.payload.total}</span>
                 </div>
               </div>
               
               <div className="text-center text-[10px] text-gray-400 mb-2">
                 {language === 'bn' ? "আমাদের সাথে থাকার জন্য ধন্যবাদ!" : "Thank you for dining with us!"}
                 <br />
                 {language === 'bn' ? "দয়া করে এই রশিদটি সংরক্ষণ করুন।" : "Please keep this receipt."}
               </div>

               {/* Bottom jagged edge simulation */}
               <div 
                 className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100"
                 style={{ 
                   maskImage: 'linear-gradient(45deg, transparent 33%, #000 33%, #000 66%, transparent 66%)',
                   maskSize: '10px 20px',
                   WebkitMaskImage: 'linear-gradient(45deg, transparent 33%, #000 33%, #000 66%, transparent 66%)',
                   WebkitMaskSize: '10px 10px'
                 }}
               ></div>
            </div>
          </div>
        );

      case MessageType.TEXT:
      default:
        return <div className={`text-base leading-relaxed ${!isBot ? 'font-medium' : ''}`}>{formatText(message.text)}</div>;
    }
  };

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
      <div 
        className={`flex max-w-[92%] sm:max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}
      >
        
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isBot ? (
             <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex-shrink-0 mr-2 sm:mr-3 mt-0.5 overflow-hidden shadow-sm p-0.5">
               <img src={ASSETS.bot_avatar} alt="Bot" className="w-full h-full object-cover" />
             </div>
          ) : (
             <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex-shrink-0 ml-2 sm:ml-3 mt-0.5 overflow-hidden shadow-sm p-0.5">
               <img src={ASSETS.user_avatar} alt="User" className="w-full h-full object-cover" />
             </div>
          )}
        </div>

        {/* Message Bubble Container */}
        <div className={`flex flex-col min-w-0 flex-1 ${isBot ? 'items-start' : 'items-end'}`}>
          <div
            className={`px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm relative w-fit ${
              isBot
                ? 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100'
                : 'bg-orange-600 text-white rounded-2xl rounded-tr-none shadow-md'
            }`}
          >
            {renderContent()}
          </div>
          
          {/* Timestamp */}
          <span className={`text-[10px] text-gray-300 mt-1.5 font-medium ${isBot ? 'text-left ml-1' : 'text-right mr-1'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Render Options if available */}
          {isBot && message.options && message.options.length > 0 && (
            <div className="mt-3">
              <QuickReplies options={message.options} onSelect={onQuickReply} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};