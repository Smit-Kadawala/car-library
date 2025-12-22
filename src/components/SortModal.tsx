import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type SortOption = {
  sortBy: "name" | "createdAt";
  sortOrder: "ASC" | "DESC";
};

type SortModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: SortOption) => void;
  currentSort: SortOption;
};

const PURPLE = "#7C3AED";

export const SortModal = ({
  visible,
  onClose,
  onSelect,
  currentSort,
}: SortModalProps) => {
  const isNameAsc =
    currentSort.sortBy === "name" && currentSort.sortOrder === "ASC";
  const isDateDesc =
    currentSort.sortBy === "createdAt" && currentSort.sortOrder === "DESC";

  const handleNameSort = () => {
    const newOrder =
      currentSort.sortBy === "name" && currentSort.sortOrder === "ASC"
        ? "DESC"
        : "ASC";
    onSelect({ sortBy: "name", sortOrder: newOrder });
    onClose();
  };

  const handleDateSort = () => {
    const newOrder =
      currentSort.sortBy === "createdAt" && currentSort.sortOrder === "DESC"
        ? "ASC"
        : "DESC";
    onSelect({ sortBy: "createdAt", sortOrder: newOrder });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.bottomSheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Sort by Name */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleNameSort}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name="text-outline"
                size={22}
                color={isNameAsc ? PURPLE : "#666"}
              />
              <Text
                style={[
                  styles.optionText,
                  isNameAsc && styles.optionTextActive,
                ]}
              >
                Sort by Name (A–Z)
              </Text>
            </View>
            <Ionicons
              name={isNameAsc ? "arrow-up" : "arrow-down"}
              size={20}
              color={isNameAsc ? PURPLE : "#999"}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Sort by Date */}
          <TouchableOpacity
            style={styles.option}
            onPress={handleDateSort}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color={isDateDesc ? PURPLE : "#666"}
              />
              <Text
                style={[
                  styles.optionText,
                  isDateDesc && styles.optionTextActive,
                ]}
              >
                Sort by Date Modified
              </Text>
            </View>
            <Ionicons
              name={isDateDesc ? "arrow-down" : "arrow-up"}
              size={20}
              color={isDateDesc ? PURPLE : "#999"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  bottomSheet: {
    height: 300,
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#dcdcdc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },

  optionText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

  optionTextActive: {
    color: PURPLE,
    fontWeight: "600",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee",
    marginLeft: 20,
  },
});
