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
  // TODO: fix the type of cartItems
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    'shopping-cart',
    []
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // TODO: calculate cart quantity
  const cartQuantity = cartItems.reduce((quantity, cartItem) => {
    return quantity + cartItem.quantity;
  }, 0);
  // TODO: calculate cart total
  const cartTotalAmount = cartItems.reduce((amount, cartItem) => {
    const itemPrice =
      storeItems.find(item => item.id === cartItem.id)?.price || 0;

    return amount + itemPrice * cartItem.quantity;
  }, 0);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    return cartItems.find(item => item.id == id)?.quantity || 0;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    const hasItemInCart = cartItems.find(cartItem => cartItem.id === id);
    const storeItem = storeItems.find(item => item.id === id);

    let nextCartItems = cartItems.map(cartItem => {
      if (cartItem.id === id) {
        cartItem.quantity++;
      }
      return cartItem;
    });

    if (!hasItemInCart) {
      nextCartItems = [
        ...nextCartItems,
        { id: storeItem?.id, quantity: 1 } as CartItem,
      ];
    }
    setCartItems(nextCartItems);
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    const itemInCart = cartItems.find(cartItem => cartItem.id === id);

    if (itemInCart && itemInCart.quantity === 1) {
      removeFromCart(id);
    } else {
      setCartItems(state => {
        return state.map(cartItem => {
          if (cartItem.id === id) {
            return { ...cartItem, quantity: cartItem.quantity-- };
          }

          return cartItem;
        });
      });
    }
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    setCartItems(state => {
      return state.filter(cartItem => cartItem.id !== id);
    });
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
