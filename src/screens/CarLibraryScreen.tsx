import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CarCard } from "../components/CarCard";
import { FilterModal, FilterOption } from "../components/FilterModal";
import { SortModal, SortOption } from "../components/SortModal";
import { useCars } from "../hooks/useCars";
import { useFavorites } from "../hooks/useFavorites";
import { BottomTabParamList, RootStackParamList } from "../navigation/types";
import { Car } from "../types/Car";

type CarLibraryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "CarLibrary">,
  NativeStackNavigationProp<RootStackParamList>
>;

type CarLibraryScreenProps = {
  navigation: CarLibraryScreenNavigationProp;
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const CarLibraryScreen = ({ navigation }: CarLibraryScreenProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [filterOption, setFilterOption] = useState<FilterOption>({
    carType: undefined,
    tags: [],
  });

  const debouncedSearch = useDebounce(searchInput, 800);
  const {
    data: cars,
    isLoading,
    error,
  } = useCars(sortOption, filterOption, debouncedSearch);
  const { favorites, loading: favoritesLoading } = useFavorites();

  const cancelAnim = useSharedValue(0);
  const cancelStyle = useAnimatedStyle(() => ({
    opacity: cancelAnim.value,
    transform: [{ translateX: withTiming(cancelAnim.value ? 0 : 12) }],
  }));

  useEffect(() => {
    if (cars && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [cars, isInitialLoading]);

  // Filter cars based on favorites
  const displayCars = useMemo(() => {
    if (!cars) return [];
    if (!showFavoritesOnly) return cars;
    return cars.filter((car) => favorites.includes(car.id));
  }, [cars, showFavoritesOnly, favorites]);

  const handleFocusSearch = () => {
    setIsSearching(true);
    cancelAnim.value = withTiming(1, { duration: 200 });
  };

  const handleCancelSearch = () => {
    setSearchInput("");
    setIsSearching(false);
    cancelAnim.value = withTiming(0, { duration: 200 });
    Keyboard.dismiss();
  };

  const handleCardPress = (car: Car) => {
    navigation.navigate("CarDetail", { car });
  };

  const handleToggleFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const hasActiveFilters = filterOption.carType || filterOption.tags.length > 0;

  if ((isInitialLoading && isLoading) || favoritesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading cars...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load cars</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderEmptyComponent = () => {
    if (isLoading) return null;

    if (showFavoritesOnly && favorites.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the heart icon on cars to add them to favorites
          </Text>
        </View>
      );
    }

    if (showFavoritesOnly && displayCars.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/nodata.png")}
            style={styles.emptyImage}
            contentFit="contain"
          />
          <Text style={styles.emptySubtext}>
            No favorite cars match your filters
          </Text>
        </View>
      );
    }

    if (debouncedSearch && displayCars.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/nodata.png")}
            style={styles.emptyImage}
            contentFit="contain"
          />
          <Text style={styles.emptySubtext}>
            No result found with "{debouncedSearch}"
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("AddCar")}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.primaryButtonText}>New Car</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cars..."
            value={searchInput}
            onChangeText={setSearchInput}
            onFocus={handleFocusSearch}
            placeholderTextColor="#7c7c7c"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={handleCancelSearch}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {isSearching ? (
          <Animated.View style={cancelStyle}>
            <TouchableOpacity onPress={handleCancelSearch}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setSortModalVisible(true)}
            >
              <Ionicons name="swap-vertical" size={20} color="#1a1a1a" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.iconButton,
                hasActiveFilters && styles.iconButtonActive,
              ]}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons
                name="funnel-outline"
                size={20}
                color={hasActiveFilters ? "#7C3AED" : "#1a1a1a"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.iconButton,
                showFavoritesOnly && styles.iconButtonFavorite,
              ]}
              onPress={handleToggleFavorites}
            >
              <Ionicons
                name={showFavoritesOnly ? "heart" : "heart-outline"}
                size={20}
                color={showFavoritesOnly ? "#FF3B30" : "#1a1a1a"}
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {isLoading && debouncedSearch.length > 0 && (
        <View style={styles.listLoader}>
          <ActivityIndicator size="small" color="#7C3AED" />
          <Text style={styles.listLoaderText}>Searching...</Text>
        </View>
      )}

      <FlatList
        data={displayCars}
        renderItem={({ item }) => (
          <CarCard item={item} onPress={handleCardPress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={displayCars.length > 1 ? styles.column : undefined}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          displayCars.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        ListEmptyComponent={renderEmptyComponent}
        extraData={favorites}
      />

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSelect={setSortOption}
        currentSort={sortOption}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={setFilterOption}
        currentFilter={filterOption}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#9B72D2",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    gap: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 21,
    paddingHorizontal: 10,
    height: 42,
    backgroundColor: "#fafafa",
    gap: 6,
  },
  searchInput: {
    flex: 1,
    color: "#1a1a1a",
  },
  iconButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonActive: {
    backgroundColor: "#f0f8ff",
    borderColor: "#7C3AED",
  },
  iconButtonFavorite: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FF3B30",
  },
  cancelText: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#FF3B30",
  },
  favoriteBannerText: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "600",
  },
  listLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 6,
  },
  listLoaderText: {
    fontSize: 13,
    color: "#666",
  },
  column: {
    gap: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
  },
  emptyImage: {
    width: 100,
    height: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
