import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { ShoppingCart } from '../components/ShoppingCart';
import storeItems from '../data/items.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  const cartQuantity = useMemo(
    () =>
      cartItems.reduce((total, currentItem) => {
        return total + currentItem.quantity;
      }, 0),
    [cartItems]
  );
  // TODO: calculate cart total
  const cartTotalAmount = useMemo(() => 
    cartItems.reduce((total, currentItem) => {
      const itemPrice =
        storeItems.find(item => item.id === currentItem.id)?.price ?? 0;
      return total + itemPrice;
    }, 0)
  , [cartItems]);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    return cartItems.find(item => item.id === id)?.quantity ?? 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    if (getItemQuantity(id) !== 0) {
      setCartItems(prevItems =>
        prevItems.map(item => ({ ...item, quantity: item.quantity + 1 }))
      );
    } else {
      setCartItems(prevItems => [...prevItems, { id, quantity: 1 }]);
    }
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    if(getItemQuantity(id) > 1) {
      setCartItems((prevItems) => prevItems.map((item) => ({...item, quantity: item.quantity - 1})))
    } else {
      removeFromCart(id)
    }
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
