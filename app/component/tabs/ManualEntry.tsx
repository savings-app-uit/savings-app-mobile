import { useTransactionContext } from '@/contexts/TransactionContext';
import { addCategoryAPI, addExpenseAPI, addIncomeAPI, getCategoriesAPI } from '@/utils/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AddCategoryModal from '../AddCategoryModal';
import CategoryPicker from '../CategoryPicker';


export default function ManualTransactionForm() {
  const { triggerReload } = useTransactionContext();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [exCategoryList, setExCategoryList] = useState<any[]>([]);
  const [inCategoryList, setInCategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    loadCategories();
    setCategory('');
    setCategoryId('');
  }, [activeTab]);  const loadCategories = async () => {
    setLoading(true);
    try {
      console.log('Loading categories for type:', activeTab);
      const response = await getCategoriesAPI(activeTab);
      console.log('API Response:', response);
      
      if (response && Array.isArray(response)) {
        const mappedCategories = response.map((cat: ICategory) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon.icon, 
          color: cat.icon.color, 
        }));

        console.log('Mapped categories:', mappedCategories);

        if (activeTab === 'expense') {
          setExCategoryList(mappedCategories);
        } else {
          setInCategoryList(mappedCategories);
        }
      } else {
        console.log('No data in response or data is not array');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (d: Date) => {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const handleAddTransaction = async () => {
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
      
      const transactionData = {
        categoryId: categoryId,
        amount: parseFloat(amount),
        description: note.trim() || '', 
        date: date.toISOString() 
      };

      console.log('Adding transaction:', transactionData);      if (activeTab === 'expense') {
        await addExpenseAPI(transactionData);
      } else {
        await addIncomeAPI(transactionData);
      }

      Alert.alert('Thành công', `Đã thêm ${activeTab === 'expense' ? 'chi tiêu' : 'thu nhập'} thành công`);
      
      // Trigger reload data in other screens
      triggerReload();
      
      setAmount('');
      setCategory('');
      setCategoryId('');
      setNote('');
      setDate(new Date());

    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Lỗi', `Không thể thêm ${activeTab === 'expense' ? 'chi tiêu' : 'thu nhập'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('expense')} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === 'expense' && styles.activeTabText]}>
              Chi tiêu
            </Text>
            {activeTab === 'expense' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('income')} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === 'income' && styles.activeTabText]}>
              Thu nhập
            </Text>
            {activeTab === 'income' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16 }} >
          <View style={styles.card}>
            {/* Loại */}
            <Text style={styles.sectionLabel}>
              {activeTab === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
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
              onSelect={(selectedCategory, selectedId) => {
                setCategory(selectedCategory);
                setCategoryId(selectedId || '');
              }}
              categories={activeTab === 'expense' ? exCategoryList : inCategoryList}
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
                      type: activeTab
                    }); 
                    triggerReload();       
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

        {/* Nút thêm giao dịch */}
        <TouchableOpacity onPress={handleAddTransaction} disabled={loading}>
          <LinearGradient 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={loading ? ['#ccc', '#ccc', '#ccc'] : ['#DD5E89', '#EB8E90', '#F7BB97']} 
            style={[styles.linearGradient, {marginTop: 60, alignSelf: 'center', width: '80%', height: 50}]}>
          
              <Text style={styles.submitText}>
                {loading ? 'Đang xử lý...' : 'Thêm giao dịch'}
              </Text>
           </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  activeTabText: {
    color: '#d63384',
    fontWeight: 'bold',
  },
  tabIndicator: {
    marginTop: 4,
    height: 2,
    backgroundColor: '#d63384',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d63384',
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    marginBottom: 16,
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
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  submitButton: {
    height: 50,
    backgroundColor: '#DD5E89',
    padding: 16,
    marginBottom: 52,
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: 16,
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