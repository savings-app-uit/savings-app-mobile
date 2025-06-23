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
import { iconList } from "../component/data"; // Bạn cần tạo file này chứa iconList

type AddCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (category: { name: string; icon: string; color: string }) => void;
};

export default function AddCategoryModal({ visible, onClose, onSave }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconList[0]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon: selectedIcon.icon, color: selectedIcon.color });
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
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Chọn biểu tượng</Text>
          <FlatList
            data={iconList}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconBox,
                  selectedIcon.icon === item.icon && {
                    backgroundColor: item.color + 22,
                    borderWidth: 2,
                    borderColor: item.color,
                  },
                ]}
                onPress={() => setSelectedIcon(item)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={item.color}
                />
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: "#555" }}>Hủy</Text>
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
    maxHeight: "90%",
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
    color: "#333",
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    margin: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelBtn: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
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