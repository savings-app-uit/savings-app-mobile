      import { Ionicons } from "@expo/vector-icons";
      import { LinearGradient } from "expo-linear-gradient";
      import React, { useState } from "react";
      import { FlatList, LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";
      import { Calendar } from "react-native-calendars";
  import { Colors } from "react-native/Libraries/NewAppScreen";
  import Filter from "../components/filter";
  import { allCategories } from "../components/data";
  // Hiện tại bạn chưa có:
import { transactions } from "../components/data";


  // Define the Category type to include color
  type Category = {
    name: string;
    icon: string;
    color: string;
  };

      if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
      }

    export default function HistoryScreen() {
      const [expanded, setExpanded] = useState(true);
      const [filterVisible, setFilterVisible] = useState(false);
      const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
      const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
      const [categories, setCategories] = useState<Category[]>(allCategories as Category[]);
      
      

      

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.name === category);
    return cat ? cat.icon : "help-circle-outline";
  };



      const groupedTransactionsFromFiltered = () => {
    const sorted = [...filteredTransactions].sort((a, b) => b.date.localeCompare(a.date));
    const groups: { [key: string]: typeof transactions } = {};

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

      const filteredTransactions = transactions.filter(tx =>
    (selectedCategories.length === 0 || selectedCategories.includes(tx.category)) &&
  tx.date.startsWith(currentMonth)
  );

 const totalExpense = filteredTransactions
  .filter(tx => tx.date.startsWith(currentMonth))
  .reduce((sum, tx) => sum + tx.amount, 0);

  const noteMap = filteredTransactions.reduce<Record<string, number>>((map, tx) => {
    if (!map[tx.date]) {
      map[tx.date] = 0;
    }
    map[tx.date] += tx.amount;
    return map;
  }, {});

      return (
          <View style={styles.container}>
          {/* Header */}
          <LinearGradient
              colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10%', padding: 16}}>
                  <Text style={styles.title}>History</Text>
                  <TouchableOpacity onPress={() => setFilterVisible(true)}>
    <Ionicons name="filter" size={24} color="#fff" />
  </TouchableOpacity>
              </View>
          </LinearGradient>

          

          {/* Calendar */}
          <View style={{
                  display: "flex", 
                  flexDirection: "column",
                  borderRadius: 30,
                  backgroundColor: '#fff',
                  boxShadow: '8px 3px 22px 10px rgba(150, 150, 150, 0.11)' }}>
              {expanded && (
              <Calendar
              onVisibleMonthsChange={(months) => {
    if (months && months.length > 0) {
      setCurrentMonth(months[0].dateString.slice(0, 7)); // Lưu dạng "2025-06"
    }
  }}
              theme={{
                  arrowColor: '#333', // hoặc '#000'
                  textMonthFontSize: 18,
                  textMonthFontWeight: 'bold',
                    }}
                  hideExtraDays={true}
                  renderHeader={() => {
    const [year, month] = currentMonth.split('-');
    const displayDate = new Date(Number(year), Number(month) - 1);
    
    return (
      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          {displayDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        {/* Tổng chi tiêu như cũ */}
        <View style={{ marginTop: 8, alignItems: 'center', display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
          <Text style={{ color: 'gray', fontSize: 12 }}>Total expense</Text>
          <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
            {totalExpense.toLocaleString('vi-VN')}đ
          </Text>
        </View>
      </View>
    );
  }}
              style={styles.calendar}
              //Ngày
              dayComponent={({ date, state }) => {
                  if (!date) return null;
                  const key = date.dateString;
                  const note = noteMap[key];
                  return (
                      <View style={{
                          width: 40,
                          height: 40,
                          borderTopWidth: 1,
                          borderTopColor: '#ddd',
                          borderLeftColor: '#ddd',
                          borderLeftWidth: 1,
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                      }}>
                          <Text
                              style={{
                                  padding: 4,
                                  fontSize: 14,
                                  color: state === 'disabled' ? '#ccc' : '#000',
                              }}>
                              {date.day}
                          </Text>

                          {note !== undefined && (
    <Text
      style={{
        fontSize: 10,
        color: "#bbb",
        position: "absolute",
        bottom: 2,
        right: 0
      }}
    >
      {(note / 1000).toLocaleString('vi-VN')}K
    </Text>
  )}
                      </View>
                  );
              }}
              />
          )}
          {/* Toggle Calendar */}
          <TouchableOpacity onPress={toggleCalendar}>
              <View style={styles.toggleBtn}>{expanded ? 
              <Ionicons
                  name={'chevron-up'}
                  size={24}
                  color="#999"/> : 
                  <Ionicons
                  name={'chevron-down'}
                  size={24}
                  color="#999"/>
              }</View>
          </TouchableOpacity>
          </View>
          

          {/* Danh sách giao dịch */}
          <Text style={styles.sectionTitle}>Expense list</Text>
          {groupedTransactionsFromFiltered().length === 0 ? (
  <Text style={{ textAlign: 'center', color: 'gray', marginTop: 32 }}>
    No expense in this month
  </Text>
) : (
              <FlatList
    data={groupedTransactionsFromFiltered()}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.dataCard}>
        {item.data.map((tx) => {
          const cat = allCategories.find((c) => c.name === tx.category);
          return (
          <View key={tx.id} style={styles.transactionRow}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8}}>
                  <View style={{alignItems: "flex-start", gap: 8}}>
                      <Ionicons
                      name={getCategoryIcon(tx.category)}
                      size={24}
                      color={cat?.color ?? "#000"}
                      style={{ marginRight: 8}}
                      />
                      <Text style={{ color: cat?.color ?? "#000", fontWeight: 'bold' }}>{tx.category}</Text>
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                      <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold'}}>
                          {tx.amount.toLocaleString('vi-VN')}đ
                      </Text>
                      <Text style={{fontSize: 12, color: 'grey'}}>{tx.title}</Text>
                  </View>
              </View>
          </View>
        )})}
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
    onAddCategory={() =>{} }
    categories={categories}
  />
          </View>
      );
      }

      const styles = StyleSheet.create({
      container: { flex: 1, backgroundColor: "#f3f2f8", fontFamily: 'inter'},
      title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: '#fff' },
      summary: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
      summaryItem: { fontSize: 14 },
      toggleBtn: { alignSelf: 'center', marginBottom: 10 },
      calendar: { width: '100%', borderRadius: 10, marginBottom: 10 },
      sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10, padding: 16},
      card: {
      backgroundColor: '#EB8E90',
      padding: 12,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 12,
      elevation: 2,
    },
    dataCard: {
      backgroundColor: '#fff',
      margin: -12,
      borderRadius: 12
    },
    cardDate: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 16,
      color: 'white',
    },
    transactionRow: {
      padding: 6,
      borderBottomWidth: 0.5,
      borderBottomColor: '#ccc',
      // backgroundColor: '#fff',
      // borderRadius: 12
    },
      });
