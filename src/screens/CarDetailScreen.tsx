import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { useCar, useDeleteCar } from "../hooks/useCars";
import { RootStackParamList } from "../navigation/types";

const FALLBACK_IMAGE = require("../assets/fallback.png");

type CarDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CarDetail"
>;

export const CarDetailScreen = ({
  route,
  navigation,
}: CarDetailScreenProps) => {
  const { car } = route.params;
  const [failed, setFailed] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  // Use React Query hooks
  const { data: carDetail, isLoading, error } = useCar(car.id);
  const deleteCar = useDeleteCar();

  const source = failed ? FALLBACK_IMAGE : { uri: car.imageUrl };
  const isAutomatic = carDetail?.carType === "automatic";

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    const carId =
      typeof carDetail!.id === "string"
        ? parseInt(carDetail!.id, 10)
        : carDetail!.id;

    deleteCar.mutate(carId, {
      onSuccess: () => {
        setDeleteModalVisible(false);
        Alert.alert("Success", "Car deleted successfully", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      },
      onError: () => {
        setDeleteModalVisible(false);
        Alert.alert("Error", "Failed to delete car");
      },
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1f8ef1" />
          <Text style={styles.loadingText}>Loading car details...</Text>
        </View>
      </View>
    );
  }

  if (error || !carDetail) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Failed to load car details</Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const typeColors = !isAutomatic
    ? { backgroundColor: "#D6F9DB", borderColor: "#D6F9DB", color: "#10A024" }
    : { backgroundColor: "#F5E7D0", borderColor: "#F5E7D0", color: "#997C4C" };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 16 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        <Text style={styles.carName}>{carDetail.name}</Text>

        <View style={styles.imageCard}>
          <Image
            source={source}
            style={styles.carImage}
            contentFit="cover"
            onError={() => setFailed(true)}
          />
        </View>

        <View style={[styles.carTypeBadge, typeColors]}>
          <Text style={[styles.carTypeText, { color: typeColors.color }]}>
            {carDetail.carType}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <Text style={styles.description}>{carDetail.description}</Text>
        </View>

        <View style={styles.divider} />

        {carDetail.tags && carDetail.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TAG</Text>
            <View style={styles.tagsContainer}>
              {carDetail.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footerRow}>
          <Text style={styles.dateText}>{formatDate(carDetail.createdAt)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={deleteCar.isPending}
          >
            {deleteCar.isPending ? (
              <ActivityIndicator size="small" color="#d32f2f" />
            ) : (
              <Ionicons name="trash-outline" size={24} color="#d32f2f" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={deleteModalVisible}
        carName={carDetail.name}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={() => {
          handleDeleteConfirm();
        }}
        isDeleting={deleteCar.isPending}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
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
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    fontWeight: "600",
  },
  carName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  imageCard: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f7f7f7",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  carTypeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  carTypeText: {
    fontWeight: "600",
    fontSize: 14,
    textTransform: "capitalize",
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9B72D2",
  },
  tagText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
  },
});
