// app/contexts/FavoritesContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesContextProps {
  favorites: string[]; // 레시피 ID 문자열 목록
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // 앱 시작 시 AsyncStorage에서 즐겨찾기 불러오기
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("@favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (e) {
        console.error("Failed to load favorites:", e);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    // 즐겨찾기 변경 시 AsyncStorage에 저장
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("@favorites", JSON.stringify(favorites));
      } catch (e) {
        console.error("Failed to save favorites:", e);
      }
    };
    saveFavorites();
  }, [favorites]);

  const addFavorite = (id: string) => {
    if (!favorites.includes(id)) {
      setFavorites([...favorites, id]);
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((favId) => favId !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
