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
  const [cartItems, setCartItems]= useLocalStorage('shopping-cart', []);

  console.log({isOpen, cartItems});

  const openCart = () => {
    setIsOpen(true);
    console.log("called")
  }
  const closeCart = () => setIsOpen(false);

  // TODO: calculate cart quantity
  const cartQuantity = 0;
  // TODO: calculate cart total
  const cartTotalAmount = 0;

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    const selectedItem = cartItems.find(item=>item.id == id);
    return selectedItem?.quantity || 0;
  };

  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    // const item = storeItems.find(item=>item.id == id);
    const selectedItem = cartItems.find(item=>item.id == id);

    if(selectedItem){
      selectedItem.quantity =  selectedItem.quantity + 1;
      setCartItems(cartItems)
    }else{
      let newCartItems = [...cartItems, {id, quantity: 1} ];
      setCartItems(newCartItems)
    }

    console.log({cartItems})

  }

  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    const ind = cartItems.indexOf(item=>item.id == id);

    if(cartItems[ind] && cartItems[ind].quantity > 1){
      cartItems[ind].quantity =  cartItems[ind].quantity - 1;
      setCartItems(cartItems)
    }else{
      const newCartItems = cartItems.splice(ind,1);
      setCartItems(newCartItems)
    }
    
    console.log({cartItems})
  }
  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    const ind = cartItems.indexOf(item=>item.id == id);
    const newCartItems = cartItems.splice(ind,1);
    setCartItems(newCartItems)
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
