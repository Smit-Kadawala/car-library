import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const FAVORITES_KEY = "@car_favorites";

// Global state to sync across components
let globalFavorites: string[] = [];
let listeners: Array<(favorites: string[]) => void> = [];

const notifyListeners = (favorites: string[]) => {
  globalFavorites = favorites;
  listeners.forEach((listener) => listener(favorites));
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(globalFavorites);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();

    // Register listener
    const listener = (newFavorites: string[]) => {
      setFavorites(newFavorites);
    };
    listeners.push(listener);

    // Cleanup
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
        notifyListeners(parsed);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = useCallback(
    async (carId: string) => {
      try {
        const newFavorites = favorites.includes(carId)
          ? favorites.filter((id) => id !== carId)
          : [...favorites, carId];

        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        notifyListeners(newFavorites);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (carId: string) => {
      return favorites.includes(carId);
    },
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, loading };
};
