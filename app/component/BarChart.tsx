import { getCategoriesAPI, getExpensesAPI, getIncomesAPI } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
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

        const chartWithPercent = categoryArray
          .map((cat: any) => ({
            ...cat,
            percent: totalAmount > 0 ? ((cat.amount / totalAmount) * 100).toFixed(1) : '0'
          }))
          .sort((a: any, b: any) => b.amount - a.amount);        const barData = chartWithPercent.slice(0, 5).map((item: any, index: number) => ({
          value: typeof item.amount === 'number' && !isNaN(item.amount) ? item.amount / 1000000 : 0, 
          label: (item.name && typeof item.name === 'string') ? item.name.substring(0, 6) : 'N/A',
          frontColor: item.color || '#666',
          labelTextStyle: { fontSize: 10, color: '#666' }
        }));        setChartData(barData);
        setTotalAmount(totalAmount);
        
        const maxAmount = barData.length > 0 ? Math.max(...barData.map(item => item.value)) : 0;
        setMaxValue(Math.max(maxAmount * 1.2, 1));
        
        onDataChange?.({ currentMonth, chartWithPercent, otherItemsDetail: chartWithPercent.slice(4) });
      } catch (error) {
        console.error('Error loading chart data:', error);
        setChartData([]);
        setTotalAmount(0);
        setMaxValue(7.5);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentMonth, activeTab, reloadTrigger]);

  const displayMonth = new Date(currentMonth + "-01");

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentMonth(getMonthOffset(-1))}
          disabled={currentIndex <= 0}
        >
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>

        <View style={{ alignItems: "center", }}>
          <Text style={styles.monthText}>
            {`Tháng ${displayMonth.getMonth() + 1}/${displayMonth.getFullYear()}`}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 8, gap: 16, }}>
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
          </View>          <Text style={styles.amountText}>
            {typeof totalAmount === 'number' ? totalAmount.toLocaleString("vi-VN") : '0'}đ
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setCurrentMonth(getMonthOffset(1))}
          disabled={currentIndex >= monthLabels.length - 1}
        >
          <Ionicons name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={260}
          height={250}
          barWidth={80}
          spacing={20}
          maxValue={maxValue}
          stepValue={maxValue / Math.min(5, Math.ceil(maxValue / 0.5))}
          noOfSections={Math.min(5, Math.ceil(maxValue / 0.5))}          
          yAxisLabelTexts={Array.from({ length: Math.min(5, Math.ceil(maxValue / 0.5)) + 1 }, (_, i) => {
            const value = i * (maxValue / Math.min(5, Math.ceil(maxValue / 0.5)));
            return typeof value === 'number' && !isNaN(value) 
              ? value.toLocaleString("vi-VN", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              : '0.0';
          })}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules={false}
          yAxisTextStyle={{ fontSize: 12, color: "#666" }}
          xAxisLabelTextStyle={{ fontSize: 12, color: "#666" }}
          barBorderRadius={4}
          showReferenceLine1={false}
          backgroundColor="transparent"
        />
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
});