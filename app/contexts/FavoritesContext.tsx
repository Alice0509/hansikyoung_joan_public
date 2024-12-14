// app/contexts/FavoritesContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FavoritesContextProps {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(
  undefined,
);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = (id: string) => {
    setFavorites((prev) => [...prev, id]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextProps => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
