import { createContext, ReactNode, useContext, useState } from 'react';
import { ShoppingCart } from '../components/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';
import storeItems from '../data/items.json';
import { CartItem } from '../components/CartItem';

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
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    'shopping-cart',
    []
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotalAmount = cartItems.reduce((total, item) => {
    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (cartItem) {
      return total + cartItem.quantity * cartItem.price;
    }
    return total;
  }, 0);

  const getItemQuantity = (id: number) => {
    return cartItems.find(item => item.id === id)?.quantity ?? 0;
  };
  function increaseCartQuantity(id: number) {
    setCartItems((prevCartItem: CartItem[]) => {
      return prevCartItem.map(item => {
        return item.id === id ? { ...item, quantity: item.quantity + 1 } : item;
      });
    });
  }
  function decreaseCartQuantity(id: number) {
    setCartItems((prevCartItem: CartItem[]) => {
      return prevCartItem.map(item => {
        return item.id === id ? { ...item, quantity: item.quantity - 1 } : item;
      });
    });
  }
  function removeFromCart(id: number) {
    setCartItems((prevCartItem: CartItem[]) =>
      prevCartItem.filter(item => item.id !== id)
    );
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
