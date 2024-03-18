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
  // TODO: 2- fix the type of cartItems
  const [cartItems, setCartItems] = useLocalStorage('shopping-cart', []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // TODO: 2- calculate cart total quantity
  const cartQuantity = 0;
  // TODO: 4- calculate cart total amount
  const cartTotalAmount = 0;

  // TODO: 5- implement getItemQuantity
  /**
   * Get the quantity of a specific item in the cart
   */
  const getItemQuantity = (id: number) => {
    return 0;
  };
  // TODO: 6- implement increaseCartQuantity

  /**
   * Increase the quantity of a specific item in the cart by 1
   * If the item is not in the cart, add it with a quantity of 1
   */
  function increaseCartQuantity(id: number) {}

  // TODO: 7- implement decreaseCartQuantity
/**
 * Decrease the quantity of a specific item in the cart by 1
 * If the quantity is 1, remove the item from the cart
 */ 
  function decreaseCartQuantity(id: number) {}

  // TODO: 8- implement removeFromCart
  /**
   * Remove a specific item from the cart
   */
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
