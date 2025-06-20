import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { transactions, allCategories } from "./data";

type MonthlyBarChartProps = {
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
}: MonthlyBarChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [maxValue, setMaxValue] = useState(7.5);
  const [totalExpense, setTotalExpense] = useState(0);

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

  useEffect(() => {
    // Lấy 3 tháng: trước, hiện tại, sau
    const prevMonth = currentIndex > 0 ? monthLabels[currentIndex - 1] : null;
    const thisMonth = monthLabels[currentIndex];
    const nextMonth = currentIndex < monthLabels.length - 1 ? monthLabels[currentIndex + 1] : null;

    const visibleMonths = [prevMonth, thisMonth, nextMonth].filter(Boolean);

    const data = visibleMonths.map((month, index) => {
      const sum = transactions
        .filter((tx) => tx.date.startsWith(month!.key))
        .reduce((acc, tx) => acc + tx.amount, 1);
      
      const valueInMil = Number((sum / 1_000_000).toFixed(1));
      
      // Xác định màu sắc dựa trên vị trí
      let frontColor = "#B8D4F0"; // Light blue mặc định
      if (month!.key === currentMonth) {
        frontColor = "#2196F3"; // Dark blue cho tháng hiện tại
      }

      return {
        label: month!.label,
        value: valueInMil,
        frontColor: frontColor,
      };
    });

    setChartData(data);

    // Tính tổng chi tiêu tháng hiện tại
    const thisMonthTotal = transactions
      .filter((tx) => tx.date.startsWith(currentMonth))
      .reduce((sum, tx) => sum + tx.amount, 0);
    setTotalExpense(thisMonthTotal);

    // Tính max value cho chart với số thập phân đẹp
    const maxDataValue = Math.max(...data.map(d => d.value));
    
    // Tính toán để có step 0.5 rõ ràng
    let calculatedMax = Math.ceil(maxDataValue * 2) / 2; // làm tròn đến 0.5
    calculatedMax = calculatedMax + 0.5; // thêm 1 step để có khoảng trống
    
    // Đảm bảo maxValue tối thiểu
    if (calculatedMax < 1.5) calculatedMax = 1.5;
    
    setMaxValue(calculatedMax);

    // Xử lý dữ liệu pie chart (giữ nguyên logic cũ)
    const pieData = transactions
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
        percent: ((item.amount / thisMonthTotal) * 100).toFixed(0),
        icon: cat?.icon,
        color: cat?.color ?? "#ccc",
      };
    });

    onDataChange?.({
      currentMonth,
      chartWithPercent,
      otherItemsDetail: other,
    });
  }, [currentMonth]);

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

        <View style={{ alignItems: "center", gap: 4 }}>
          <Text style={styles.monthText}>
            {displayMonth.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </Text>
          <Text style={styles.subText}>Total expense</Text>
          <Text style={styles.amountText}>
            {(totalExpense).toLocaleString("vi-VN", {
              maximumFractionDigits: 1,
            })}đ
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
          stepValue={0.5}
          noOfSections={Math.ceil(maxValue / 0.5)}
          yAxisThickness={0}
          yAxisLabelTexts={Array.from({ length: Math.ceil(maxValue / 0.5) + 1 }, (_, i) => 
            `${(i * 0.5).toLocaleString("vi-VN", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
            })}`
            )}
          xAxisThickness={0}
          hideRules={false}
          yAxisTextStyle={{ 
            fontSize: 12, 
            color: '#666' 
          }}
          xAxisLabelTextStyle={{ 
            fontSize: 12, 
            color: '#666' 
          }}
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
    shadowColor: '#000',
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
  subText: {
    fontSize: 12,
    color: "gray",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});