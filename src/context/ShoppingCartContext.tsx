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

  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  let cartQuantity = 0;
  cartItems.forEach((item) => {
    cartQuantity += item.quantity;
  })
  let cartTotalAmount = 0;
  cartItems.forEach((item) => {
    const storeItem = storeItems.find((i) => i.id === item.id);
    const itemPrice =  storeItem?.price || 0
    const totalItemPrice = itemPrice * item.quantity
    cartTotalAmount += totalItemPrice
  })


  const getItemQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };
  function increaseCartQuantity(id: number) {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      } else {
        return item;
      }
    })
    setCartItems(updatedCartItems)
  }
  function decreaseCartQuantity(id: number) {
      const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity === 0 ? 0 : item.quantity - 1,
        };
      } else {
        return item;
      }
    })
    setCartItems(updatedCartItems)

  }

  function removeFromCart(id: number) {
    const updatedCartItems = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCartItems)
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
