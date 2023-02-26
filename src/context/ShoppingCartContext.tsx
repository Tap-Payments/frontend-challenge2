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
  const cartQuantity = (cartItems as CartItem[]).reduce((prv, cur) => {
    return cur.quantity + prv;
  }, 0);

  // TODO: calculate cart total
  const cartTotalAmount = (cartItems as CartItem[]).reduce((prv, cur) => {
    const total = storeItems.find(storeItem => {
      return storeItem.id === cur.id;
    })?.price;

    return cur.quantity * total! + prv;
  }, 0);

  // TODO: implement getItemQuantity
  const getItemQuantity = (id: number) => {
    const item = getItem(id);

    return item?.quantity || 0;
  };

  function getItem(id: number) {
    const item = (cartItems as CartItem[]).find(item => {
      return item.id === id;
    });
    return item;
  }

  // TODO: implement increaseCartQuantity
  function increaseCartQuantity(id: number) {
    setCartItems(old => {
      // find first
      let foundedItem = getItem(id);
      if (foundedItem) {
        return [
          ...old.filter(oldItem => {
            return id !== oldItem.id;
          }),
          { ...foundedItem, quantity: foundedItem.quantity + 1 },
        ];
      }
      // if found inc the qty

      // if not get form json and qty + 1

      return [...old, { id, quantity: 1 }];
    });
  }

  // TODO: implement decreaseCartQuantity
  function decreaseCartQuantity(id: number) {
    // if not found return
    let foundedItem = getItem(id);
    if (!foundedItem) {
      return;
    }

    setCartItems(old => {
      const newArr = [
        ...old.filter(oldItem => {
          return id !== oldItem.id;
        }),
      ];
      if (foundedItem?.quantity! > 1) {
        newArr.push({ ...foundedItem!, quantity: foundedItem!.quantity - 1 });
      }
      return newArr;
    });
    // if found dec
    // if found and qty === 1 remove from items
  }

  // TODO: implement removeFromCart
  function removeFromCart(id: number) {
    setCartItems(old => {
      return [
        ...old.filter(oldItem => {
          return id !== oldItem.id;
        }),
      ];
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
