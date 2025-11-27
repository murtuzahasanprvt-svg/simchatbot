
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { InputArea } from './components/InputArea';
import { Navigation } from './components/Navigation';
import { processUserMessage, getInitialMessage } from './utils/ruleEngine';
import { Message, UserRole, MenuItem, CartItem, MessageType, Order, Language, OrderType, CustomerDetails, ViewState, UserProfile } from './types';
import { OPTIONS, OPTIONS_BN, CHECKOUT_STEPS, TABLES, TABLES_BN } from './data/restaurantData';

// Import Views
import { MenuView } from './views/MenuView';
import { OrdersView } from './views/OrdersView';
import { FavoritesView } from './views/FavoritesView';
import { ProfileView } from './views/ProfileView';

type CheckoutStep = 'IDLE' | 'TYPE' | 'NAME' | 'PHONE' | 'EXTRA' | 'CONFIRM' | 'EDIT';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ViewState>('CHAT');
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  // Data State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Checkout State Machine
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('IDLE');
  const [orderDraft, setOrderDraft] = useState<{type: OrderType | null, details: Partial<CustomerDetails>}>({ type: null, details: {} });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat and profile on load
  useEffect(() => {
    setMessages([getInitialMessage(language)]);
    
    // Load profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentView === 'CHAT') {
      const timeout = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [messages, isTyping, cart, currentView]);

  // Handle Language Switch
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'bn' : 'en';
    setLanguage(newLang);
  };

  // --- Handlers ---

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: UserRole.USER,
      type: MessageType.TEXT,
      text: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Intercept for Checkout Flow
    if (checkoutStep !== 'IDLE' && checkoutStep !== 'EDIT') {
      setTimeout(() => {
        handleCheckoutFlow(text);
      }, 600);
      return;
    }

    // 2b. Block input during EDIT state (handled by form UI)
    if (checkoutStep === 'EDIT') {
      setIsTyping(false);
      return; 
    }

    // 3. Simulate Bot Processing (Normal)
    setTimeout(() => {
      // Pass cart count, language AND orders to rule engine
      const response = processUserMessage(text, cart.length, language, orders);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: UserRole.BOT,
        type: response.type || MessageType.TEXT,
        text: response.text,
        options: response.options,
        timestamp: new Date(),
        payload: response.payload,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 500); 
  };

  // Helper to generate time slots
  const generateTimeSlots = (lang: Language): string[] => {
    const slots: string[] = [];
    const now = new Date();
    
    // Round up to next 15 min + add 15 min prep buffer
    const minutes = now.getMinutes();
    const nextQuarter = Math.ceil(minutes / 15) * 15;
    const start = new Date(now);
    start.setMinutes(nextQuarter + 15); 
    start.setSeconds(0);
    start.setMilliseconds(0);

    const end = new Date(now);
    end.setHours(23, 0, 0, 0); // Assume 11 PM close

    let current = start;
    while (current < end) {
      const timeString = current.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
      });
      slots.push(timeString);
      current = new Date(current.getTime() + 15 * 60000); // Add 15 mins
    }
    
    // Fallback for late night
    if (slots.length === 0) return lang === 'bn' ? ['যত দ্রুত সম্ভব', 'আগামীকাল সকাল ১০:০০'] : ['ASAP', 'Tomorrow 10:00 AM'];
    
    return slots;
  };

  const sendOrderSummary = (type: OrderType, details: CustomerDetails) => {
    const stepData = CHECKOUT_STEPS[language];
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const timeSlots = generateTimeSlots(language);
    const tables = language === 'bn' ? TABLES_BN : TABLES;

    const summaryMsg: Message = {
        id: Date.now().toString() + '_summary',
        role: UserRole.BOT,
        type: MessageType.ORDER_SUMMARY,
        text: stepData.confirmTitle,
        payload: {
            type: type,
            details: details,
            total: cartTotal,
            timeSlots: timeSlots,
            tables: tables,
            labels: {
                title: language === 'bn' ? 'অর্ডারের বিবরণ' : 'Order Review',
                type: language === 'bn' ? 'অর্ডারের ধরন' : 'Order Type',
                name: language === 'bn' ? 'নাম' : 'Name',
                phone: language === 'bn' ? 'ফোন' : 'Phone',
                address: language === 'bn' ? 'ঠিকানা' : 'Address',
                time: language === 'bn' ? 'সময়' : 'Pickup Time',
                table: language === 'bn' ? 'টেবিল নং' : 'Table No.',
                placeBtn: stepData.placeOrder,
                editBtn: stepData.editOrder,
                save: stepData.updateOrder,
                cancel: stepData.cancelEdit,
                pickup: language === 'bn' ? 'পিকআপের সময়' : 'Pickup Time',
            }
        },
        timestamp: new Date(),
    };
    setMessages(prev => [...prev, summaryMsg]);
    setIsTyping(false);
  };

  const sendTimeSelectionMsg = () => {
    const stepData = CHECKOUT_STEPS[language];
    const timeSlots = generateTimeSlots(language);
    const botMsg: Message = {
        id: Date.now().toString(),
        role: UserRole.BOT,
        type: MessageType.TIME_SELECT,
        text: stepData.enterPickup,
        payload: timeSlots,
        timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const sendTableSelectionMsg = () => {
    const stepData = CHECKOUT_STEPS[language];
    const tableOptions = language === 'bn' ? TABLES_BN : TABLES;
    const botMsg: Message = {
        id: Date.now().toString(),
        role: UserRole.BOT,
        type: MessageType.TABLE_SELECT,
        text: stepData.enterTable,
        payload: tableOptions,
        timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  // --- Checkout Flow Logic ---
  const initCheckout = () => {
    // If not in chat view, switch to chat
    if (currentView !== 'CHAT') {
        setCurrentView('CHAT');
    }

    if (cart.length === 0) {
        // Just send a message if cart is empty instead of starting flow
        handleSendMessage("Checkout"); 
        return;
    }

    setCheckoutStep('TYPE');
    setOrderDraft({ type: null, details: {} });

    const stepData = CHECKOUT_STEPS[language];
    
    const botMsg: Message = {
      id: Date.now().toString() + '_ask_type',
      role: UserRole.BOT,
      type: MessageType.TEXT,
      text: stepData.selectType,
      options: [stepData.confirmDineIn, stepData.confirmTakeaway, stepData.confirmDelivery],
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const cancelCheckout = () => {
    setCheckoutStep('IDLE');
    setOrderDraft({ type: null, details: {} });
    
    const botMsg: Message = {
      id: Date.now().toString() + '_cancel',
      role: UserRole.BOT,
      type: MessageType.TEXT,
      text: language === 'bn' ? "চেকআউট বাতিল করা হয়েছে। আপনি মেনু ব্রাউজ করতে পারেন।" : "Checkout canceled. You can browse the menu.",
      options: language === 'bn' ? [OPTIONS_BN.MENU, OPTIONS_BN.CART] : [OPTIONS.MENU, OPTIONS.CART],
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleUpdateOrder = (newType: OrderType, newDetails: CustomerDetails) => {
    setOrderDraft({ type: newType, details: newDetails });
    setCheckoutStep('CONFIRM');
  };

  const handleCheckoutFlow = (input: string) => {
    const stepData = CHECKOUT_STEPS[language];
    const lowerInput = input.toLowerCase();

    // Allow cancelling
    if (input === stepData.cancel || input.toLowerCase() === 'cancel' || input.toLowerCase() === 'বাতিল') {
      cancelCheckout();
      return;
    }

    if (checkoutStep === 'TYPE') {
        let type: OrderType | null = null;
        if (input === stepData.confirmDineIn || lowerInput.includes('dine') || lowerInput.includes('ডাইন')) type = 'Dine-in';
        else if (input === stepData.confirmTakeaway || lowerInput.includes('take') || lowerInput.includes('টেক')) type = 'Takeaway';
        else if (input === stepData.confirmDelivery || lowerInput.includes('home') || lowerInput.includes('delivery') || lowerInput.includes('ডেলিভারি')) type = 'Delivery';

        if (type) {
            setOrderDraft(prev => ({ ...prev, type: type }));

            // AUTO-FILL Check
            if (userProfile) {
                const draftDetails: Partial<CustomerDetails> = {
                    name: userProfile.name,
                    phone: userProfile.phone
                };
                
                // Try to fill address if available and relevant
                if (type === 'Delivery' && userProfile.address) {
                    draftDetails.address = userProfile.address;
                }

                setOrderDraft(prev => ({ ...prev, type, details: draftDetails }));

                // Determine Next Step Logic based on Order Type and Available Info
                let nextStep: CheckoutStep = 'EXTRA';
                let messageSent = false;

                if (type === 'Delivery') {
                    if (draftDetails.address) {
                        nextStep = 'CONFIRM';
                        sendOrderSummary(type, draftDetails as CustomerDetails);
                        messageSent = true;
                    } else {
                        nextStep = 'EXTRA'; // Logic in EXTRA handles address input for Delivery
                        sendBotMessage(stepData.enterAddress);
                        messageSent = true;
                    }
                } else if (type === 'Takeaway') {
                    nextStep = 'EXTRA'; // Logic in EXTRA handles time input for Takeaway
                    sendTimeSelectionMsg();
                    messageSent = true;
                } else { // Dine-in
                    nextStep = 'EXTRA'; // Logic in EXTRA handles table input for Dine-in
                    sendTableSelectionMsg();
                    messageSent = true;
                }
                
                setCheckoutStep(nextStep);
                if (messageSent) return;
            }

            setCheckoutStep('NAME');
            sendBotMessage(stepData.enterName);
        } else {
            sendBotMessage(stepData.invalidType, [stepData.confirmDineIn, stepData.confirmTakeaway, stepData.confirmDelivery]);
        }
    } 
    else if (checkoutStep === 'NAME') {
        setOrderDraft(prev => ({ ...prev, details: { ...prev.details, name: input } }));
        setCheckoutStep('PHONE');
        sendBotMessage(stepData.enterPhone);
    } 
    else if (checkoutStep === 'PHONE') {
        setOrderDraft(prev => ({ ...prev, details: { ...prev.details, phone: input } }));
        setCheckoutStep('EXTRA');
        
        if (orderDraft.type === 'Delivery') {
            sendBotMessage(stepData.enterAddress);
        } else if (orderDraft.type === 'Takeaway') {
            sendTimeSelectionMsg();
        } else { // Dine-in
            sendTableSelectionMsg();
        }
    } 
    else if (checkoutStep === 'EXTRA') {
        const finalDetails = { ...orderDraft.details };
        if (orderDraft.type === 'Delivery') finalDetails.address = input;
        else if (orderDraft.type === 'Takeaway') finalDetails.pickupTime = input;
        else if (orderDraft.type === 'Dine-in') finalDetails.tableNumber = input;
        
        setOrderDraft(prev => ({ ...prev, details: finalDetails }));
        setCheckoutStep('CONFIRM');
        sendOrderSummary(orderDraft.type!, finalDetails as CustomerDetails);
    } 
    else if (checkoutStep === 'CONFIRM') {
        if (input === stepData.placeOrder) {
            finalizeOrder(orderDraft.type!, orderDraft.details as CustomerDetails);
        } else {
             sendBotMessage(stepData.invalidConfirm);
        }
    }
  };

  const sendBotMessage = (text: string, options?: string[]) => {
    const botMsg: Message = {
        id: Date.now().toString(),
        role: UserRole.BOT,
        type: MessageType.TEXT,
        text,
        options,
        timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const finalizeOrder = (type: OrderType, details: CustomerDetails) => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save/Update Profile
    const updatedProfile: UserProfile = {
      name: details.name,
      phone: details.phone,
      address: type === 'Delivery' ? details.address : (userProfile?.address || undefined),
      memberSince: userProfile?.memberSince || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      ordersCount: (userProfile?.ordersCount || 0) + 1
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total,
      status: 'Preparing',
      date: new Date(),
      orderType: type,
      customerDetails: details
    };

    setOrders(prev => [...prev, newOrder]);
    
    const receiptText = language === 'bn' 
      ? `অর্ডার #${orderId} নিশ্চিত হয়েছে! 🎉\nআমরা আপনার খাবার তৈরি করছি।`
      : `Order #${orderId} Confirmed! 🎉\nWe are preparing your food.`;

    const receiptMsg: Message = {
      id: Date.now().toString() + 'rec',
      role: UserRole.BOT,
      type: MessageType.RECEIPT,
      text: receiptText,
      timestamp: new Date(),
      payload: newOrder,
      options: language === 'bn' ? [OPTIONS_BN.TRACK, OPTIONS_BN.MENU] : [OPTIONS.TRACK, OPTIONS.MENU]
    };

    setMessages(prev => [...prev, receiptMsg]);
    setCart([]);
    setCheckoutStep('IDLE');
    setOrderDraft({ type: null, details: {} });
    setIsTyping(false);
  };

  const handleQuickReply = (option: string) => {
    if (option === "Order Burgers Now" || option === "বার্গার অর্ডার করুন") {
      handleSendMessage(language === 'bn' ? "বার্গা‌র" : "Burgers");
    } else if (option === OPTIONS.CHECKOUT || option === OPTIONS_BN.CHECKOUT) {
      initCheckout();
    } else if (option === OPTIONS.CART || option === OPTIONS_BN.CART) {
       // If user clicks "View Cart" inside Chat
       handleSendMessage("View Cart");
    } else {
      handleSendMessage(option);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const handleToggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // View Switcher logic
  const renderContent = () => {
    switch(currentView) {
      case 'CHAT':
        return (
          <>
            <ChatContainer 
              messages={messages} 
              isTyping={isTyping} 
              onQuickReply={handleQuickReply}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              cartItems={cart}
              onCheckout={initCheckout}
              language={language}
              onUpdateOrder={handleUpdateOrder}
            />
            <div ref={messagesEndRef} />
          </>
        );
      case 'MENU':
        return (
          <MenuView 
             language={language}
             cart={cart}
             favorites={favorites}
             onAddToCart={handleAddToCart}
             onUpdateQuantity={handleUpdateQuantity}
             onToggleFavorite={handleToggleFavorite}
             onGoToCheckout={() => {
                setCurrentView('CHAT');
                // Trigger checkout flow via bot processing
                handleSendMessage("Checkout");
             }}
          />
        );
      case 'ORDERS':
        return <OrdersView orders={orders} language={language} />;
      case 'FAVORITES':
        return (
          <FavoritesView 
             favorites={favorites} 
             language={language} 
             onAddToCart={handleAddToCart}
             onRemoveFavorite={handleToggleFavorite}
             cart={cart}
             onUpdateQuantity={handleUpdateQuantity}
          />
        );
      case 'PROFILE':
        return <ProfileView language={language} userProfile={userProfile} />;
      default:
        return null;
    }
  };

  // Determine Navigation Mode: Modal (Chat) vs Sticky (Others)
  const navMode = currentView === 'CHAT' ? 'modal' : 'sticky';
  // If sticky, it's always "open" (visible). If modal, it depends on isNavOpen.
  const isNavVisible = navMode === 'sticky' ? true : isNavOpen;

  return (
    <div className="flex justify-center items-center w-full h-full sm:bg-gray-100 sm:p-4 fixed inset-0">
      <div className="w-full sm:max-w-md bg-white sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden flex flex-col h-full sm:h-[85vh] border-0 sm:border border-gray-200 relative">
        <Header language={language} onToggleLanguage={toggleLanguage} />
        
        <div className="flex-1 overflow-y-auto bg-slate-50 relative scroll-smooth">
          {renderContent()}
        </div>

        {/* Input Area is only visible in Chat View */}
        {currentView === 'CHAT' && (
           <InputArea 
              onSendMessage={handleSendMessage} 
              language={language} 
              onToggleNav={() => setIsNavOpen(true)}
           />
        )}

        <Navigation 
           isOpen={isNavVisible} 
           activeView={currentView}
           onNavigate={(view) => {
             setCurrentView(view);
             setIsNavOpen(false); // Close modal if used in Chat view
           }}
           onClose={() => setIsNavOpen(false)}
           language={language}
           mode={navMode}
        />
      </div>
    </div>
  );
};

export default App;