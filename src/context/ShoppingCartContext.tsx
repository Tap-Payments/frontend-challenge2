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
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // TODO: calculate cart quantity
  const [cartQuantity, ] = useState<number>(cartItems.length);
  // TODO: calculate cart total
  const cartTotalAmount = 0;

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    return 0;
  };
  // TODO: implement increaseCartQuantity
  function cartItemExists(id: number) {
    return cartItems.find((item: CartItem) => item.id === id);
  }
  function increaseCartQuantity(id: number) {
    if (cartItemExists(id)) {
      const cartItemsCopy = cartItems.map((cartItem: CartItem) => {
        if (cartItem.id === id) return {
          ...cartItem,
          quantity: cartItem.quantity + 1
        }
        return cartItem;
      })
      setCartItems(cartItemsCopy);
    } else {
      setCartItems([...cartItems, { id, quantity: 1 }]);
    }
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    if (cartItemExists(id)) {
      const cartItemsCopy = cartItems.map((cartItem: CartItem) => {
        if (cartItem.id === id) return {
          ...cartItem,
          quantity: cartItem.quantity < 2 ? cartItem.quantity : cartItem.quantity - 1
        }
        return cartItem;
      })
      setCartItems(cartItemsCopy);
    }
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    const cartItemsCopy = cartItems.filter((cartItem: CartItem) => cartItem.id !== id);
    setCartItems(cartItemsCopy);
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
