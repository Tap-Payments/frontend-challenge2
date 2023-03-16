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
  //[x] TODO: fix the type of cartItems
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    'shopping-cart',
    []
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // TODO: calculate cart quantity
  const cartQuantity = cartItems.reduce((acc, item) => item.quantity + acc, 0);
  // TODO: calculate cart total
  const cartTotalAmount = cartItems.reduce((acc, cartItem) => {
    const menuItem = storeItems.find(i => i.id == cartItem.id);

    const itemPrice = (menuItem?.price || 0) * (cartItem.quantity || 1);

    return itemPrice + acc;
  }, 0);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    const itemQuantity = cartItems.find(i => i.id == id)?.quantity;

    return itemQuantity || 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    const cartItem = cartItems.find(i => i.id == id);

    if (!cartItem) {
      const newCartItem: CartItem = {
        id,
        quantity: 1,
      };
      setCartItems(oldItems => ({ ...oldItems, newCartItem }));

      return;
    }

    const clonedCardItem: CartItem = {
      ...cartItem,
      quantity: cartItem.quantity + 1,
    };

    const cartItemIndex = cartItems.findIndex(i => i.id == id);

    const newCartItems = cartItems.splice(cartItemIndex, 1, clonedCardItem);

    setCartItems(newCartItems);
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    const cartItem = cartItems.find(i => i.id == id);
    const cartItemIndex = cartItems.findIndex(i => i.id == id);

    if (!cartItem) {
      return;
    }

    if (cartItem.quantity == 1) {
      removeFromCart(cartItem.id);
    }

    const clonedCardItem: CartItem = {
      ...cartItem,
      quantity: cartItem.quantity - 1,
    };

    const newCartItems = cartItems.splice(cartItemIndex, 1, clonedCardItem);

    setCartItems(newCartItems);
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    const cartItemIndex = cartItems.findIndex(i => i.id == id);

    const newCartItems = cartItems.splice(cartItemIndex, 1);
    setCartItems(newCartItems);
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
