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
  const [cartItems, setCartItems] = useLocalStorage(
    'shopping-cart',
    Array<CartItem>()
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // TODO: calculate cart quantity
  const cartQuantity = cartItems.reduce(
    (quantity: number, item: CartItem) => (quantity += item.quantity),
    0
  );
  // TODO: calculate cart total
  const itemPrices = new Map();
  storeItems.forEach(item => itemPrices.set(item.id, item.price));
  const cartTotalAmount = cartItems.reduce(
    (amount: number, item: CartItem) =>
      amount + item.quantity * itemPrices.get(item.id),
    0
  );

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    for (let i = 0; i < cartItems.length; i += 1) {
      if (cartItems[i].id == id) return cartItems[i].quantity;
    }
    return 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    let i: number = 0;
    for (i = 0; i < cartItems.length; i += 1) {
      if (cartItems[i].id == id) break;
    }
    if (i === cartItems.length) {
      const item: CartItem = {
        id,
        quantity: 1,
      };
      cartItems.push(item);
    } else {
      cartItems[i].quantity += 1;
    }
    setCartItems([...cartItems]);
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    for (let i = 0; i < cartItems.length; i += 1) {
      if (cartItems[i].id == id) {
        cartItems[i].quantity -= 1;
        setCartItems([...cartItems]);
        break;
      }
    }
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    setCartItems(cartItems.filter((item: CartItem) => item.id != id));
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
