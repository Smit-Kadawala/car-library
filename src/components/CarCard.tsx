import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFavorites } from "../hooks/useFavorites";
import { Car } from "../types/Car";

const FALLBACK_IMAGE = require("../assets/fallback.png");

type CarCardProps = {
  item: Car;
  onPress: (car: Car) => void;
};

export const CarCard = ({ item, onPress }: CarCardProps) => {
  const [failed, setFailed] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const isAutomatic = item.carType === "automatic";
  const typeColors = !isAutomatic
    ? { backgroundColor: "#D6F9DB", borderColor: "#D6F9DB", color: "#10A024" }
    : { backgroundColor: "#F5E7D0", borderColor: "#F5E7D0", color: "#997C4C" };
  const source = failed ? FALLBACK_IMAGE : { uri: item.imageUrl };
  const favorite = isFavorite(item.id);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={source}
        style={styles.cardImage}
        contentFit="cover"
        onError={() => setFailed(true)}
      />

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        activeOpacity={0.7}
      >
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={20}
          color={favorite ? "#FF3B30" : "#fff"}
        />
      </TouchableOpacity>

      <Text style={styles.carName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>

      <Text style={[styles.carType, typeColors]}>{item.carType}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 126,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f7f7f7",
    marginBottom: 12,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  carName: {
    position: "absolute",
    left: 10,
    bottom: 10,
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  carType: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    fontWeight: "600",
    fontSize: 12,
    textTransform: "capitalize",
  },
});
