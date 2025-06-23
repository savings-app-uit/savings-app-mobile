import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { allCategories, transactions, income } from "./data";

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
};

export default function MonthlyBarChart({
  onDataChange,
  currentMonth,
  setCurrentMonth,
  activeTab,
  setActiveTab
}: MonthlyBarChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [maxValue, setMaxValue] = useState(7.5);
  const [totalAmount, setTotalAmount] = useState(0);

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
  }

  const sourceData = activeTab === 'expense' ? transactions : income;

  useEffect(() => {
    const prevMonth = currentIndex > 0 ? monthLabels[currentIndex - 1] : null;
    const thisMonth = monthLabels[currentIndex];
    const nextMonth = currentIndex < monthLabels.length - 1 ? monthLabels[currentIndex + 1] : null;

    const visibleMonths = [prevMonth, thisMonth, nextMonth].filter(Boolean);

    const data = visibleMonths.map((month) => {
      const sum = sourceData
        .filter((tx) => tx.date.startsWith(month!.key))
        .reduce((acc, tx) => acc + tx.amount, 1);

      const valueInMil = Number((sum / 1_000_000).toFixed(1));
      let frontColor = "#B8D4F0";
      if (month!.key === currentMonth) {
        frontColor = "#2196F3";
      }

      return {
        label: month!.label,
        value: valueInMil,
        frontColor,
      };
    });

    setChartData(data);

    const currentMonthTotal = sourceData
      .filter((tx) => tx.date.startsWith(currentMonth))
      .reduce((sum, tx) => sum + tx.amount, 0);
    setTotalAmount(currentMonthTotal);

    const maxDataValue = Math.max(...data.map((d) => d.value));
    const MAX_SECTIONS = 5;
    const sectionStep = Math.ceil((maxDataValue / MAX_SECTIONS) * 2) / 2;
    const noOfSections = Math.min(MAX_SECTIONS, Math.ceil(maxDataValue / sectionStep));
    const yAxisLabels = Array.from({ length: noOfSections + 1 }, (_, i) =>
      `${(i * sectionStep).toLocaleString("vi-VN", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}`
    );

    setMaxValue(sectionStep * noOfSections);

    const pieData = sourceData
      .filter((tx) => tx.date.startsWith(currentMonth))
      .reduce((acc, tx) => {
        const existing = acc.find((item) => item.name === tx.category);
        if (existing) {
          existing.amount += tx.amount;
        } else {
          acc.push({ name: tx.category, amount: tx.amount });
        }
        return acc;
      }, [] as { name: string; amount: number }[]);

    pieData.sort((a, b) => b.amount - a.amount);
    const top = pieData.slice(0, 4);
    const other = pieData.slice(4);

    const chartWithPercent = top.map((item) => {
      const cat = allCategories.find((c) => c.name === item.name);
      return {
        name: item.name,
        amount: item.amount,
        percent: ((item.amount / currentMonthTotal) * 100).toFixed(0),
        icon: cat?.icon,
        color: cat?.color ?? "#ccc",
      };
    });

    onDataChange?.({
      currentMonth,
      chartWithPercent,
      otherItemsDetail: other,
    });
  }, [currentMonth, activeTab]);

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
          </View>

          <Text style={styles.amountText}>
            {totalAmount.toLocaleString("vi-VN")}đ
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
          yAxisLabelTexts={Array.from({ length: Math.min(5, Math.ceil(maxValue / 0.5)) + 1 }, (_, i) =>
            `${(i * (maxValue / Math.min(5, Math.ceil(maxValue / 0.5)))).toLocaleString("vi-VN", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}`
          )}
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