// app/contexts/IngredientsContext.tsx

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IngredientsContextProps {
  checkedIngredients: boolean[];
  toggleCheck: (index: number) => void;
  setIngredients: (count: number, recipeId: string) => void;
}

export const IngredientsContext = createContext<IngredientsContextProps>({
  checkedIngredients: [],
  toggleCheck: () => {},
  setIngredients: () => {},
});

interface IngredientsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY_PREFIX = '@checkedIngredients_';

export const IngredientsProvider: React.FC<IngredientsProviderProps> = ({
  children,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [currentRecipeId, setCurrentRecipeId] = useState<string | null>(null);
  const [ingredientsCount, setIngredientsCount] = useState<number>(0);

  // 레시피 ID에 따른 저장 키 생성
  const getStorageKey = (recipeId: string) =>
    `${STORAGE_KEY_PREFIX}${recipeId}`;

  useEffect(() => {
    // 현재 레시피 ID에 따른 체크박스 상태 불러오기
    const loadCheckedIngredients = async () => {
      if (currentRecipeId) {
        try {
          const storedChecked = await AsyncStorage.getItem(
            getStorageKey(currentRecipeId),
          );
          if (storedChecked !== null) {
            const parsedChecked = JSON.parse(storedChecked);
            setCheckedIngredients(parsedChecked);
          } else if (ingredientsCount > 0) {
            const initialChecked = new Array(ingredientsCount).fill(false);
            setCheckedIngredients(initialChecked);
          }
        } catch (error) {
          console.error(
            'Failed to load checked ingredients from storage:',
            error,
          );
        }
      }
    };

    loadCheckedIngredients();
  }, [currentRecipeId, ingredientsCount]);

  useEffect(() => {
    // 현재 레시피 ID에 따라 체크박스 상태 저장
    const saveCheckedIngredients = async () => {
      if (currentRecipeId) {
        try {
          await AsyncStorage.setItem(
            getStorageKey(currentRecipeId),
            JSON.stringify(checkedIngredients),
          );
        } catch (error) {
          console.error(
            'Failed to save checked ingredients to storage:',
            error,
          );
        }
      }
    };

    saveCheckedIngredients();
  }, [checkedIngredients, currentRecipeId]);

  const toggleCheck = useCallback((index: number) => {
    setCheckedIngredients((prev) => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  }, []);

  const setIngredients = useCallback((count: number, recipeId: string) => {
    setIngredientsCount(count);
    setCurrentRecipeId(recipeId);
    const initialChecked = new Array(count).fill(false);
    setCheckedIngredients(initialChecked);
  }, []);

  return (
    <IngredientsContext.Provider
      value={{ checkedIngredients, toggleCheck, setIngredients }}
    >
      {children}
    </IngredientsContext.Provider>
  );
};
