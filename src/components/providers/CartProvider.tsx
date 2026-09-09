"use client";

import React, { createContext, useContext, useEffect, useReducer } from 'react';

export interface CartItem {
  id: string; // unique string for this exact configuration
  productId: string;
  variantId: string | null;
  addons: Record<string, string[]>; // groupId -> addonIds
  packageSelections?: {
    dayIndex: number;
    mealId: string;
    mealName: { ar: string; en: string };
    variantName?: { ar: string; en: string };
  }[];
  quantity: number;
  totalPrice: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  orderNotes: string;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_ORDER_NOTES'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  orderNotes: "",
};

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        totalAmount: calculateTotal(newItems),
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        totalAmount: calculateTotal(newItems),
      };
    }
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => 
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      return {
        ...state,
        items: newItems,
        totalAmount: calculateTotal(newItems),
      };
    }
    case 'SET_ORDER_NOTES':
      return {
        ...state,
        orderNotes: action.payload,
      };
    case 'CLEAR_CART':
      return initialState;
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setOrderNotes: (notes: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tamara_cart');
      if (saved) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('tamara_cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const setOrderNotes = (notes: string) => dispatch({ type: 'SET_ORDER_NOTES', payload: notes });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, setOrderNotes, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
