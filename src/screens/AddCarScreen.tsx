import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCarTypes, useCreateCar, useTags } from "../hooks/useCars";
import { RootStackParamList } from "../navigation/types";

type AddCarScreenProps = NativeStackScreenProps<RootStackParamList, "AddCar">;

const PURPLE = "#9B72D2";

export const AddCarScreen = ({ navigation }: AddCarScreenProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [carType, setCarType] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [showCarTypeDropdown, setShowCarTypeDropdown] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [showErrors, setShowErrors] = useState(false); // Track if user attempted to submit

  const { data: carTypes } = useCarTypes();
  const { data: tags } = useTags();
  const createCar = useCreateCar();

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Car name is required");
      return false;
    }
    if (name.length > 50) {
      Alert.alert("Validation Error", "Car name must be 50 characters or less");
      return false;
    }
    if (description.length > 250) {
      Alert.alert(
        "Validation Error",
        "Description must be 250 characters or less"
      );
      return false;
    }
    if (!carType) {
      Alert.alert("Validation Error", "Car type is required");
      return false;
    }
    if (selectedTags.length === 0) {
      Alert.alert("Validation Error", "At least one tag is required");
      return false;
    }
    if (!imageUrl.trim()) {
      Alert.alert("Validation Error", "Car image URL is required");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    setShowErrors(true); // Show validation errors

    if (!validateForm()) return;

    createCar.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        carType,
        tags: selectedTags,
        imageUrl: imageUrl.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Car added successfully", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert("Error", error.message || "Failed to add car");
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Car</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Name */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Car name<Text style={styles.required}>*</Text>
            </Text>
            {showErrors && !name && (
              <Text style={styles.mandatory}>Mandatory!</Text>
            )}
          </View>
          <TextInput
            style={[styles.input, showErrors && !name && styles.inputError]}
            placeholder="Enter car name"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.charCount}>{description.length}/250 char</Text>
          </View>
          <TextInput
            style={[styles.textArea, styles.input]}
            placeholder="Enter description"
            placeholderTextColor="#ccc"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={250}
            textAlignVertical="top"
          />
        </View>

        {/* Car Type */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Car type<Text style={styles.required}>*</Text>
            </Text>
            {showErrors && !carType && (
              <Text style={styles.mandatory}>Mandatory!</Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.dropdown,
              showErrors && !carType && styles.inputError,
            ]}
            onPress={() => setShowCarTypeDropdown(!showCarTypeDropdown)}
          >
            <Text
              style={[styles.dropdownText, !carType && styles.placeholderText]}
            >
              {carType
                ? carType.charAt(0).toUpperCase() + carType.slice(1)
                : "Select"}
            </Text>
            <Ionicons
              name={showCarTypeDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
          {showCarTypeDropdown && (
            <View style={styles.dropdownList}>
              {carTypes?.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCarType(type);
                    setShowCarTypeDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  {carType === type && (
                    <Ionicons name="checkmark" size={20} color={PURPLE} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Tags */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Tags<Text style={styles.required}>*</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.dropdown,
              showErrors && selectedTags.length === 0 && styles.inputError,
            ]}
            onPress={() => setShowTagsDropdown(!showTagsDropdown)}
          >
            <Text
              style={[
                styles.dropdownText,
                selectedTags.length === 0 && styles.placeholderText,
              ]}
            >
              Select
            </Text>
            <Ionicons
              name={showTagsDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
          {showTagsDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.tagsScrollView} nestedScrollEnabled>
                {tags?.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.dropdownItem}
                    onPress={() => handleTagToggle(tag)}
                  >
                    <Text style={styles.dropdownItemText}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Text>
                    {selectedTags.includes(tag) && (
                      <Ionicons name="checkmark" size={20} color={PURPLE} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          {selectedTags.length > 0 && (
            <View style={styles.selectedTags}>
              {selectedTags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Image URL */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Car Image URL<Text style={styles.required}>*</Text>
            </Text>
          </View>
          <TextInput
            style={[styles.input, showErrors && !imageUrl && styles.inputError]}
            placeholder="https://unsplash.com/photos/black-for..."
            placeholderTextColor="#ccc"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            createCar.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={createCar.isPending}
          activeOpacity={0.8}
        >
          {createCar.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  required: {
    color: "#FF3B30",
  },
  mandatory: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "500",
  },
  charCount: {
    fontSize: 14,
    color: "#999",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  textArea: {
    height: 100,
    borderRadius: 16,
    paddingTop: 14,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  placeholderText: {
    color: "#ccc",
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fff",
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tagsScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#333",
  },
  selectedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9B72D21A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  tagChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,

    borderTopColor: "#f0f0f0",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: PURPLE,
    width: "50%",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
