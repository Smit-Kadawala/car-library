import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Car } from "../types/Car";

const FALLBACK_IMAGE = require("../assets/fallback.png");

type CarCardProps = {
  item: Car;
  onPress: (car: Car) => void;
};

export const CarCard = ({ item, onPress }: CarCardProps) => {
  const [failed, setFailed] = useState(false);
  const isAutomatic = item.carType === "automatic";
  const typeColors = isAutomatic
    ? { backgroundColor: "#E5F6EB", borderColor: "#2F9E55", color: "#2F9E55" }
    : { backgroundColor: "#F5E7D0", borderColor: "#997C4C", color: "#997C4C" };
  const source = failed ? FALLBACK_IMAGE : { uri: item.imageUrl };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={source}
        style={styles.cardImage}
        contentFit="cover"
        onError={() => setFailed(true)}
      />

      <View style={styles.cardContent}>
        <Text style={styles.carName} numberOfLines={1}>
          {item.name}
        </Text>
      </View>

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
  cardContent: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
  },
  carName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  carDescription: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 16,
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
