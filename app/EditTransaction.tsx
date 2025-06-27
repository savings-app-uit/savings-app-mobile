import { useTransactionContext } from '@/contexts/TransactionContext';
import { addCategoryAPI, getCategoriesAPI, updateTransactionAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AddCategoryModal from './component/AddCategoryModal';
import CategoryPicker from './component/CategoryPicker';

// Cấu hình tiếng Việt cho Calendar
LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  monthNamesShort: [
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
    'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
  ],
  dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay'
};
LocaleConfig.defaultLocale = 'vi';

export default function EditTransactionScreen() {
  const params = useLocalSearchParams();
  const transaction = JSON.parse(params.transaction as string);
  const { triggerReload } = useTransactionContext();

  const [amount, setAmount] = useState(transaction.amount.toString());
  const [displayAmount, setDisplayAmount] = useState('');
  const [date, setDate] = useState(new Date(transaction.date));
  const [category, setCategory] = useState(transaction.category);
  const [categoryId, setCategoryId] = useState(transaction.categoryId || '');
  const [note, setNote] = useState(transaction.description || '');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const type: 'expense' | 'income' = transaction.type;

  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (!numericValue) return '';
    
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (text: string) => {
    const numericText = text.replace(/[^\d]/g, '');
    
    if (numericText === '') {
      setAmount('');
      setDisplayAmount('');
      return;
    }
    
    setAmount(numericText);
    
    const formatted = formatCurrency(numericText);
    setDisplayAmount(formatted);
  };

  useEffect(() => {
    const initialFormatted = formatCurrency(transaction.amount.toString());
    setDisplayAmount(initialFormatted);
  }, []);

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

  const formatDateForCalendar = (d: Date) => {
    return moment(d).format('YYYY-MM-DD');
  };

  const parseCalendarDate = (dateString: string) => {
    return moment(dateString, 'YYYY-MM-DD').toDate();
  };

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
              placeholder="0"
              value={displayAmount}
              onChangeText={handleAmountChange}
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
            <TouchableOpacity style={styles.input} onPress={() => setShowCalendarModal(true)}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </TouchableOpacity>

            {/* Calendar Modal */}
            <Modal
              visible={showCalendarModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowCalendarModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.calendarContainer}>
                  <View style={styles.calendarHeader}>
                    <Text style={styles.calendarTitle}>Chọn ngày giao dịch</Text>
                    <TouchableOpacity 
                      onPress={() => setShowCalendarModal(false)}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Calendar
                    current={formatDateForCalendar(date)}
                    onDayPress={(day) => {
                      const selectedDate = parseCalendarDate(day.dateString);
                      setDate(selectedDate);
                      setShowCalendarModal(false);
                    }}
                    markedDates={{
                      [formatDateForCalendar(date)]: {
                        selected: true,
                        selectedColor: '#DD5E89',
                        selectedTextColor: 'white'
                      }
                    }}
                    theme={{
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      textSectionTitleColor: '#b6c1cd',
                      selectedDayBackgroundColor: '#DD5E89',
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: '#DD5E89',
                      dayTextColor: '#2d4150',
                      textDisabledColor: '#d9e1e8',
                      dotColor: '#00adf5',
                      selectedDotColor: '#ffffff',
                      arrowColor: '#DD5E89',
                      disabledArrowColor: '#d9e1e8',
                      monthTextColor: '#2d4150',
                      indicatorColor: '#DD5E89',
                      textDayFontFamily: 'System',
                      textMonthFontFamily: 'System',
                      textDayHeaderFontFamily: 'System',
                      textDayFontWeight: '300',
                      textMonthFontWeight: 'bold',
                      textDayHeaderFontWeight: '300',
                      textDayFontSize: 16,
                      textMonthFontSize: 16,
                      textDayHeaderFontSize: 13
                    }}
                    maxDate={formatDateForCalendar(new Date())} // Không cho chọn ngày tương lai
                    firstDay={1} // Bắt đầu tuần từ thứ 2
                  />
                  
                  <View style={styles.calendarActions}>
                    <TouchableOpacity 
                      onPress={() => {
                        setDate(new Date());
                        setShowCalendarModal(false);
                      }}
                      style={styles.todayButton}
                    >
                      <Text style={styles.todayButtonText}>Hôm nay</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

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
    color: '#2d4150',
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
  dateText: {
    color: '#000',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    minWidth: '90%',
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  calendarActions: {
    marginTop: 20,
    alignItems: 'center',
  },
  todayButton: {
    backgroundColor: '#DD5E89',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  todayButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
