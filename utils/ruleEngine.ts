
import { BotResponse, Message, UserRole, MessageType, Language, Order } from '../types';
import { BRANCHES, MENU, OPTIONS, OPTIONS_BN, RESTAURANT_NAME, RESTAURANT_NAME_BN, getLocalizedOption } from '../data/restaurantData';

// --- Fuzzy Matching Logic ---

// Calculate Levenshtein Distance between two strings
const getLevenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[b.length][a.length];
};

// Check if input matches any keyword with fuzzy tolerance
const isFuzzyMatch = (input: string, keywords: string[]): boolean => {
  const normalizedInput = input.toLowerCase().trim();
  const inputWords = normalizedInput.split(/[\s,.-]+/); // Split by common delimiters
  
  return keywords.some(keyword => {
    const k = keyword.toLowerCase();
    
    // 1. Direct includes (covers exact matches and substrings)
    if (normalizedInput.includes(k)) return true;
    
    // 2. Token-based fuzzy match
    return inputWords.some(word => {
      // Skip very short words for fuzzy matching to avoid noise
      if (word.length < 3 || k.length < 3) return false;
      
      const distance = getLevenshteinDistance(word, k);
      // Adaptive threshold: allow 1 typo for short words (4-5 chars), 2 for long (6+)
      const threshold = k.length > 5 ? 2 : 1;
      
      return distance <= threshold;
    });
  });
};

// --- Helpers ---

// Helper to get initial message
export const getInitialMessage = (lang: Language): Message => {
  const name = lang === 'bn' ? RESTAURANT_NAME_BN : RESTAURANT_NAME;
  const text = lang === 'bn' 
    ? `স্বাগতম ${name}-এ! 🍔\nআমি আপনার ভার্চুয়াল অ্যাসিস্ট্যান্ট। আজ আপনাকে কীভাবে সাহায্য করতে পারি?`
    : `Welcome to ${name}! 🍔\nI am your virtual assistant. How can I help you today?`;
  
  return {
    id: 'init',
    role: UserRole.BOT,
    type: MessageType.TEXT,
    text,
    options: [
      getLocalizedOption('MENU', lang), 
      getLocalizedOption('OFFERS', lang), 
      getLocalizedOption('TRACK', lang), 
      getLocalizedOption('BRANCHES', lang)
    ],
    timestamp: new Date(),
  };
};

// Helper to check if input matches a category name (using Fuzzy Match)
const findCategoryItems = (input: string) => {
  return MENU.find(cat => {
    // Combine all potential matching strings for this category
    const catKeywords = [
        cat.name, 
        cat.name_bn || '', 
        ...(cat.keywords || [])
    ].filter(Boolean);

    return isFuzzyMatch(input, catKeywords);
  })?.items || null;
};

// Helper to generate context-aware footer options
const getFooterOptions = (cartCount: number, lang: Language, additionalOptions: string[] = []) => {
  const options: string[] = [];

  // 1. Prioritize "View Cart" if user has items
  if (cartCount > 0) {
     options.push(getLocalizedOption('CART', lang));
  }

  // 2. Add additional options
  additionalOptions.forEach(opt => {
    if (opt in OPTIONS) {
      options.push(getLocalizedOption(opt as keyof typeof OPTIONS, lang));
    } else {
      options.push(opt);
    }
  });

  // 3. Ensure "Main Menu" (Home/Back) is available
  const backOption = getLocalizedOption('BACK', lang);
  const menuOption = getLocalizedOption('MENU', lang);
  
  if (!options.includes(backOption) && !options.includes(menuOption)) {
    options.push(backOption);
  }

  return Array.from(new Set(options));
};

// Helper to get all category names for quick replies
const getAllCategoryNames = (lang: Language) => {
  return MENU.map(cat => lang === 'bn' && cat.name_bn ? cat.name_bn : cat.name);
};

// --- Main Process Function ---

