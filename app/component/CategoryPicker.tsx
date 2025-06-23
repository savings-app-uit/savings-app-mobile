import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (
    selected: string, 
    selectedId?: string
  ) => void;
  categories: { 
    id?: string; 
    name: string; 
    icon: string; 
    color: string 
  }[];
  onAddCategory: () => void;
}

export default function CategoryPicker({
  visible,
  onClose,
  onSelect,
  categories,
  onAddCategory
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Chọn danh mục</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.iconRow}>
              {categories.map((cat, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.iconContainer}
                  onPress={() => {
                    onSelect(cat.name, cat.id);
                    onClose();
                  }}
                >
                  <Ionicons name={cat.icon as any} size={30} color={cat.color} />
                  <Text style={styles.iconLabel}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Nút đóng */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={onAddCategory}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={{ fontSize: 12, color: "#fff" }}>Thêm danh mục</Text>
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