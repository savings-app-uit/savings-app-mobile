import { getCategoriesAPI, getExpensesAPI, getIncomesAPI } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

type MonthlySummaryProps = {
  activeTab: "expense" | "income";
  setActiveTab: (tab: "expense" | "income") => void;
  currentMonth: string;
  onDataChange?: (data: {
    currentMonth: string;
    chartWithPercent: {
      name: string;
      amount: number;
      percent: string;
      icon?: string;
      color: string;
    }[];
    otherItemsDetail: {
      name: string;
      amount: number;
    }[];
  }) => void;
  setCurrentMonth: (month: string) => void;
  onSelectCategory?: (name: string) => void;
  reloadTrigger?: number;
};
export default function MonthlySummary({
  onDataChange,
  onSelectCategory,
  currentMonth,
  setCurrentMonth,
  activeTab,
  setActiveTab,
  reloadTrigger
}: MonthlySummaryProps) {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  const [chartWithPercent, setChartWithPercent] = useState<any[]>([]);
  const [otherItemsDetail, setOtherItemsDetail] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getMonthOffset = (offset: number) => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + offset);
    return date.toISOString().slice(0, 7);
  };

  const handleMonthChange = (offset: number) => {
    setIsTransitioning(true);
    const newMonth = getMonthOffset(offset);
    setCurrentMonth(newMonth);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const canGoToNextMonth = () => {
    const currentDate = new Date();
    const currentRealMonth = currentDate.toISOString().slice(0, 7); 
    const nextMonth = getMonthOffset(1);
    return nextMonth <= currentRealMonth;
  };  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const [transactionsResponse, categoriesResponse] = await Promise.all([
          activeTab === 'expense' ? getExpensesAPI() : getIncomesAPI(),
          getCategoriesAPI(activeTab)
        ]);

        const transactions = Array.isArray(transactionsResponse) ? transactionsResponse : [];
        const categories = categoriesResponse || [];

        console.log('PieChart - Raw data:', { 
          activeTab, 
          currentMonth,
          totalTransactions: transactions.length,
          totalCategories: categories.length 
        });

        const filteredTransactions = transactions.filter((tx: any) => {
          let dateString = '';
          if (tx.date && tx.date._seconds) {
            const date = new Date(tx.date._seconds * 1000);
            dateString = date.toISOString().split('T')[0]; 
          } else if (typeof tx.date === 'string') {
            dateString = tx.date.split('T')[0]; 
          }
          
          return dateString && dateString.startsWith(currentMonth);
        });

        console.log('PieChart - Filtered transactions:', filteredTransactions);

        const categoryTotals = filteredTransactions.reduce((acc: any, tx: any) => {
          const category = categories.find((cat: any) => cat.id === tx.categoryId);
          const categoryName = category?.name || tx.categoryName || tx.category || 'Khác';
          
          if (!acc[categoryName]) {
            acc[categoryName] = {
              name: categoryName,
              amount: 0,
              icon: 'help-circle-outline',
              color: '#666'
            };
          }
          acc[categoryName].amount += tx.amount || 0;
          return acc;
        }, {});

        Object.keys(categoryTotals).forEach(catName => {
          const category = categories.find((cat: any) => cat.name === catName);
          if (category) {
            categoryTotals[catName].icon = category.icon?.icon || 'help-circle-outline';
            categoryTotals[catName].color = category.icon?.color || '#666';
          }
        });

        const categoryArray = Object.values(categoryTotals);
        const totalAmount = categoryArray.reduce((sum: number, cat: any) => sum + cat.amount, 0);

        // Calculate percentages and sort by amount
        const chartWithPercent = categoryArray
          .map((cat: any) => ({
            ...cat,
            percent: totalAmount > 0 ? ((cat.amount / totalAmount) * 100).toFixed(1) : '0'
          }))
          .sort((a: any, b: any) => b.amount - a.amount);        
        setChartWithPercent(chartWithPercent);
        setTotalAmount(totalAmount);
        setOtherItemsDetail(chartWithPercent.slice(4));
        
        console.log('PieChart - Final result:', {
          chartWithPercent,
          totalAmount,
          otherItems: chartWithPercent.slice(4)
        });
        
        onDataChange?.({ currentMonth, chartWithPercent, otherItemsDetail: chartWithPercent.slice(4) });
      } catch (error) {
        console.error('Error loading chart data:', error);
        setChartWithPercent([]);
        setTotalAmount(0);
        setOtherItemsDetail([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentMonth, activeTab, reloadTrigger]);

  const displayDate = new Date(currentMonth + "-01");

  const giftedPieData = chartWithPercent.map((item) => ({
    value: item.amount,
    color: item.color + 50,
    onPress: () => {
      setSelectedSlice(item.name);
      onSelectCategory?.(item.name);
    },
    ...(selectedSlice === item.name ? { color: item.color } : {}),
  }));

  const displayMonth = new Date(currentMonth + "-01");

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => handleMonthChange(-1)}
          disabled={isTransitioning}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={isTransitioning ? "#ccc" : "#000"} 
          />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.monthText}>
            {`Tháng ${displayMonth.getMonth() + 1}/${displayMonth.getFullYear()}`}
          </Text>
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
              onPress={() => setActiveTab(type as "expense" | "income")}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor: activeTab === type ? "#EB8E90" : "#eee",
              }}
            >
              <Text
                style={{
                  color: activeTab === type ? "white" : "black",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                {type === "expense" ? "Tổng chi" : "Tổng thu"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
          
          <Text style={styles.amountText}>
            {typeof totalAmount === 'number' ? totalAmount.toLocaleString('vi-VN') : '0'}đ
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => handleMonthChange(1)}
          disabled={!canGoToNextMonth() || isTransitioning}
        >
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={!canGoToNextMonth() || isTransitioning ? "#ccc" : "#000"} 
          />
        </TouchableOpacity>
      </View>

      {loading || isTransitioning || chartWithPercent.length === 0 ? (
        <View style={{ height: 250, justifyContent: 'center', alignItems: 'center' }}>
          {loading || isTransitioning ? (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#EB8E90" />
              <Text style={{ color: '#666', fontSize: 16, marginTop: 8 }}>
                Đang tải...
              </Text>
            </View>
          ) : (
            <Text style={{ color: '#666', fontSize: 16 }}>
              Không có giao dịch trong tháng này
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.chartRow}>
          <PieChart
            key={currentMonth + activeTab}
            data={giftedPieData}
            donut
            showText
            textColor="#000"
            innerRadius={40}
            radius={80}
            strokeWidth={2}
            strokeColor="#fff"
            centerLabelComponent={() => null}
          />

          <View style={styles.legendContainer}>
            {chartWithPercent.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.percentBox,
                    {
                      backgroundColor:
                        item.name === "Còn lại"
                          ? "rgba(200, 200, 200, 0.15)"
                          : item.color + "22",
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={14}
                    color={item.color}
                  />
                  <Text
                    style={{
                      color: item.color,
                      fontWeight: "bold",
                      marginLeft: 4,
                    }}
                  >
                    {item.percent}%
                  </Text>
                </View>
                <Text style={styles.legendLabel}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  subText: {
    fontSize: 12,
    color: "grey",
    marginTop: 4,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "center",
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 32,
    paddingTop: 8,
    justifyContent: "center",
  },
  legendItem: {
    marginBottom: 12,
  },
  percentBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  legendLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginLeft: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tabWrapper: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  tab: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#ddd",
  },
});