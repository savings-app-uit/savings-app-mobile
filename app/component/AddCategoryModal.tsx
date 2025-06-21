import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const iconList = [
  "restaurant-outline",
  "car-outline",
  "cart-outline",
  "game-controller-outline",
  "document-text-outline",
  "heart-outline",
  "home-outline",
  "cash-outline",
  "bicycle-outline",
];

type AddCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (category: { name: string; icon: string }) => void;
};

export default function AddCategoryModal({ visible, onClose, onSave }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconList[0]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon: selectedIcon });
    setName("");
    setSelectedIcon(iconList[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Thêm danh mục</Text>

          <TextInput
            placeholder="Tên danh mục"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.label}>Chọn biểu tượng</Text>
          <FlatList
            data={iconList}
            keyExtractor={(item) => item}
            numColumns={4}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconBox,
                  item === selectedIcon && styles.selectedIconBox,
                ]}
                onPress={() => setSelectedIcon(item)}
              >
                <Ionicons
                  name={item as any}
                  size={28}
                  color={item === selectedIcon ? "#fff" : "#333"}
                />
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#eee",
    margin: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIconBox: {
    backgroundColor: "#DD5E89",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelBtn: {
    marginRight: 12,
  },
  saveBtn: {
    backgroundColor: "#DD5E89",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});