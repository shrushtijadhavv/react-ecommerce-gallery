import React, { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import { Product } from '../data/products';
import Notification from '../components/Notification';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'INCREMENT_QUANTITY'; payload: number }
  | { type: 'DECREMENT_QUANTITY'; payload: number }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'INCREMENT_QUANTITY': {
      const updatedItems = state.items.map(item => 
        item.id === action.payload 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'DECREMENT_QUANTITY': {
      const updatedItems = state.items.map(item => 
        item.id === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'CLEAR_CART': {
      return {
        items: [],
        total: 0
      };
    }
    
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });
  
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      isVisible: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };
  
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    const existingItem = state.items.find(item => item.id === product.id);
    showNotification(
      existingItem 
        ? `Added another ${product.name} to your cart!` 
        : `${product.name} added to your cart!`,
      'success'
    );
  };
  
  const removeFromCart = (id: number) => {
    const product = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    if (product) {
      showNotification(`${product.name} removed from your cart`, 'info');
    }
  };
  
  const incrementQuantity = (id: number) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: id });
    const product = state.items.find(item => item.id === id);
    if (product) {
      showNotification(`Added another ${product.name} to your cart!`, 'success');
    }
  };
  
  const decrementQuantity = (id: number) => {
    const product = state.items.find(item => item.id === id);
    dispatch({ type: 'DECREMENT_QUANTITY', payload: id });
    if (product && product.quantity > 1) {
      showNotification(`Reduced ${product.name} quantity`, 'info');
    }
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    showNotification('Your cart has been cleared', 'info');
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        state,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart
      }}
    >
      {children}
      <Notification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 