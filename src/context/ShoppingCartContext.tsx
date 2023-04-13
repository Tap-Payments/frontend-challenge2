import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
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
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // TODO: calculate cart quantity
  const cartQuantity = useMemo(() => {
    return cartItems.reduce((accumulator, currentItem) => accumulator + currentItem.quantity, 0)
  }, [cartItems]);

  // TODO: calculate cart total
  const cartTotalAmount = useMemo(() => {
    return cartItems.reduce((acu, currentItem) => {
      const singleStoreItem = storeItems.find((item) => item.id === currentItem.id)
      if (singleStoreItem) {
        return acu + singleStoreItem.price * currentItem.quantity
      }
      else return acu
    }, 0)
  }, [cartItems]);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    return cartItems.find(item => item.id === id)?.quantity || 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    const targetCartItem = cartItems.find(item => item.id === id)
    if (targetCartItem) {
      targetCartItem.quantity += 1;
      setCartItems([
        ...cartItems.filter((item) => item.id !== id),
        targetCartItem
      ])
    }
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    const targetCartItem = cartItems.find(item => item.id === id)
    if (targetCartItem) {
      targetCartItem.quantity -= 1;
    }
    return [
      ...cartItems.filter((item) => item.id !== id),
      targetCartItem
    ]
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    return cartItems.filter((item) => item.id !== id)
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
