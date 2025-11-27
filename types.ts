
export enum UserRole {
  USER = 'user',
  BOT = 'bot',
}

export enum MessageType {
  TEXT = 'text',
  MENU_CAROUSEL = 'menu_carousel',
  CART = 'cart',
  ORDER_TRACKING = 'order_tracking',
  RECEIPT = 'receipt',
  TABLE_SELECT = 'table_select',
  TIME_SELECT = 'time_select',
  ORDER_SUMMARY = 'order_summary',
  ORDER_FORM = 'order_form'
}

export type Language = 'en' | 'bn';
export type ViewState = 'CHAT' | 'MENU' | 'ORDERS' | 'FAVORITES' | 'PROFILE';

export interface Message {
  id: string;
  role: UserRole;
  type: MessageType; // New field to determine render type
  text: string;
  timestamp: Date;
  options?: string[];
  payload?: any; // For passing data like menu items or order details
}

export interface MenuItem {
  id: string;
  name: string;
  name_bn?: string;
  price: number;
  description?: string;
  description_bn?: string;
  category: string;
  category_bn?: string;
  image: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  name_bn?: string;
  items: MenuItem[];
  keywords?: string[]; // Added for robust matching
}

export interface Branch {
  id: string;
  name: string;
  name_bn?: string;
  address: string;
  address_bn?: string;
  phone: string;
  hours: string;
  hours_bn?: string;
  mapLink?: string;
}

export interface BotResponse {
  text: string;
  type?: MessageType;
  options?: string[];
  payload?: any;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery';

export interface CustomerDetails {
  name: string;
  phone: string;
  address?: string;
  pickupTime?: string;
  tableNumber?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  address?: string;
  memberSince: string;
  ordersCount: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  date: Date;
  orderType: OrderType;
  customerDetails: CustomerDetails;
}