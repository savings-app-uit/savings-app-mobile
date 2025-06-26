import { useTransactionContext } from '@/contexts/TransactionContext';
import { getCategoriesAPI, getExpensesAPI, getIncomesAPI, deleteTransactionAPI } from '@/utils/api';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import { Calendar } from "react-native-calendars";
import AddCategoryModal from "../component/AddCategoryModal";
import Filter from "../component/filter";
import { BlurView } from 'expo-blur';
import { useTabBarVisibility } from '@/contexts/TabBarVisibilityContext';
import { useRouter } from 'expo-router';
import ConfirmDeleteModal from '../component/ConfirmDelete';


type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function HistoryScreen() {
  const { reloadTrigger } = useTransactionContext();
  const [expanded, setExpanded] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [transactions, setTransactions] = useState<any[]>([]);  useEffect(() => {
    console.log('History - Loading data for:', { activeTab, currentMonth, reloadTrigger });
    
    Promise.all([
      getCategoriesAPI(activeTab),
      activeTab === 'expense' ? getExpensesAPI() : getIncomesAPI()
    ]).then(([categoriesRes, transactionsRes]) => {
      console.log('History - Categories response:', categoriesRes);
      console.log('History - Transactions response:', transactionsRes);
      
      const arr = Array.isArray(categoriesRes) ? categoriesRes : [];
      const processedCategories = arr.map((cat: ICategory) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon.icon,
        color: cat.icon.color,
      }));
      setCategories(processedCategories);
      
      const transactions = Array.isArray(transactionsRes) ? transactionsRes : [];
      
      const processedTransactions = transactions.map((tx: any) => {
        let dateString = '';
        if (tx.date && tx.date._seconds) {
          const date = new Date(tx.date._seconds * 1000);
          dateString = date.toISOString().split('T')[0]; 
        } else if (typeof tx.date === 'string') {
          dateString = tx.date.split('T')[0]; 
        }
        
        const category = processedCategories.find((cat: any) => cat.id === tx.categoryId);
        const categoryName = category?.name || tx.categoryName || tx.category || 'Khác';
        
        return {
          ...tx,
          date: dateString,
          category: categoryName,
          title: tx.description || tx.title || ''
        };
      });
      
      console.log('History - Processed transactions:', processedTransactions);
      setTransactions(processedTransactions);
    }).catch((error) => {
      console.error('History - Error fetching data:', error);
      setCategories([]);
      setTransactions([]);
    });
  }, [activeTab, reloadTrigger]);

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.name === category);
    return cat ? cat.icon : 'help-circle-outline';
  };

  const filteredData = transactions.filter(
    (tx) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(tx.categoryName || tx.category)) &&
      tx.date && tx.date.startsWith(currentMonth)
  );

  const totalAmount = filteredData.reduce((sum, tx) => sum + tx.amount, 0);

  const noteMap = filteredData.reduce<Record<string, number>>((map, tx) => {
    if (!map[tx.date]) {
      map[tx.date] = 0;
    }
    map[tx.date] += tx.amount;
    return map;
  }, {});

  const groupedData = () => {
    const sorted = [...filteredData].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
    const groups: { [key: string]: typeof filteredData } = {};
    for (const tx of sorted) {
      if (!groups[tx.date]) {
        groups[tx.date] = [];
      }
      groups[tx.date].push(tx);
    }

    return Object.entries(groups).map(([date, data]) => ({
      date,
      data,
      id: date,
    }));
  };

  const toggleCalendar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const transactionRefs = useRef<Record<string, View | null>>({});
  const [transactionBoxPosition, setTransactionBoxPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [loading, setLoading] = useState(false);
  const { triggerReload } = useTransactionContext();
  
  const { setVisible } = useTabBarVisibility();

  const dismissContextMenu = () => {  
  setContextMenuVisible(false);
  setSelectedTransaction(null);
  setVisible(true);
};

  const handleEdit = () => {
    router.push({
      pathname: '../EditTransaction',
      params: {
        transaction: JSON.stringify(selectedTransaction), // cần stringify nếu là object
      },
    });
  };

  const handleDelete = async () => {
    try {
      setShowDeleteModal(false);
      setLoading(true);
      if (!selectedTransaction) return;
      await deleteTransactionAPI(selectedTransaction.id);
      dismissContextMenu();
      triggerReload(); // nếu có context reload
      Alert.alert('Thành công', 'Giao dịch đã được xoá');
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể xoá giao dịch');
    } finally {
      setShowDeleteModal(false);
      setSelectedTransaction(null); // ✅ Reset tại đây
      setContextMenuVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#DD5E89", "#EB8E90", "#F7BB97"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "10%",
            padding: 16,
          }}
        >
          <Text style={styles.title}>Lịch sử giao dịch</Text>
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Calendar */}
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 30,
          backgroundColor: "#fff",
          boxShadow: "8px 3px 22px 10px rgba(150, 150, 150, 0.11)",
        }}
      >
        {expanded && (
          <Calendar
            onVisibleMonthsChange={(months) => {
              if (months && months.length > 0) {
                setCurrentMonth(months[0].dateString.slice(0, 7));
              }
            }}
            theme={{
              arrowColor: "#333",
              textMonthFontSize: 18,
              textMonthFontWeight: "bold",
            }}
            hideExtraDays={true}
            renderHeader={() => {
              const [year, month] = currentMonth.split("-");
              // const displayDate = new Date(Number(year), Number(month) - 1);

              return (
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {`Tháng ${Number(month)}/${year}`}
                  </Text>

                  {/* Toggle */}
                  <View
                    style={{
                      marginTop: 8,
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 16,
                    }}
                  >
                    {["expense", "income"].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() =>
                          setActiveTab(type as "expense" | "income")
                        }
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 16,
                          borderRadius: 20,
                          backgroundColor:
                            activeTab === type ? "#EB8E90" : "#eee",
                        }}
                      >
                        <Text
                          style={{
                            color: activeTab === type ? "white" : "black",
                            fontWeight: "bold",
                          }}
                        >
                          {type === "expense"
                            ? "Tổng chi"
                            : "Tổng thu"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>                 
                  <View style={{ alignItems: "center", marginTop: 4 }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      {typeof totalAmount === 'number' ? totalAmount.toLocaleString("vi-VN") : '0'}đ
                    </Text>
                  </View>
                </View>
              );
            }}
            style={styles.calendar}
            dayComponent={({ date, state }) => {
              if (!date) return null;
              const key = date.dateString;
              const note = noteMap[key];

              return (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderTopWidth: 1,
                    borderTopColor: "#ddd",
                    borderLeftColor: "#ddd",
                    borderLeftWidth: 1,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      padding: 4,
                      fontSize: 14,
                      color: state === "disabled" ? "#ccc" : "#000",
                    }}
                  >
                    {date.day}
                  </Text>

                  {note !== undefined && (
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#bbb",
                        position: "absolute",
                        bottom: 2,
                        right: 0,
                      }}
                    >
                      {Math.floor(note / 1000).toLocaleString("vi-VN")}K
                    </Text>
                  )}
                </View>
              );
            }}
          />
        )}
        <TouchableOpacity onPress={() => { toggleCalendar();}}>
          <View style={styles.toggleBtn}>
            {expanded ? (
              <Ionicons name={"chevron-up"} size={24} color="#999" />
            ) : (
              <Ionicons name={"chevron-down"} size={24} color="#999" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* List */}
      <Text style={styles.sectionTitle}>
        {activeTab === "expense" ? "Danh sách chi" : "Danh sách thu"}
      </Text>
      {groupedData().length === 0 ? (
        <Text
          style={{ textAlign: "center", color: "gray", marginTop: 32 }}
        >
          Không có giao dich trong tháng này
        </Text>
      ) : (
        <FlatList
          data={groupedData()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            
              <View style={styles.card}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <View style={styles.dataCard}>
                  {item.data.map((tx) => {
                    
                  const cat = categories.find((c) => c.name === tx.category);
                  return (
                    <TouchableOpacity
                      key={tx.id}
                      ref={(ref) => { transactionRefs.current[tx.id] = ref; }}
                      onLongPress={() => {
                        const ref = transactionRefs.current[tx.id];
                        setIsHolding(true);
                        if (ref) {
                          ref.measure((x, y, width, height, pageX, pageY) => {
                            setSelectedTransaction(tx);
                            setContextMenuVisible(true);
                            setVisible(false);
                            setContextMenuPosition({ x: pageX, y: pageY });
                            setTransactionBoxPosition({ x: pageX, y: pageY, width, height });
                          });
                        }
                      }}
                      style={[
                        styles.transactionRow,
                        selectedTransaction === tx.id && styles.highlightedRow,
                      ]}>
                    <View key={tx.id}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 8,
                        }}
                      >
                        <View
                          style={{
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <Ionicons
                            name={getCategoryIcon(tx.category) as any}
                            size={24}
                            color={cat?.color ?? "#000"}
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            style={{
                              color: cat?.color ?? "#000",
                              fontWeight: "bold",
                            }}
                          >
                            {tx.category}
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              color: "black",
                              fontSize: 24,
                              fontWeight: "bold",
                            }}
                          >
                            {tx.amount.toLocaleString("vi-VN")}đ
                          </Text>
                          <Text style={{ fontSize: 12, color: "grey" }}>
                            {tx.title}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}  
      {contextMenuVisible && (
  <View style={StyleSheet.absoluteFill}>
    {/* Overlay */}
    <TouchableWithoutFeedback onPress={dismissContextMenu}>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
    </TouchableWithoutFeedback>

    {/* Giao dịch được chọn hiển thị nổi lên */}
    {selectedTransaction && (
      <View
        style={[
          styles.transactionRow,
          styles.highlightedRow,
          {
            position: 'absolute',
            top: transactionBoxPosition.y,
            left: transactionBoxPosition.x,
            width: transactionBoxPosition.width,
            backgroundColor: '#fff',
            borderRadius: 12,
            elevation: 5,
            zIndex: 1000,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 8,
          }}
        >
          <View>
            <Ionicons
              name={getCategoryIcon(selectedTransaction.category) as any}
              size={24}
              color={
                categories.find((c) => c.name === selectedTransaction.category)
                  ?.color ?? '#000'
              }
            />
            <Text style={{ fontWeight: 'bold' }}>
              {selectedTransaction.category}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {selectedTransaction.amount.toLocaleString('vi-VN')}đ
            </Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>
              {selectedTransaction.title}
            </Text>
          </View>
        </View>
      </View>
    )}

      {/* Menu nổi */}
      <View
        style={[
          styles.contextMenu,
          {
            top: transactionBoxPosition.y + 80,
            right: transactionBoxPosition.x,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            dismissContextMenu();
            handleEdit();
          }}
        >
          <Text style={{ color: 'black', fontFamily: 'Inter', fontSize: 16 }}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setContextMenuVisible(false); // ✅ Chỉ ẩn menu, KHÔNG xoá selectedTransaction
            setShowDeleteModal(true);
            setIsHolding(false);
          }}
        >
          <Text style={{ color: 'red',  fontFamily: 'Inter', fontSize: 16 }}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
      <ConfirmDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
      <Filter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(selected) => setSelectedCategories(selected)}
        onAddCategory={() => setAddModalOpen(true)}
        categories={categories}
      />

      <AddCategoryModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={() => {
          triggerReload(); // << Gọi reload sau khi thêm danh mục
          setAddModalOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f2f8", fontFamily: "inter" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#fff" },
  toggleBtn: { alignSelf: "center", marginBottom: 10 },
  calendar: { width: "100%", borderRadius: 10, marginBottom: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    padding: 16,
  },
  card: {
    backgroundColor: "#EB8E90",
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  dataCard: {
    backgroundColor: "#fff",
    margin: -12,
    borderRadius: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  transactionRow: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  highlightedRow: {
  backgroundColor: "#ffecec",
  borderColor: "#ff9999",
  borderWidth: 1,
  borderRadius: 8,
},

contextMenu: {
  position: "absolute",
  backgroundColor: "#fff",
  padding: 8,
  borderRadius: 8,
  elevation: 5,
  zIndex: 9999,
},

menuItem: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',

},
});