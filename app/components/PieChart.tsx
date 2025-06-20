import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { allCategories, transactions } from "./data";

const screenWidth = Dimensions.get("window").width;

type MonthlySummaryProps = {
    currentMonth:string;
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
};

export default function MonthlySummary({ onDataChange, onSelectCategory, currentMonth, setCurrentMonth}: MonthlySummaryProps) {
    const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  const filteredTransactions = transactions.filter((tx) =>
    tx.date.startsWith(currentMonth)
  );
  const getMonthOffset = (offset: number) => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + offset);
    return date.toISOString().slice(0, 7);
  };

  const monthLabels = [-2, -1, 0].map(offset => {
    const date = new Date(getMonthOffset(offset) + "-01");
    return {
      label: offset === 0 ? "Tháng này" : `T${date.getMonth() + 1}`,
      key: getMonthOffset(offset),
    };
  });
  
  const totalExpense = filteredTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  const pieDataRaw = filteredTransactions.reduce((acc, tx) => {
    const existing = acc.find((item) => item.name === tx.category);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      acc.push({ name: tx.category, amount: tx.amount });
    }
    return acc;
  }, [] as { name: string; amount: number }[]);

  pieDataRaw.sort((a, b) => b.amount - a.amount);

  const topItems = pieDataRaw.slice(0, 4);
  const otherItems = pieDataRaw.slice(4);

  const chartWithPercent = topItems.map((item) => {
    const cat = allCategories.find((c) => c.name === item.name);
    const percent = ((item.amount / totalExpense) * 100).toFixed(0);
    return {
      name: item.name,
      amount: item.amount,
      percent,
      icon: cat?.icon,
      color: cat?.color ?? "#ccc",
    };
  });

  if (otherItems.length > 0) {
    const otherAmount = otherItems.reduce((sum, item) => sum + item.amount, 0);
    const otherPercent = ((otherAmount / totalExpense) * 100).toFixed(0);
    chartWithPercent.push({
      name: "Còn lại",
      amount: otherAmount,
      percent: otherPercent,
      icon: "grid",
      color: "#808080",
    });
  }

  const giftedPieData = chartWithPercent.map((item) => ({
  value: item.amount,
  color: item.color + 50, // slice được chọn to hơn
  onPress: () => {
    setSelectedSlice(item.name);
    onSelectCategory?.(item.name);
  },
  ...(selectedSlice === item.name
    ? { color: item.color,} 
    : {}),
}));

  const displayDate = new Date(currentMonth + "-01");

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        currentMonth,
        chartWithPercent,
        otherItemsDetail: otherItems,
      });
    }
  }, [currentMonth]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
              <TouchableOpacity onPress={() => setCurrentMonth(getMonthOffset(-1))}>
                <Ionicons name="chevron-back" size={20} />
              </TouchableOpacity>
      
              <View style={{ alignItems: "center" }}>
                <Text style={styles.monthText}>
                  {new Date(currentMonth + "-01").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </Text>
                <Text style={styles.subText}>Total expense</Text>
                <Text style={styles.amountText}>{(totalExpense).toLocaleString("vi-VN")}đ</Text>
              </View>
      
              <TouchableOpacity onPress={() => setCurrentMonth(getMonthOffset(1))}>
                <Ionicons name="chevron-forward" size={20} />
              </TouchableOpacity>
            </View>

      {filteredTransactions.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <Text style={{ color: "#888" }}>No expense in this month</Text>
        </View>
      ) : (
        <View style={styles.chartRow}>
          <PieChart
            key={currentMonth}
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
});
