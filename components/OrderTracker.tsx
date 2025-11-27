import React from 'react';
import { Language, OrderType, CartItem } from '../types';
import { LABELS } from '../data/restaurantData';

interface OrderTrackerProps {
  orderId: string;
  language: Language;
  orderType?: OrderType; // Optional, allows overriding if known
  items?: CartItem[];
  total?: number;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orderId, language, orderType, items, total }) => {
  
  // 1. Simulate Order Type if not provided (Deterministic based on ID)
  // ID ends in: 0-3 -> Delivery, 4-6 -> Takeaway, 7-9 -> Dine-in
  const idNum = parseInt(orderId.replace(/\D/g, '')) || 0;
  
  let type: OrderType = 'Delivery';
  if (orderType) {
    type = orderType;
  } else {
    const typeMod = idNum % 10;
    if (typeMod >= 4 && typeMod <= 6) type = 'Takeaway';
    else if (typeMod >= 7) type = 'Dine-in';
  }

  // 2. Define Step Configurations
  type StepConfig = {
    key: string;
    icon: (active: boolean) => React.ReactNode;
  };

  const stepsDelivery: StepConfig[] = [
    { key: 'confirmed', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg> },
    { key: 'cooking', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg> },
    { key: 'onWay', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
    { key: 'delivered', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  ];

  const stepsTakeaway: StepConfig[] = [
    { key: 'confirmed', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg> },
    { key: 'cooking', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg> },
    { key: 'ready', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { key: 'pickedUp', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  const stepsDineIn: StepConfig[] = [
    { key: 'confirmed', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg> },
    { key: 'cooking', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg> },
    { key: 'serving', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
    { key: 'served', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg> },
  ];

  let steps = stepsDelivery;
  if (type === 'Takeaway') steps = stepsTakeaway;
  if (type === 'Dine-in') steps = stepsDineIn;

  // 3. Simulate Progress (0 to 3) based on ID
  const progressIndex = idNum % 4;
  const currentStatusKey = steps[progressIndex].key;
  const currentStatusLabel = LABELS[language][currentStatusKey as keyof (typeof LABELS)['en']];

  // 4. Colors
  const activeColor = 'text-orange-600 border-orange-600 bg-orange-50';
  const completedColor = 'text-white border-orange-500 bg-orange-500';
  const inactiveColor = 'text-gray-300 border-gray-200 bg-white';

  return (
    <div className="w-full min-w-0">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-3">
        <div className="flex flex-col items-start">
           <h4 className="font-extrabold pb-1 text-gray-800 text-xl leading-none tracking-tight">#{orderId}</h4>     
           <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide mb-1">
             {type === 'Delivery' && LABELS[language].deliveryType}
             {type === 'Takeaway' && LABELS[language].takeawayType}
             {type === 'Dine-in' && LABELS[language].dineInType}
           </span>
        </div>
        
        <div className="flex flex-col items-end">
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{LABELS[language].orderStatus}</span>
           <div className={`px-3 py-1 rounded-full font-bold text-xs border ${
              progressIndex === 3 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'
           }`}>
             {currentStatusLabel}
           </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between items-start mb-4 px-2">
        {/* Progress Bar Background */}
        <div className="absolute top-[14px] left-0 w-full h-[3px] bg-gray-100 -z-10 rounded-full mx-4" style={{ width: 'calc(100% - 32px)' }}></div>
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-[14px] left-0 h-[3px] bg-orange-500 -z-10 rounded-full mx-4 transition-all duration-1000 ease-out"
          style={{ width: `calc(${(progressIndex / (steps.length - 1)) * 100}% - 32px)` }}
        ></div>

        {steps.map((step, idx) => {
           const isCompleted = idx < progressIndex;
           const isCurrent = idx === progressIndex;
           
           return (
            <div key={idx} className="flex flex-col items-center relative group" style={{ width: '40px' }}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500
                  ${isCompleted ? completedColor : isCurrent ? activeColor : inactiveColor}
                  ${isCurrent ? 'ring-4 ring-orange-100 scale-110 shadow-sm' : ''}
                `}
              >
                {isCompleted ? (
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                   step.icon(isCurrent)
                )}
              </div>
              
              <span className={`absolute -bottom-6 text-[10px] font-bold whitespace-nowrap transition-colors duration-300 ${
                isCurrent ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {LABELS[language][step.key as keyof (typeof LABELS)['en']]}
              </span>

              {/* Pulse effect for current */}
              {isCurrent && (
                 <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-orange-400 opacity-20 animate-ping pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer Info based on Type */}
      <div className="mt-8 bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100/50">
        <div className={`p-2 rounded-full flex-shrink-0 ${progressIndex === 3 ? 'bg-green-100 text-green-600' : 'bg-white text-orange-500 shadow-sm'}`}>
           {type === 'Delivery' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
           {type === 'Takeaway' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
           {type === 'Dine-in' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="16" rx="2"/><path d="M2 10h20"/><path d="M8 2v6"/><path d="M16 2v6"/></svg>}
        </div>
        
        <div className="flex-1">
          {type === 'Delivery' && (
            <>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{LABELS[language].estimatedDelivery}</p>
               <p className="text-sm font-bold text-gray-800">35 - 45 {LABELS[language].minutes}</p>
            </>
          )}
          {type === 'Takeaway' && (
             <>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Instruction</p>
               <p className="text-sm font-bold text-gray-800">{LABELS[language].pickupCounter}</p>
             </>
          )}
          {type === 'Dine-in' && (
             <>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Service</p>
               <p className="text-sm font-bold text-gray-800">{LABELS[language].tableService}</p>
             </>
          )}
        </div>
      </div>

      {/* Ordered Items Summary */}
      {items && items.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 px-1 animate-fadeIn">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Order Items</p>
              <div className="space-y-2">
                  {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">{item.quantity}x</span>
                              <span className="font-medium text-gray-600 line-clamp-1">{language === 'bn' && item.name_bn ? item.name_bn : item.name}</span>
                          </div>
                          <span className="font-medium text-gray-900">৳{item.price * item.quantity}</span>
                      </div>
                  ))}
              </div>
              {total !== undefined && (
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-xs text-gray-700">{LABELS[language].totalAmount}</span>
                      <span className="font-extrabold text-sm text-orange-600">৳{total}</span>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};