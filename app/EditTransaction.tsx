import { useTransactionContext } from '@/contexts/TransactionContext';
import { updateTransactionAPI, getCategoriesAPI, addCategoryAPI} from '@/utils/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CategoryPicker from './component/CategoryPicker';
import { Ionicons } from '@expo/vector-icons';
import AddCategoryModal from './component/AddCategoryModal';

export default function EditTransactionScreen() {
  const params = useLocalSearchParams();
  const transaction = JSON.parse(params.transaction as string);
  const { triggerReload } = useTransactionContext();

  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(new Date(transaction.date));
  const [category, setCategory] = useState(transaction.category);
  const [categoryId, setCategoryId] = useState(transaction.categoryId || '');
  const [note, setNote] = useState(transaction.description || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const type: 'expense' | 'income' = transaction.type;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategoriesAPI(type);
      if (response && Array.isArray(response)) {
        const mappedCategories = response.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon.icon,
          color: cat.icon.color,
        }));
        setCategoryList(mappedCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: Date) =>
    `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;

  const handleUpdateTransaction = async () => {
    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (!categoryId) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
      return;
    }

    try {
      setLoading(true);
      await updateTransactionAPI(transaction.id, {
        categoryId,
        amount: parseFloat(amount),
        description: note.trim(),
        date: date.toISOString(),
      });

      Alert.alert('Thành công', 'Đã cập nhật giao dịch');
      triggerReload();
      router.back(); // Quay lại màn hình trước

    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
      router.back();
    };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
    >
      <View style={{ flexGrow: 1, backgroundColor: '#fff'}}>
        <View style={{display: 'flex', flexDirection: 'row', marginTop: 50, alignItems: 'center'}}>
          <TouchableOpacity onPress={handleBack}>
              <Ionicons
                  style={{ marginLeft: 20}}
                  name={'arrow-back'}
                  size={30}
                  color="#999"/>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', position: 'relative', marginLeft: -50 }}>
            <Text style={styles.bold}>Chỉnh sửa giao dịch</Text>
          </View>
        </View>

        <View style={{ padding: 16 }} >
          <View style={styles.card}>
            {/* Loại */}
            <Text style={styles.sectionLabel}>
              {type === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
            </Text>

            {/* Số tiền */}
            <TextInput
              placeholder="0đ"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#666"              
              style={styles.amountInput}
            />
            
            {/* Danh mục */}
            <Text style={styles.label}>Danh mục</Text>
            <TouchableOpacity 
              onPress={() => setShowCategoryModal(true)} 
              style={styles.input}
              disabled={loading}
            >              
              <Text style={{ color: category ? '#000' : '#aaa' }}>
                {loading ? 'Đang tải...' : (category || 'Chọn danh mục')}
              </Text>
            </TouchableOpacity>
            
            <CategoryPicker
              visible={showCategoryModal}
              onClose={() => setShowCategoryModal(false)}
              categories={categoryList}
              onSelect={(name, id) => {
                setCategory(name);
                setCategoryId(id || '');
              }}
              onAddCategory={() => {
                setShowCategoryModal(false);
                setShowAddCategoryModal(true);
              }}
            />

            {showAddCategoryModal && (
              <AddCategoryModal
                visible={showAddCategoryModal}
                onClose={() => setShowAddCategoryModal(false)}    
                onSave={async (newCategory: any) => {
                  try {
                    await addCategoryAPI({
                      name: newCategory.name,
                      iconId: newCategory.icon,
                      type: transaction.type
                    });        
                    await loadCategories();
                    
                    Alert.alert('Thành công', 'Đã thêm danh mục mới');
                  } catch (error) {
                    console.error('Error adding category:', error);
                    Alert.alert('Lỗi', 'Không thể thêm danh mục mới');
                  }
                }}
              />
            )}

            {/* Ngày */}
            <Text style={styles.label}>Ngày giao dịch</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{formatDate(date)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(e, selected) => {
                  setShowDatePicker(false);
                  if (selected) setDate(selected);
                }}
              />
            )}

            {/* Ghi chú */}
            <Text style={styles.label}>Ghi chú</Text>
            <TextInput
              placeholder="Nhập mô tả giao dịch"
              value={note}
              onChangeText={setNote}
              placeholderTextColor="#666"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              style={styles.noteInput}
            />
          </View>
        </View>  

        <TouchableOpacity onPress={handleUpdateTransaction}>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={loading ? ['#ccc', '#ccc', '#ccc'] : ['#DD5E89', '#EB8E90', '#F7BB97']} 
            style={[styles.linearGradient, {marginTop: 60, alignSelf: 'center', width: '80%', height: 50}]}>
          
              <Text style={styles.submitText}>
                Cập nhật giao dịch
              </Text>
            </LinearGradient>
        </TouchableOpacity>
        </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#EB8E90',
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    color: '#666',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bold: {
    fontFamily: 'Inter',
    fontWeight: 700,
    color: '#000',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d63384',
    marginBottom: 8,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
  },
  linearGradient: {
    height: 50,
    backgroundColor: '#DD5E89',
    padding: 16,
    marginBottom: 52,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 20,
    },
});
