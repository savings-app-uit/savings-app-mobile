import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { getChartData } from "./data";

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
};
export default function MonthlySummary({
  onDataChange,
  onSelectCategory,
  currentMonth,
  setCurrentMonth,
  activeTab,
  setActiveTab
}: MonthlySummaryProps) {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
  const [chartWithPercent, setChartWithPercent] = useState<any[]>([]);
  const [otherItemsDetail, setOtherItemsDetail] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getMonthOffset = (offset: number) => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + offset);
    return date.toISOString().slice(0, 7);
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { chartWithPercent, totalExpense } = await getChartData(currentMonth);
      setChartWithPercent(chartWithPercent);
      setTotalAmount(typeof totalExpense === 'number' ? totalExpense : 0);
      setOtherItemsDetail(chartWithPercent.slice(4));
      onDataChange?.({ currentMonth, chartWithPercent, otherItemsDetail: chartWithPercent.slice(4) });
      setLoading(false);
    })();
  }, [currentMonth, activeTab]);

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
        <TouchableOpacity onPress={() => setCurrentMonth(getMonthOffset(-1))}>
          <Ionicons name="chevron-back" size={20} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.monthText}>
            {`Tháng ${displayMonth.getMonth() + 1}/${displayMonth.getFullYear()}`}
          </Text>
          {/* Toggle Thu / Chi */}
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

        <TouchableOpacity onPress={() => setCurrentMonth(getMonthOffset(1))}>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <Text style={{ color: "#888" }}>
            Đang tải dữ liệu...
          </Text>
        </View>
      ) : chartWithPercent.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <Text style={{ color: "#888" }}>
            Không có giao dịch trong tháng này
          </Text>
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