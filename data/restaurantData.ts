

import { Branch, MenuCategory, Language } from '../types';

export const RESTAURANT_NAME = "Bengal Bistro";
export const RESTAURANT_NAME_BN = "বেঙ্গল বিস্ট্রো";

export const ASSETS = {
  logo: "https://cdn-icons-png.flaticon.com/512/2276/2276931.png",
  bot_avatar: "https://cdn-icons-png.flaticon.com/512/9364/9364065.png",
  user_avatar: "https://cdn-icons-png.flaticon.com/512/456/456212.png"
};

export const TABLES = [
  "Table 1 (Window)", "Table 2 (Window)", "Table 3", "Table 4", 
  "Table 5 (Center)", "Table 6 (Center)", "Table 7", "Table 8", 
  "Table 9 (Family)", "Table 10 (Family)"
];

export const TABLES_BN = [
  "টেবিল ১ (জানালা)", "টেবিল ২ (জানালা)", "টেবিল ৩", "টেবিল ৪", 
  "টেবিল ৫ (মাঝখানে)", "টেবিল ৬ (মাঝখানে)", "টেবিল ৭", "টেবিল ৮", 
  "টেবিল ৯ (ফ্যামিলি)", "টেবিল ১০ (ফ্যামিলি)"
];

export const LABELS = {
  en: {
    price: "Price",
    add: "Add",
    viewCart: "View Cart",
    yourCart: "Your Cart",
    items: "Items",
    totalAmount: "Total Amount",
    checkout: "Proceed to Checkout",
    orderStatus: "Order Status",
    estimatedDelivery: "Est. Time",
    minutes: "min",
    typeMessage: "Type your message...",
    emptyCart: "Your cart is empty",
    itemsInCart: "items in cart",
    restart: "Restart Chat",
    online: "Online",
    receipt: "Receipt",
    confirmed: "Confirmed",
    preparing: "Cooking",
    outForDelivery: "On Way",
    delivered: "Delivered",
    cooking: "Cooking",
    onWay: "On Way",
    menu: "Menu",
    ready: "Ready",
    pickedUp: "Picked Up",
    serving: "Serving",
    served: "Served",
    pickupCounter: "Pickup at Counter",
    tableService: "Table Service",
    deliveryType: "Home Delivery",
    takeawayType: "Takeaway",
    dineInType: "Dine-in"
  },
  bn: {
    price: "মূল্য",
    add: "যোগ",
    viewCart: "কার্ট দেখুন",
    yourCart: "আপনার কার্ট",
    items: "আইটেম",
    totalAmount: "সর্বমোট",
    checkout: "অর্ডার নিশ্চিত করুন",
    orderStatus: "অর্ডারের অবস্থা",
    estimatedDelivery: "সময়",
    minutes: "মিনিট",
    typeMessage: "আপনার বার্তা লিখুন...",
    emptyCart: "আপনার কার্ট খালি",
    itemsInCart: "টি আইটেম",
    restart: "চ্যাট রিস্টার্ট করুন",
    online: "সক্রিয়",
    receipt: "রশিদ",
    confirmed: "গৃহীত",
    preparing: "রান্না হচ্ছে",
    outForDelivery: "পথে আছে",
    delivered: "সম্পন্ন",
    cooking: "রান্না হচ্ছে",
    onWay: "পথে আছে",
    menu: "মেনু",
    ready: "প্রস্তুত",
    pickedUp: "নেওয়া হয়েছে",
    serving: "পরিবেশন হচ্ছে",
    served: "পরিবেশিত",
    pickupCounter: "কাউন্টার থেকে নিন",
    tableService: "টেবিল সার্ভিস",
    deliveryType: "হোম ডেলিভারি",
    takeawayType: "টেকওয়ে",
    dineInType: "ডাইন-ইন"
  }
};

