import { useTransactionContext } from '@/contexts/TransactionContext';
import { getCategoriesAPI, getExpensesAPI, getIncomesAPI } from '@/utils/api';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import AddCategoryModal from "../component/AddCategoryModal";
import Filter from "../component/filter";

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
        <TouchableOpacity onPress={toggleCalendar}>
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
                    <View key={tx.id} style={styles.transactionRow}>
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
                  );
                })}
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

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
        onSave={() => null}
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
});