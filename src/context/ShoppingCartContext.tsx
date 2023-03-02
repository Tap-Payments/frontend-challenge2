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
  const cartQuantity = cartItems.reduce((pervQuantity, currentItem) => {
    return pervQuantity + currentItem.quantity;
  }, 0);
  // TODO: calculate cart total
  const cartTotalAmount = cartItems.reduce((pervTotal, currentItem) => {
    const itemTotal =
      storeItems.find(storedItem => storedItem.id === currentItem.id)?.price ||
      0;
    return pervTotal + itemTotal;
  }, 0);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    // cartItems.reduce((first, next) => {
    //   return first.
    // })
    return cartItems.find(item => item.id === id)?.quantity || 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    let foundItem = cartItems.find(item => item.id === id);
    const foundItemIndex = cartItems.findIndex(item => item.id === id);
    let updatedItems = [...cartItems];
    if (!foundItem || !foundItemIndex) {
      foundItem = {
        id,
        quantity: 1,
      };
      updatedItems.push(foundItem);
    }
    if (foundItem) {
      foundItem.quantity += 1;
      updatedItems[foundItemIndex] = foundItem;
    }
    setCartItems(updatedItems);
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    let foundItem = cartItems.find(item => item.id === id);
    const foundItemIndex = cartItems.findIndex(item => item.id === id);
    let updatedItems = [...cartItems];
    if (!foundItem || !foundItemIndex) {
      updatedItems = updatedItems.filter(item => item.id !== id);
    }
    if (foundItem) {
      if (foundItem.quantity < 1) {
        updatedItems = updatedItems.filter(item => item.id !== id);
      } else {
        foundItem.quantity -= 1;
        updatedItems[foundItemIndex] = foundItem;
      }
    }
    setCartItems(updatedItems);
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