export const CHECKOUT_STEPS = {
  en: {
    selectType: "How would you like to receive your order?",
    enterName: "Please enter your Name:",
    enterPhone: "Please enter your Phone Number:",
    enterAddress: "Please enter your Delivery Address:",
    enterPickup: "Please select a Pickup Time:",
    enterTable: "Please select your Table Number from the list below:",
    confirmDineIn: "Dine-in",
    confirmTakeaway: "Takeaway",
    confirmDelivery: "Home Delivery",
    invalidType: "Please select a valid order type from the options below.",
    cancel: "Cancel Checkout",
    confirmTitle: "Does everything look correct?",
    placeOrder: "Place Order",
    editOrder: "Edit Details",
    invalidConfirm: "Please select 'Place Order' to proceed or 'Edit Details' to make changes.",
    updateOrder: "Update Order",
    cancelEdit: "Cancel Edit",
    editTitle: "Update your details below:"
  },
  bn: {
    selectType: "আপনি কীভাবে অর্ডারটি গ্রহণ করতে চান?",
    enterName: "অনুগ্রহ করে আপনার নাম লিখুন:",
    enterPhone: "অনুগ্রহ করে আপনার ফোন নম্বর লিখুন:",
    enterAddress: "অনুগ্রহ করে আপনার ডেলিভারি ঠিকানা লিখুন:",
    enterPickup: "অনুগ্রহ করে পিকআপের সময় নির্বাচন করুন:",
    enterTable: "অনুগ্রহ করে নিচের তালিকা থেকে আপনার টেবিল নম্বর নির্বাচন করুন:",
    confirmDineIn: "ডাইন-ইন",
    confirmTakeaway: "টেকওয়ে",
    confirmDelivery: "হোম ডেলিভারি",
    invalidType: "অনুগ্রহ করে নিচের অপশন থেকে একটি বৈধ ধরন নির্বাচন করুন।",
    cancel: "চেকআউট বাতিল",
    confirmTitle: "সব তথ্য কি সঠিক আছে?",
    placeOrder: "অর্ডার নিশ্চিত করুন",
    editOrder: "তথ্য পরিবর্তন করুন",
    invalidConfirm: "সামনে এগোতে 'অর্ডার নিশ্চিত করুন' বা পরিবর্তন করতে 'তথ্য পরিবর্তন করুন' নির্বাচন করুন।",
    updateOrder: "আপডেট করুন",
    cancelEdit: "বাতিল করুন",
    editTitle: "নিচে আপনার তথ্য আপডেট করুন:"
  }
};

export const OPTIONS = {
  MENU: "Browse Menu",
  CART: "View Cart",
  OFFERS: "Current Offers",
  TRACK: "Track Order",
  BRANCHES: "Our Branches",
  HELP: "Help & Support",
  BACK: "Main Menu", // Acts as Home/Reset
  CHECKOUT: "Checkout"
};

export const OPTIONS_BN = {
  MENU: "মেনু দেখুন",
  CART: "কার্ট দেখুন",
  OFFERS: "অফারসমূহ",
  TRACK: "অর্ডার ট্র্যাক",
  BRANCHES: "আমাদের শাখাসমূহ",
  HELP: "সাহায্য",
  BACK: "প্রধান মেনু",
  CHECKOUT: "চেকআউট"
};

export const BRANCHES: Branch[] = [
  {
    id: 'gulshan',
    name: 'Gulshan 1',
    name_bn: 'গুলশান ১',
    address: 'House 12, Road 123, Gulshan 1, Dhaka',
    address_bn: 'বাড়ি ১২, রোড ১২৩, গুলশান ১, ঢাকা',
    phone: '+880 1711-000001',
    hours: '10:00 AM - 11:00 PM',
    hours_bn: 'সকাল ১০:০০ - রাত ১১:০০',
  },
  {
    id: 'dhanmondi',
    name: 'Dhanmondi',
    name_bn: 'ধানমন্ডি',
    address: 'Satmasjid Road, House 45, Dhanmondi, Dhaka',
    address_bn: 'সাতমসজিদ রোড, বাড়ি ৪৫, ধানমন্ডি, ঢাকা',
    phone: '+880 1711-000002',
    hours: '11:00 AM - 10:30 PM',
    hours_bn: 'সকাল ১১:০০ - রাত ১০:৩০',
  },
  {
    id: 'uttara',
    name: 'Uttara',
    name_bn: 'উত্তরা',
    address: 'Sector 7, Road 4, House 11, Uttara, Dhaka',
    address_bn: 'সেক্টর ৭, রোড ৪, বাড়ি ১১, উত্তরা, ঢাকা',
    phone: '+880 1711-000003',
    hours: '10:00 AM - 11:00 PM',
    hours_bn: 'সকাল ১০:০০ - রাত ১১:০০',
  },
  {
    id: 'chittagong',
    name: 'GEC Circle',
    name_bn: 'জিইসি মোড়',
    address: 'CDA Avenue, GEC Circle, Chittagong',
    address_bn: 'সিডিএ এভিনিউ, জিইসি মোড়, চট্টগ্রাম',
    phone: '+880 1811-000004',
    hours: '10:00 AM - 10:00 PM',
    hours_bn: 'সকাল ১০:০০ - রাত ১০:০০',
  }
];

