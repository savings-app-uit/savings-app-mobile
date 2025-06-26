import { getCategoriesAPI, getExpensesAPI, getIncomesAPI } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

type MonthlyBarChartProps = {
  activeTab: "expense" | "income";
  setActiveTab: (tab: "expense" | "income") => void;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
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
  reloadTrigger?: number;
};

export default function MonthlyBarChart({
  onDataChange,
  currentMonth,
  setCurrentMonth,
  activeTab,
  setActiveTab,
  reloadTrigger
}: MonthlyBarChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [maxValue, setMaxValue] = useState(7.5);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const monthLabels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      label: date.toLocaleString("en-US", { month: "short" }),
      key: date.toISOString().slice(0, 7),
    };
  });

  const currentIndex = monthLabels.findIndex((m) => m.key === currentMonth);

  function getMonthOffset(offset: number) {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + offset);
    return date.toISOString().slice(0, 7);
  }  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const [transactionsResponse, categoriesResponse] = await Promise.all([
          activeTab === 'expense' ? getExpensesAPI() : getIncomesAPI(),
          getCategoriesAPI(activeTab)
        ]);

        const transactions = Array.isArray(transactionsResponse) ? transactionsResponse : [];
        const categories = categoriesResponse || [];

        const prevMonth = currentIndex > 0 ? monthLabels[currentIndex - 1] : null;
        const thisMonth = monthLabels[currentIndex];
        const nextMonth = currentIndex < monthLabels.length - 1 ? monthLabels[currentIndex + 1] : null;

        const visibleMonths = [prevMonth, thisMonth, nextMonth].filter(Boolean);

        // Tạo dữ liệu cho biểu đồ cột 
        const data = visibleMonths.map((month) => {
          // Lọc giao dịch cho tháng này
          const monthTransactions = transactions.filter((tx: any) => {
            let dateString = '';
            if (tx.date && tx.date._seconds) {
              const date = new Date(tx.date._seconds * 1000);
              dateString = date.toISOString().split('T')[0]; 
            } else if (typeof tx.date === 'string') {
              dateString = tx.date.split('T')[0]; 
            }
            
            return dateString && dateString.startsWith(month!.key);
          });

          // Tính tổng cho tháng này
          const sum = monthTransactions.reduce((acc: number, tx: any) => acc + (tx.amount || 0), 0);
          const valueInMil = Number((sum / 1_000_000).toFixed(1));
          
          let frontColor = "#C4C4C4"; 
          if (month!.key === currentMonth) {
            frontColor = "#EB8E90"; // Màu chính cho tháng hiện tại
          }

          return {
            label: month!.label,
            value: valueInMil,
            frontColor: frontColor,
            onPress: () => {
              if (month!.key !== currentMonth) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentMonth(month!.key);
                }, 100);
              }
            },
          };
        });

        setChartData(data);

        // Tính tổng cho tháng hiện tại để hiển thị
        const thisMonthTransactions = transactions.filter((tx: any) => {
          let dateString = '';
          if (tx.date && tx.date._seconds) {
            const date = new Date(tx.date._seconds * 1000);
            dateString = date.toISOString().split('T')[0]; 
          } else if (typeof tx.date === 'string') {
            dateString = tx.date.split('T')[0]; 
          }
          
          return dateString && dateString.startsWith(currentMonth);
        });

        const thisMonthTotal = thisMonthTransactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
        setTotalAmount(thisMonthTotal);

        const maxDataValue = Math.max(...data.map(d => d.value));
        
        let calculatedMax;
        if (maxDataValue === 0) {
          calculatedMax = 5; // Minimum để hiển thị chart
        } else {
          const magnitude = Math.pow(10, Math.floor(Math.log10(maxDataValue)));
          const normalized = maxDataValue / magnitude;
          
          if (normalized <= 1) calculatedMax = 1.2 * magnitude;
          else if (normalized <= 2) calculatedMax = 2.5 * magnitude;
          else if (normalized <= 5) calculatedMax = 6 * magnitude;
          else calculatedMax = 12 * magnitude;
        }
        
        setMaxValue(calculatedMax);

        // Tạo dữ liệu chi tiết theo danh mục cho tháng hiện tại
        const categoryTotals = thisMonthTransactions.reduce((acc: any, tx: any) => {
          const category = categories.find((cat: any) => cat.id === tx.categoryId);
          let categoryName = category?.name || tx.categoryName || tx.category || 'Khác';
          
          if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
            categoryName = 'Khác';
          }
          
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
        const chartWithPercent = categoryArray
          .map((cat: any) => ({
            ...cat,
            percent: thisMonthTotal > 0 ? ((cat.amount / thisMonthTotal) * 100).toFixed(1) : '0'
          }))
          .sort((a: any, b: any) => b.amount - a.amount);
        
        onDataChange?.({ currentMonth, chartWithPercent, otherItemsDetail: chartWithPercent.slice(4) });
      } catch (error) {
        console.error('Error loading chart data:', error);
        setChartData([]);
        setTotalAmount(0);
        setMaxValue(1.5);
      } finally {
        setLoading(false);
        setIsTransitioning(false);
      }
    })();
  }, [currentMonth, activeTab, reloadTrigger]);

  const displayMonth = new Date(currentMonth + "-01");

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentMonth(getMonthOffset(-1));
            }, 100);
          }}
          disabled={currentIndex <= 0 || isTransitioning}
        >
          <Ionicons name="chevron-back" size={20} color={currentIndex <= 0 || isTransitioning ? "#ccc" : "#333"} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.monthText}>
            {displayMonth.toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
            })}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 8, gap: 16 }}>
            {["expense", "income"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setActiveTab(type as 'expense' | 'income')}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: activeTab === type ? "#EB8E90" : "#eee",
                }}
              >
                <Text
                  style={{
                    color: activeTab === type ? "white" : "#333",
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
            {typeof totalAmount === 'number' && !isNaN(totalAmount) && isFinite(totalAmount) 
              ? totalAmount.toLocaleString("vi-VN") 
              : '0'}đ
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentMonth(getMonthOffset(1));
            }, 100);
          }}
          disabled={currentIndex >= monthLabels.length - 1 || isTransitioning}
        >
          <Ionicons name="chevron-forward" size={20} color={currentIndex >= monthLabels.length - 1 || isTransitioning ? "#ccc" : "#333"} />
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        {chartData.length > 0 && !isTransitioning ? (
          <BarChart
            data={chartData}
            width={300}
            height={250}
            barWidth={60}
            spacing={40}
            maxValue={maxValue}
            stepValue={maxValue / 5} 
            noOfSections={5} 
            yAxisLabelTexts={Array.from({ length: 6 }, (_, i) => {
              const value = (i * maxValue) / 5;
              return value.toLocaleString("vi-VN", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              });
            })}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor="#E0E0E0"
            hideRules={false}
            rulesColor="#F0F0F0"
            yAxisTextStyle={{ fontSize: 12, color: "#666" }}
            xAxisLabelTextStyle={{ fontSize: 12, color: "#666", fontWeight: "bold" }}
            barBorderRadius={8}
            showReferenceLine1={false}
            backgroundColor="transparent"
            isAnimated={true}
            animationDuration={800}
          />
        ) : (
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
                Không có dữ liệu
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartDescription: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
});