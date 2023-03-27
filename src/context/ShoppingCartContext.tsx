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
  const cartQuantity = (cartItems: CartItem[]) => {
    let quantity = 0;
    cartItems.forEach(cartItem => {
      quantity += cartItem.quantity;
    })
    return quantity
  };;
  // TODO: calculate cart total
  const cartTotalAmount = (cartItems: CartItem[]) => {
    let total = 0;
    cartItems.forEach(cartItem => {
      const itemPrice = storeItems.filter(storeItem => storeItem.id === cartItem.id)[0].price;
      total += itemPrice;
    })
    return total
  };


  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    const countInCart = cartItems.filter(elem => elem.id === id)[0].quantity;
    return countInCart;
  };
  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    const productIndex = cartItems.findIndex(elem => elem.id === id);
    const productToUpdate: CartItem = { ...cartItems[productIndex], quantity: cartItems[productIndex].quantity += 1}
    const updatedCart = cartItems.slice();
    updatedCart.splice(productIndex, 1, productToUpdate);
    setCartItems(updatedCart)
  }
  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    const productIndex = cartItems.findIndex(elem => elem.id === id);
    const productToUpdate: CartItem = { ...cartItems[productIndex], quantity: cartItems[productIndex].quantity -= 1}
    const updatedCart = cartItems.slice();
    updatedCart.splice(productIndex, 1, productToUpdate);
    setCartItems(updatedCart)
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    const productIndex = cartItems.findIndex(elem => elem.id === id);
    const productToUpdate: CartItem = { ...cartItems[productIndex], quantity: cartItems[productIndex].quantity = 0}
    const updatedCart = cartItems.slice();
    updatedCart.splice(productIndex, 1, productToUpdate);
    setCartItems(updatedCart)
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