export const MENU: MenuCategory[] = [
  {
    id: 'burgers',
    name: 'Burgers',
    name_bn: 'বার্গা‌র',
    keywords: ['burger', 'sandwich', 'baragar', 'bun', 'patty', 'বার্গার', 'স্যান্ডউইচ'],
    items: [
      { 
        id: 'b1', 
        name: 'Naga Blast Burger', 
        name_bn: 'নাগা ব্লাস্ট বার্গার',
        price: 350, 
        description: 'Spicy naga chili sauce with beef patty.',
        description_bn: 'বিফ প্যাটির সাথে স্পাইসি নাগা মরিচের সস।',
        category: 'Burgers',
        category_bn: 'বার্গা‌র',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'
      },
      { 
        id: 'b2', 
        name: 'Classic Beef', 
        name_bn: 'ক্লাসিক বিফ',
        price: 280, 
        description: 'Juicy beef patty with cheese and lettuce.',
        description_bn: 'চিজ এবং লেটুস সহ জুসি বিফ প্যাটি।',
        category: 'Burgers',
        category_bn: 'বার্গা‌র',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80'
      },
      { 
        id: 'b3', 
        name: 'Crispy Chicken', 
        name_bn: 'ক্রিস্পি চিকেন',
        price: 250, 
        description: 'Fried chicken fillet with mayo.',
        description_bn: 'মেওনেজ সহ ফ্রাইড চিকেন ফিলেট।',
        category: 'Burgers',
        category_bn: 'বার্গা‌র',
        image: 'https://images.unsplash.com/photo-1615297928064-24977384d0f4?w=500&q=80'
      },
    ]
  },
  {
    id: 'rice',
    name: 'Rice Bowls',
    name_bn: 'রাইস বোল',
    keywords: ['rice', 'bowl', 'biryani', 'tehari', 'khichuri', 'lunch', 'dinner', 'ভাত', 'বিরিয়ানি', 'খিচুড়ি'],
    items: [
      { 
        id: 'r1', 
        name: 'Beef Tehari', 
        name_bn: 'বিফ তেহারি',
        price: 220, 
        description: 'Traditional aromatic rice with beef chunks.',
        description_bn: 'গরুর মাংসের টুকরো সহ ঐতিহ্যবাহী সুগন্ধি চাল।',
        category: 'Rice Bowls',
        category_bn: 'রাইস বোল',
        image: 'https://images.unsplash.com/photo-1626804475297-411d8634c4f8?w=500&q=80'
      },
      { 
        id: 'r2', 
        name: 'Chicken Khichuri', 
        name_bn: 'চিকেন খিচুড়ি',
        price: 200, 
        description: 'Roasted chicken with spicy khichuri.',
        description_bn: 'স্পাইসি খিচুড়ির সাথে রোস্ট করা মুরগি।',
        category: 'Rice Bowls',
        category_bn: 'রাইস বোল',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80'
      },
      { 
        id: 'r3', 
        name: 'BBQ Rice Bowl', 
        name_bn: 'বারবিকিউ রাইস বোল',
        price: 280, 
        description: 'Fried rice with BBQ chicken piece.',
        description_bn: 'বারবিকিউ মুরগির সাথে ফ্রাইড রাইস।',
        category: 'Rice Bowls',
        category_bn: 'রাইস বোল',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80'
      },
    ]
  },
  {
    id: 'pasta',
    name: 'Pasta',
    name_bn: 'পাস্তা',
    keywords: ['pasta', 'spaghetti', 'noodles', 'chowmein', 'italian', 'পাস্তা', 'নুডলস'],
    items: [
      {
        id: 'p1',
        name: 'Creamy Chicken Pasta',
        name_bn: 'ক্রিমি চিকেন পাস্তা',
        price: 320,
        description: 'Penne pasta in rich white sauce with grilled chicken.',
        description_bn: 'গ্রিলড চিকেন এবং হোয়াইট সস সহ পেনে পাস্তা।',
        category: 'Pasta',
        category_bn: 'পাস্তা',
        image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80'
      },
      {
        id: 'p2',
        name: 'Oven Baked Pasta',
        name_bn: 'ওভেন বেকড পাস্তা',
        price: 380,
        description: 'Loaded with cheese, beef, and mushrooms.',
        description_bn: 'চিজ, বিফ এবং মাশরুম দিয়ে তৈরি।',
        category: 'Pasta',
        category_bn: 'পাস্তা',
        image: 'https://images.unsplash.com/photo-1560035071-79b8823521b4?w=500&q=80'
      }
    ]
  },
  {
    id: 'sides',
    name: 'Sides',
    name_bn: 'সাইডস',
    keywords: ['sides', 'fries', 'wings', 'starter', 'appetizer', 'snacks', 'nachos', 'ফ্রেঞ্চ', 'ফ্রাই', 'উইংস'],
    items: [
      {
        id: 's1',
        name: 'French Fries',
        name_bn: 'ফ্রেঞ্চ ফ্রাই',
        price: 120,
        description: 'Crispy golden potato fries.',
        description_bn: 'ক্রিস্পি গোল্ডেন পটেটো ফ্রাই।',
        category: 'Sides',
        category_bn: 'সাইডস',
        image: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?w=500&q=80'
      },
      {
        id: 's2',
        name: 'Chicken Wings (6pcs)',
        name_bn: 'চিকেন উইংস (৬ পিস)',
        price: 250,
        description: 'Spicy BBQ glazed chicken wings.',
        description_bn: 'স্পাইসি বারবিকিউ চিকেন উইংস।',
        category: 'Sides',
        category_bn: 'সাইডস',
        image: 'https://images.unsplash.com/photo-1527477396000-64ca9c0016cb?w=500&q=80'
      },
      {
        id: 's3',
        name: 'Garlic Mushrooms',
        name_bn: 'গার্লিক মাশরুম',
        price: 200,
        description: 'Sautéed mushrooms with garlic and butter.',
        description_bn: 'রসুন এবং মাখন দিয়ে ভাজা মাশরুম।',
        category: 'Sides',
        category_bn: 'সাইডস',
        image: 'https://images.unsplash.com/photo-1588644458315-74895ee91931?w=500&q=80'
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    name_bn: 'ডেজার্ট',
    keywords: ['dessert', 'sweet', 'cake', 'brownie', 'pudding', 'ice cream', 'mishti', 'মিষ্টি', 'ডেজার্ট', 'কেক'],
    items: [
      {
        id: 'ds1',
        name: 'Chocolate Brownie',
        name_bn: 'চকলেট ব্রাউনি',
        price: 150,
        description: 'Fudgy brownie topped with chocolate sauce.',
        description_bn: 'চকলেট সস টপিংসহ ফাজি ব্রাউনি।',
        category: 'Desserts',
        category_bn: 'ডেজার্ট',
        image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&q=80'
      },
      {
        id: 'ds2',
        name: 'Caramel Pudding',
        name_bn: 'ক্যারামেল পুডিং',
        price: 100,
        description: 'Smooth and creamy caramel custard.',
        description_bn: 'স্মুথ এবং ক্রিমি ক্যারামেল কাস্টার্ড।',
        category: 'Desserts',
        category_bn: 'ডেজার্ট',
        image: 'https://images.unsplash.com/photo-1599320623696-f36f0017a419?w=500&q=80'
      }
    ]
  },
  {
    id: 'drinks',
    name: 'Drinks',
    name_bn: 'পানীয়',
    keywords: ['drink', 'juice', 'coffee', 'water', 'coke', 'beverage', 'tea', 'পানীয়', 'জুস', 'কফি'],
    items: [
      { 
        id: 'd1', 
        name: 'Mint Lemonade', 
        name_bn: 'মিন্ট লেমোনেড',
        price: 120,
        category: 'Drinks',
        category_bn: 'পানীয়',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80'
      },
      { 
        id: 'd2', 
        name: 'Cold Coffee', 
        name_bn: 'কোল্ড কফি',
        price: 180,
        category: 'Drinks',
        category_bn: 'পানীয়',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80'
      },
      { 
        id: 'd3', 
        name: 'Mango Lassi', 
        name_bn: 'ম্যাঙ্গো লাচ্ছি',
        price: 150,
        category: 'Drinks',
        category_bn: 'পানীয়',
        image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500&q=80'
      },
    ]
  }
];

// Helper to get localized text for options
export const getLocalizedOption = (key: keyof typeof OPTIONS, lang: Language) => {
  return lang === 'bn' ? OPTIONS_BN[key] : OPTIONS[key];
};
