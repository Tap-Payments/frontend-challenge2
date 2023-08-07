import { createContext, ReactNode, useContext, useState } from 'react';
import { ShoppingCart } from '../components/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';
import storeItems from '../data/items.json';

type ShoppingCartProviderProps = {
  children: ReactNode;
};
type CartItem = {
  id: number;
  quantity: number;
};
type ShoppingCartContextProps = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  cartTotalAmount: number;
};

const ShoppingCartContext = createContext({} as ShoppingCartContextProps);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: fix the type of cartItems
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    'shopping-cart',
    []
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // TODO: calculate cart quantity
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // TODO: calculate cart total
  const cartTotalAmount = cartItems.reduce((sum, item) => {
    const storeItem = storeItems.find(si => si.id === item.id);
    return sum + (storeItem ? storeItem.price * item.quantity : 0);
  }, 0);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
    // return 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    setCartItems(prevItems => {
      console.log('prevItems', prevItems);
      const itemIndex = prevItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        const newItems = [...prevItems];
        newItems[itemIndex].quantity += 1;
        return newItems;
      } else {
        return [...prevItems, { id, quantity: 1 }];
      }
    });
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    setCartItems(prevItems => {
      console.log('faklsdjf', id);
      console.log('prevItems', prevItems);
      const itemIndex = prevItems.findIndex(item => item.id === id);
      if (itemIndex !== -1 && prevItems[itemIndex].quantity > 1) {
        const newItems = [...prevItems];
        newItems[itemIndex].quantity -= 1;
        return newItems;
      } else if (itemIndex !== -1 && prevItems[itemIndex].quantity === 1) {
        return prevItems.filter(item => item.id !== id);
      } else {
        return prevItems;
      }
    });
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
        cartTotalAmount,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
