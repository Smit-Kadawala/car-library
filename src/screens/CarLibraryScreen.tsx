import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CarCard } from "../components/CarCard";
import { BottomTabParamList, RootStackParamList } from "../navigation/types";
import { Car } from "../types/Car";

type CarLibraryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "CarLibrary">,
  NativeStackNavigationProp<RootStackParamList>
>;

type CarLibraryScreenProps = {
  navigation: CarLibraryScreenNavigationProp;
};

export const CarLibraryScreen = ({ navigation }: CarLibraryScreenProps) => {
  const [apiData, setApiData] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars"
        );
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.warn("Failed to load cars", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleCardPress = (car: Car) => {
    navigation.navigate("CarDetail", { car });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1f8ef1" />
          <Text style={styles.loadingText}>Loading cars...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Car }) => (
    <CarCard item={item} onPress={handleCardPress} />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header - Moved outside FlatList */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>New Car</Text>
        </TouchableOpacity>
      </View>

      {/* Search Row - Moved outside FlatList */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cars..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#7c7c7c"
          />
        </View>
        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Sort">
          <Ionicons name="swap-vertical" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Filter">
          <Ionicons name="options-outline" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Select">
          <Ionicons name="checkmark-circle-outline" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* FlatList - Without ListHeaderComponent */}
      <FlatList
        data={apiData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
    paddingHorizontal: 8,
    backgroundColor: "#fafafa",
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    height: 42,
    paddingHorizontal: 6,
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
  listContent: {
    paddingBottom: 16,
  },
  column: {
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
