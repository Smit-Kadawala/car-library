import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { BottomTabParamList, RootStackParamList } from "../navigation/types";
import { Car } from "../types/Car";

type CarLibraryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "CarLibrary">,
  NativeStackNavigationProp<RootStackParamList>
>;

type CarLibraryScreenProps = {
  navigation: CarLibraryScreenNavigationProp;
};

/* -------------------- */
/* Debounce Hook */
/* -------------------- */
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const CarLibraryScreen = ({ navigation }: CarLibraryScreenProps) => {
  /* -------------------- */
  /* State */
  /* -------------------- */
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [filterOption, setFilterOption] = useState<FilterOption>({
    carType: undefined,
    tags: [],
  });

  /* -------------------- */
  /* Search */
  /* -------------------- */
  const debouncedSearch = useDebounce(searchInput, 800);

  const {
    data: cars,
    isLoading,
    error,
  } = useCars(sortOption, filterOption, debouncedSearch);

  const memoizedCars = useMemo(() => cars ?? [], [cars]);

  useEffect(() => {
    if (cars && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [cars, isInitialLoading]);

  /* -------------------- */
  /* Cancel Animation */
  /* -------------------- */
  const cancelAnim = useSharedValue(0);

  const cancelStyle = useAnimatedStyle(() => ({
    opacity: cancelAnim.value,
    transform: [
      {
        translateX: withTiming(cancelAnim.value ? 0 : 12),
      },
    ],
  }));

  /* -------------------- */
  /* Handlers */
  /* -------------------- */
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

  const hasActiveFilters = filterOption.carType || filterOption.tags.length > 0;

  /* -------------------- */
  /* FIRST LOAD ONLY */
  /* -------------------- */
  if (isInitialLoading && isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1f8ef1" />
          <Text style={styles.loadingText}>Loading cars...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Failed to load cars</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* -------------------- */
  /* Render */
  /* -------------------- */
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("AddCar")}
        >
          <Text style={styles.primaryButtonText}>New Car</Text>
        </TouchableOpacity>
      </View>

      {/* Search Row */}
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

        {/* Animated Cancel */}
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

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#1a1a1a"
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* List loader (search only) */}
      {isLoading && debouncedSearch.length > 0 && (
        <View style={styles.listLoader}>
          <ActivityIndicator size="small" color="#7C3AED" />
          <Text style={styles.listLoaderText}>Searching...</Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={memoizedCars}
        renderItem={({ item }) => (
          <CarCard item={item} onPress={handleCardPress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={
          [
            // styles.listContent,
            // memoizedCars.length === 0 && styles.flexGrow,
          ]
        }
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          debouncedSearch.length > 0 && !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No cars found</Text>

              <Text style={styles.emptySubtext}>
                Try a different keyword or filters
              </Text>
            </View>
          ) : null
        }
      />

      {/* Modals */}
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

/* -------------------- */
/* Styles */
/* -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#1f8ef1",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
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
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 6,
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
  cancelText: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "600",
  },
  listLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
    paddingVertical: 6,
  },
  listLoaderText: {
    fontSize: 13,
    color: "#666",
  },
  listContent: {
    paddingBottom: 16,
  },
  column: {
    gap: 12,
  },
  flexGrow: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    paddingVertical: 60,
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
  },
});
