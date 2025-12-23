import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCarTypes, useTags } from "../hooks/useCars";

export type FilterOption = {
  carType?: string;
  tags: string[];
};

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: FilterOption) => void;
  currentFilter: FilterOption;
};

const PURPLE = "#9B7BD5";

export const FilterModal = ({
  visible,
  onClose,
  onApply,
  currentFilter,
}: FilterModalProps) => {
  const [selectedCarType, setSelectedCarType] = useState<string | undefined>(
    currentFilter.carType
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentFilter.tags
  );
  const [carTypeExpanded, setCarTypeExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);

  const { data: carTypes } = useCarTypes();
  const { data: tags } = useTags();

  useEffect(() => {
    if (visible) {
      setSelectedCarType(currentFilter.carType);
      setSelectedTags(currentFilter.tags);
    }
  }, [visible, currentFilter]);

  const handleCarTypeSelect = (type: string) => {
    setSelectedCarType(selectedCarType === type ? undefined : type);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReset = () => {
    setSelectedCarType(undefined);
    setSelectedTags([]);
  };

  const handleApply = () => {
    onApply({
      carType: selectedCarType,
      tags: selectedTags,
    });
    onClose();
  };

  const hasActiveFilters = selectedCarType || selectedTags.length > 0;

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

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter By</Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Car Type */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setCarTypeExpanded(!carTypeExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>CAR TYPE</Text>
              <Ionicons
                name={carTypeExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color="#666"
              />
            </TouchableOpacity>

            {carTypeExpanded && (
              <View style={[styles.sectionContent, styles.chipContainer]}>
                {carTypes?.map((type) => {
                  const isSelected = selectedCarType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => handleCarTypeSelect(type)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Tags */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setTagsExpanded(!tagsExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>TAGS</Text>
              <Ionicons
                name={tagsExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color="#666"
              />
            </TouchableOpacity>

            {tagsExpanded && (
              <View style={[styles.sectionContent, styles.chipContainer]}>
                {tags?.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => handleTagSelect(tag)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Apply */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: "80%",
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#dcdcdc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  resetText: {
    fontSize: 16,
    fontWeight: "600",
    color: PURPLE,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    letterSpacing: 0.5,
  },

  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
    marginRight: 12,
    marginBottom: 12,
  },

  chipActive: {
    backgroundColor: "#F3E8FF",
    borderColor: PURPLE,
  },

  chipText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  chipTextActive: {
    color: PURPLE,
    fontWeight: "600",
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: "center",
  },

  applyButton: {
    backgroundColor: PURPLE,
    paddingVertical: 16,
    borderRadius: 999,
    width: "50%",
    alignItems: "center",
  },

  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
