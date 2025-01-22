// app/contexts/ShoppingListContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ingredient } from '../types/Recipe';

interface ShoppingListContextProps {
  shoppingList: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (ingredientId: string) => void;
  clearList: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextProps>({
  shoppingList: [],
  addIngredient: () => {},
  removeIngredient: () => {},
  clearList: () => {},
});

export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);

  const addIngredient = (ingredient: Ingredient) => {
    // 중복 방지
    setShoppingList((prev) => {
      if (!prev.find((item) => item.id === ingredient.id)) {
        return [...prev, ingredient];
      }
      return prev;
    });
  };

  const removeIngredient = (ingredientId: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== ingredientId));
  };

  const clearList = () => {
    setShoppingList([]);
  };

  return (
    <ShoppingListContext.Provider
      value={{ shoppingList, addIngredient, removeIngredient, clearList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => useContext(ShoppingListContext);
