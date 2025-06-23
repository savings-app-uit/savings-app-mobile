import { getIconsAPI } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type AddCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (category: { name: string; icon: string; color: string }) => void;
};

export default function AddCategoryModal({ visible, onClose, onSave }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<any>(null);
  const [iconList, setIconList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load icons from API when modal opens
  useEffect(() => {
    if (visible) {
      loadIcons();
    }
  }, [visible]);  const loadIcons = async () => {
    setLoading(true);
    try {
      console.log('Loading icons from API...');
      const response = await getIconsAPI();
      console.log('Icons API Response:', response);
      
      if (response && Array.isArray(response) && response.length > 0) {
        // Response đã được unwrap bởi interceptor, response chính là array của icons
        // Không cần map lại vì dữ liệu đã đúng format: { id, icon, color }
        console.log('Icons loaded:', response);
        setIconList(response);
        setSelectedIcon(response[0]); // Select first icon by default
      } else {
        console.log('No icons data in response');
        throw new Error('No icons data');
      }
    } catch (error) {
      console.error('Error loading icons:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách biểu tượng');
        // Fallback to default icons if API fails
      const defaultIcons = [
        { id: "restaurant", icon: "restaurant", color: "#FF6B6B" },
        { id: "car", icon: "car", color: "#4ECDC4" },
        { id: "home", icon: "home", color: "#6C5CE7" },
        { id: "gift", icon: "gift", color: "#F8C291" },
        { id: "heart", icon: "heart", color: "#E5989B" },
        { id: "cash", icon: "cash", color: "#00B894" },
      ];
      setIconList(defaultIcons);
      setSelectedIcon(defaultIcons[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }
    if (!selectedIcon) {
      Alert.alert('Lỗi', 'Vui lòng chọn biểu tượng');
      return;
    }
    
    onSave({ 
      name: name.trim(), 
      icon: selectedIcon.icon, 
      color: selectedIcon.color 
    });
    
    // Reset form
    setName("");
    setSelectedIcon(null);
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
            style={styles.input}            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Chọn biểu tượng</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Đang tải biểu tượng...</Text>
            </View>
          ) : (            <FlatList
              data={iconList}
              keyExtractor={(item) => item.id}
              numColumns={4}
              scrollEnabled={true}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iconBox,
                    selectedIcon?.id === item.id && {
                      backgroundColor: item.color + '22',
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
          )}

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
  },  label: {
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
    paddingVertical: 8,    borderRadius: 8,
  },
  
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});