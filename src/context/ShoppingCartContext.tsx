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
  const cartQuantity = cartItems.length;
  // TODO: calculate cart total
  const cartTotalAmount = 0;

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    return 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    const newItem = storeItems.find(item => id === item.id);
    const existingItem = cartItems.find(item => item.id === newItem?.id);

    if (newItem?.id && !existingItem) {
      setCartItems([...cartItems, { id: newItem.id, quantity: 1 }]);
    } else {
      setCartItems([
        ...cartItems,
        { ...existingItem, quantity: existingItem!.quantity + 1 } as CartItem,
      ]);
    }
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {}
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {}

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
