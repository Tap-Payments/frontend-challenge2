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
  const [cartItems, setCartItems] = useLocalStorage<Array<CartItem>>(
    'shopping-cart',
    []
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // TODO: calculate cart quantity
  const cartQuantity = cartItems.reduce(
    (accum, cartItem) => accum + cartItem.quantity,
    0
  );
  // TODO: calculate cart total
  const cartTotalAmount = cartItems.reduce((accum, cartItem) => {
    return (
      accum +
      (storeItems.find(item => item.id === cartItem.id)?.price ?? 0) *
        cartItem.quantity
    );
  }, 0);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    return cartItems.find(cartItem => cartItem.id === id)?.quantity ?? 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    const cartItemIndex = cartItems.findIndex(cartItem => cartItem.id === id);
    if (cartItemIndex === -1) {
      cartItems.push({ id, quantity: 1 });
    } else {
      cartItems[cartItemIndex] = {
        id,
        quantity: cartItems[cartItemIndex].quantity + 1,
      };
    }
    setCartItems([...cartItems]);
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    const cartItemIndex = cartItems.findIndex(cartItem => cartItem.id === id);
    if (cartItemIndex === -1) {
      return;
    } else {
      const presentQuantity = cartItems[cartItemIndex].quantity;
      if (presentQuantity === 1) {
        return setCartItems(cartItems.filter(cartItem => cartItem.id !== id));
      }
      cartItems[cartItemIndex] = {
        id,
        quantity: cartItems[cartItemIndex].quantity--,
      };
      setCartItems([...cartItems]);
    }
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    setCartItems(cartItems.filter(cartItem => cartItem.id !== id));
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
