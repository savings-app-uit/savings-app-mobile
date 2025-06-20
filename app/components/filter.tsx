import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (selected: string[]) => void;
  onAddCategory: () => void;
  categories: { name: string; icon: string; color: string }[]; // danh sách truyền vào
}

export default function Filter({
  visible,
  onClose,
  onApply,
  onAddCategory,
  categories,
}: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleApply = () => {
    onApply(selectedCategories);
    onClose();
  };

  const clearFilter = () => {
    setSelectedCategories([]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Filter by category</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.iconRow}>
              {categories.map((cat, idx) => {
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.iconContainer,
                      isSelected && {
                        borderWidth: 2,
                        borderColor: cat.color,
                        borderRadius: 10,
                      },
                    ]}
                    onPress={() => toggleCategory(cat.name)}
                  >
                    <Ionicons name={cat.icon as any} size={30} color={cat.color} />
                    <Text style={styles.iconLabel}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilter}>
              <Text style={{ color: "#999" }}>Xoá bộ lọc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          {/* Close & Add */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={onAddCategory}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={{ fontSize: 12, color: "#fff" }}>Add category</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    height: screenHeight * 0.8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingLeft: 4,
  },
  iconContainer: {
    width: "25%",
    alignItems: "center",
    marginVertical: 12,
    paddingVertical: 6,
  },
  iconLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  clearBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  applyBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#DD5E89",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 20,
    borderRadius: 20,
    padding: 8,
  },
  addButton: {
    backgroundColor: "#DD5E89",
    position: "absolute",
    top: 12,
    left: 20,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
