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
  const cartQuantity = cartItems.reduce((acc, cur) => {
    acc += cur.quantity;
    return acc;
  }, 0);
  // TODO: calculate cart total
  const cartTotalAmount = cartItems.reduce((acc, cur) => {
    const price = storeItems.find(sItem => sItem.id === cur.id)?.price ?? 0;
    acc += cur.quantity * price;
    return acc;
  }, 0);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    return cartItems.find(item => item.id === id)?.quantity ?? 0;
  };

  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    const currentItem = cartItems.find(item => item.id === id);

    if (currentItem) {
      setCartItems(
        cartItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          }

          return item;
        })
      );
    } else {
      setCartItems([...cartItems, { id, quantity: 1 }]);
    }
  }

  // console.log(cartItems, 'cartItems');
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    setCartItems(cartItems =>
      cartItems.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }

        return item;
      })
    );
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    setCartItems(cartItems => cartItems.filter(item => item.id !== id));
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