export const processUserMessage = (input: string, cartCount: number = 0, lang: Language = 'en', orders: Order[] = []): BotResponse => {
  const lowerInput = input.toLowerCase().trim();
  
  // Expanded Intent Keywords
  const intents = {
    greeting: [
        'hi', 'hello', 'hey', 'start', 'begin', 'welcome', 'hola', 'salam', 'assalamu', 
        'good morning', 'good evening', 'main menu', 'home', 'shuru', 'halo', 'kemon', 'hi there'
    ],
    menu: [
        'menu', 'food', 'eat', 'hungry', 'order', 'item', 'dish', 'list', 'option', 
        'catalog', 'browse', 'khabar', 'talika', 'khete', 'khabo', 'meal', 'lunch', 'dinner'
    ],
    cart: [
        'cart', 'basket', 'checkout', 'pay', 'confirm', 'finish', 'done', 'buy', 
        'purchase', 'jhuri', 'bag', 'check out', 'bill', 'total'
    ],
    track: [
        'track', 'status', 'where', 'late', 'update', 'trace', 'delivery', 
        'arrived', 'khobor', 'obostha', 'tracking', 'trace order'
    ],
    location: [
        'location', 'branch', 'address', 'place', 'map', 'shop', 'store', 'outlet',
        'thikana', 'jayga', 'kothay', 'area', 'zone', 'directions'
    ],
    offer: [
        'offer', 'promo', 'deal', 'discount', 'sale', 'save', 'cheap', 'free', 
        'coupon', 'voucher', 'char', 'kom', 'dam', 'special'
    ],
    help: [
        'help', 'support', 'contact', 'call', 'talk', 'human', 'agent', 'issue', 
        'problem', 'error', 'sahajjo', 'jogajog', 'number', 'phone', 'complain'
    ]
  };

  // Determine Intent using Fuzzy Match
  const isGreeting = isFuzzyMatch(lowerInput, intents.greeting);
  const isMenu = isFuzzyMatch(lowerInput, intents.menu);
  const isCart = isFuzzyMatch(lowerInput, intents.cart);
  const isTrack = isFuzzyMatch(lowerInput, intents.track);
  const isLocation = isFuzzyMatch(lowerInput, intents.location);
  const isOffer = isFuzzyMatch(lowerInput, intents.offer);
  const isHelp = isFuzzyMatch(lowerInput, intents.help);

  // --- 1. GREETINGS / HOME ---
  if (isGreeting) {
    return {
      text: lang === 'bn' 
        ? "হ্যালো! 👋 আমি আপনার অর্ডার নিতে প্রস্তুত। আপনি নির্দিষ্ট আইটেম যেমন **'বার্গার'** চাইতে পারেন বা আমাদের পুরো মেনু দেখতে পারেন।"
        : "Hello! 👋 I'm here to take your order. You can ask for specific items like **'Burgers'** or see our full menu.",
      options: getFooterOptions(cartCount, lang, ['MENU', 'OFFERS', 'TRACK']),
      type: MessageType.TEXT
    };
  }

  // --- 2. SPECIFIC CATEGORY REQUEST (Priority) ---
  const categoryItems = findCategoryItems(lowerInput);
  if (categoryItems) {
    const matchedCategory = MENU.find(c => c.items === categoryItems);
    const categoryName = lang === 'bn' ? matchedCategory?.name_bn : matchedCategory?.name;
    const otherCategories = getAllCategoryNames(lang).filter(c => c !== categoryName);

    return {
      text: lang === 'bn'
        ? `ঠিক আছে! এখানে আমাদের সুস্বাদু **${categoryName}** দেওয়া হলো:`
        : `Got it! Here are our delicious **${categoryName}**:`,
      type: MessageType.MENU_CAROUSEL,
      payload: categoryItems,
      options: getFooterOptions(cartCount, lang, otherCategories)
    };
  }

  // --- 3. ORDER TRACKING ---
  // Check for regex ID first
  const orderIdMatch = lowerInput.match(/#?(\d{4,})/);
  if (orderIdMatch) {
    const orderId = orderIdMatch[1];
    const foundOrder = orders.find(o => o.id === orderId);

    const payload = foundOrder ? {
        id: orderId,
        items: foundOrder.items,
        total: foundOrder.total,
        orderType: foundOrder.orderType,
        customerDetails: foundOrder.customerDetails // pass details if available
    } : {
        // Fallback simulation
        id: orderId,
        items: parseInt(orderId) % 2 === 0 
           ? [{ ...MENU[0].items[0], quantity: 2 }, { ...MENU[5].items[1], quantity: 1 }]
           : [{ ...MENU[0].items[1], quantity: 1 }, { ...MENU[3].items[0], quantity: 1 }],
        total: parseInt(orderId) % 2 === 0 ? 880 : 400
    };

    return {
      text: lang === 'bn'
        ? `অর্ডার #${orderId} এর ট্র্যাকিং তথ্য:`
        : `Tracking information for Order #${orderId}:`,
      type: MessageType.ORDER_TRACKING,
      payload: payload,
      options: getFooterOptions(cartCount, lang, ['BACK', 'HELP'])
    };
  }

  if (isTrack) {
    return {
      text: lang === 'bn'
        ? "আপনার অর্ডার ট্র্যাক করতে, অনুগ্রহ করে আপনার **অর্ডার আইডি** লিখুন (যেমন, #1234)।"
        : "To track your order, please enter your **Order ID** (e.g., #1234).",
      type: MessageType.TEXT,
      options: getFooterOptions(cartCount, lang, ['BACK', 'HELP'])
    };
  }

  // --- 4. CART & CHECKOUT ---
  if (isCart) {
    if (cartCount === 0) {
      return {
        text: lang === 'bn'
          ? "আপনার কার্ট বর্তমানে খালি! 🛒\n\nআমাদের সেরা সেলিং আইটেম বা অফারগুলি দেখতে চান?"
          : "Your cart is currently empty! 🛒\n\nCheck out our best sellers or current offers?",
        type: MessageType.TEXT,
        options: getFooterOptions(0, lang, ['MENU', 'OFFERS', 'TRACK'])
      };
    }
    
    return {
      text: lang === 'bn'
        ? "আপনি এখন পর্যন্ত যা বাছাই করেছেন:"
        : "Here is what you've picked so far:",
      type: MessageType.CART,
      options: getFooterOptions(cartCount, lang, ['CHECKOUT', 'MENU'])
    };
  }

  // --- 5. GENERAL FOOD MENU ---
  if (isMenu) {
    const allItems = MENU.flatMap(cat => cat.items);
    const categoryButtons = getAllCategoryNames(lang);
    
    return {
      text: lang === 'bn'
        ? "আমাদের মেনুটি দেখে নিন! 🍔🍕 এক্সপ্লোর করতে পাশে স্ক্রোল করুন।"
        : "Feast your eyes on our menu! 🍔🍕 Scroll sideways to explore.",
      type: MessageType.MENU_CAROUSEL,
      payload: allItems,
      options: getFooterOptions(cartCount, lang, [...categoryButtons, 'OFFERS'])
    };
  }

  // --- 6. LOCATIONS / BRANCHES ---
  // Specific branch match
  const matchedBranch = BRANCHES.find(b => 
    isFuzzyMatch(lowerInput, [b.name, b.name_bn || '', b.id])
  );

  if (matchedBranch) {
    const bName = lang === 'bn' && matchedBranch.name_bn ? matchedBranch.name_bn : matchedBranch.name;
    const bAddr = lang === 'bn' && matchedBranch.address_bn ? matchedBranch.address_bn : matchedBranch.address;
    const bHours = lang === 'bn' && matchedBranch.hours_bn ? matchedBranch.hours_bn : matchedBranch.hours;

    return {
      text: lang === 'bn'
         ? `📍 **${bName} শাখা**\n\nঠিকানা: ${bAddr}\nফোন: ${matchedBranch.phone}\nসময়সূচী: ${bHours}`
         : `📍 **${bName} Branch**\n\nAddress: ${bAddr}\nPhone: ${matchedBranch.phone}\nHours: ${bHours}`,
      type: MessageType.TEXT,
      options: getFooterOptions(cartCount, lang, ['BRANCHES'])
    };
  }

  if (isLocation) {
    const branchNames = BRANCHES.map(b => lang === 'bn' && b.name_bn ? b.name_bn : b.name);
    return {
      text: lang === 'bn'
        ? "আমাদের বেশ কয়েকটি শাখা রয়েছে। কোনটি আপনার সবচেয়ে কাছে?"
        : "We have several branches. Which one is closest to you?",
      type: MessageType.TEXT,
      options: getFooterOptions(cartCount, lang, branchNames) 
    };
  }

  // --- 7. OFFERS & PROMOS ---
  if (isOffer) {
    return {
      text: lang === 'bn'
        ? "🎉 **বর্তমান অফার:**\nপ্রতি মঙ্গলবার সব বার্গারে ১টি কিনলে ১টি ফ্রি!\n\n(শুধুমাত্র ডাইন-ইন এর জন্য প্রযোজ্য)"
        : "🎉 **Current Offer:**\nBuy 1 Get 1 Free on all Burgers every Tuesday!\n\n(Valid for dine-in only)",
      type: MessageType.TEXT,
      options: [lang === 'bn' ? "বার্গার অর্ডার করুন" : "Order Burgers Now", getLocalizedOption('MENU', lang)]
    };
  }

  // --- 8. CONTACT & HELP ---
  if (isHelp) {
     return {
      text: lang === 'bn'
        ? "আপনি আমাদের সাথে **+880 1711-000000** নম্বরে যোগাযোগ করতে পারেন অথবা **info@bengalbistro.com**-এ ইমেল করতে পারেন।\n\nআমাদের সাপোর্ট টিম সকাল ১০টা - রাত ১০টা পর্যন্ত উপলব্ধ।"
        : "You can reach us at **+880 1711-000000** or email us at **info@bengalbistro.com**.\n\nOur support team is available 10 AM - 10 PM.",
      type: MessageType.TEXT,
      options: getFooterOptions(cartCount, lang, ['BRANCHES'])
    };
  }

  // --- FALLBACK ---
  return {
    text: lang === 'bn'
      ? "দুঃখিত, আমি ঠিক বুঝতে পারিনি। 🤔\nআপনি কি মেনু দেখতে চান, নাকি অর্ডার ট্র্যাক করতে চান?"
      : "I'm sorry, I didn't quite catch that. 🤔\nWould you like to see the menu or track an order?",
    type: MessageType.TEXT,
    options: getFooterOptions(cartCount, lang, ['MENU', 'OFFERS', 'TRACK'])
  };
};
