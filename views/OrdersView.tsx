
import React from 'react';
import { Order, Language } from '../types';
import { OrderTracker } from '../components/OrderTracker';

interface OrdersViewProps {
  orders: Order[];
  language: Language;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, language }) => {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50">
         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
         </div>
         <h2 className="font-bold text-xl text-gray-800 mb-2">{language === 'bn' ? 'কোন অর্ডার নেই' : 'No Past Orders'}</h2>
         <p className="text-gray-500 text-sm max-w-[200px]">
           {language === 'bn' ? 'আপনি এখনও কোন খাবার অর্ডার করেননি।' : 'Looks like you haven\'t ordered anything yet.'}
         </p>
      </div>
    );
  }

  // Sort orders by date descending
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="bg-white p-4 shadow-sm z-10 sticky top-0">
        <h1 className="font-bold text-xl text-gray-800">{language === 'bn' ? 'অর্ডার ইতিহাস' : 'Order History'}</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {sortedOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400">{new Date(order.date).toLocaleDateString()} • {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-md font-bold">৳{order.total}</span>
             </div>
             <OrderTracker 
               orderId={order.id} 
               language={language} 
               orderType={order.orderType}
               items={order.items}
               total={order.total}
             />
          </div>
        ))}
      </div>
    </div>
  );
};
