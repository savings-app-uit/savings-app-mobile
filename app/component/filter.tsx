import { useTransactionContext } from '@/contexts/TransactionContext';
import { deleteCategoryAPI } from '@/utils/api';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfirmDeleteModal from "./ConfirmDelete";

const screenHeight = Dimensions.get("window").height;

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (selected: string[]) => void;
  onAddCategory: () => void;
  categories: { id: string; name: string; icon: string; color: string }[]; 
}

export default function Filter({
  visible,
  onClose,
  onApply,
  onAddCategory,
  categories,
}: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);
  const { triggerReload } = useTransactionContext();

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

  const handleDeleteCategory = async () => {
    try {
      setShowCategoryDeleteModal(false);

      let successCount = 0;
      let failedCount = 0;
      let unauthorizedCount = 0;
      
      for (const name of selectedCategories) {
        const cat = categories.find((c) => c.name === name);
        if (cat) {
          try {
            const response = await deleteCategoryAPI(cat.id); 
            if (response?.message === "Category deleted successfully") {
              successCount++;
            } else {
              failedCount++;
            }
          } catch (singleError: any) {
            if (singleError.response?.data?.message === "Unauthorized to delete this category") {
              unauthorizedCount++;
            } else {
              failedCount++;
            }
          }
        }
      }

      triggerReload();
      
      // Hiển thị thông báo dựa trên kết quả
      if (successCount === selectedCategories.length) {
        // Tất cả đều xóa thành công
        Alert.alert('Thành công', 'Đã xóa danh mục được chọn');
      } else if (successCount > 0) {
        // Một số xóa thành công, một số thất bại
        Alert.alert('Cảnh báo', `Đã xóa ${successCount}/${selectedCategories.length} danh mục. ${unauthorizedCount > 0 ? 'Một số danh mục mặc định không thể xóa.' : 'Một số danh mục không thể xóa.'}`);
      } else if (unauthorizedCount > 0) {
        // Tất cả đều là danh mục mặc định
        Alert.alert('Lỗi', 'Bạn không được xóa danh mục mặc định');
      } else {
        // Tất cả đều thất bại vì lý do khác
        Alert.alert('Lỗi', 'Không thể xóa danh mục đã chọn');
      }
      
      setSelectedCategories([]); 
    } catch (error: any) {
      console.error('Delete category error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa danh mục');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Chọn danh mục</Text>
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
          <TouchableOpacity 
            style={styles.addButton} 
            disabled={selectedCategories.length === 0}
            onPress={() => setShowCategoryDeleteModal(true)}>
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={{ fontSize: 12, color: "#fff" }}>Xóa danh mục</Text>
          </TouchableOpacity>
          <ConfirmDeleteModal
            visible={showCategoryDeleteModal}
            onClose={() => setShowCategoryDeleteModal(false)}
            onConfirm={handleDeleteCategory}
            itemType = 'category'
          />
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