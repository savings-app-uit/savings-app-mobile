import { useTransactionContext } from '@/contexts/TransactionContext';
import { getProfileAPI } from '@/utils/api';
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MonthlyBarChart from "../component/BarChart";
import MonthlySummary from "../component/PieChart";
import RewindCard from "../component/RewindCard";


export default function OverviewScreen() {
  const { reloadTrigger } = useTransactionContext();
  const [chartWithPercent, setChartWithPercent] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [otherItemsDetail, setOtherItemsDetail] = useState<any[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"pie" | "bar">("pie");
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
  }, [userProfile, profileLoading]);

  const filteredChart = chartWithPercent.filter(item => item.name !== "Còn lại");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        
        const response = await getProfileAPI();
        
        let profileData = null;
        const resp = response as any;
        
        if (resp?.data?.name) {
          profileData = resp.data;
        }
        else if (resp?.name) {
          profileData = resp;
        }
        else if (resp?.data?.data?.name) {
          profileData = resp.data.data;
        }
        
        if (profileData?.name) {
          setUserProfile(profileData);
        } else {
          setUserProfile({ name: "Sanni" });
        }
      } catch (error: any) {
        setUserProfile({ name: "Sanni" });
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDataChange = ({ currentMonth, chartWithPercent, otherItemsDetail }: any) => {
    console.log('Index.tsx - Data changed:', { currentMonth, chartWithPercent, otherItemsDetail });
    setSelectedMonth(currentMonth);
    setChartWithPercent(chartWithPercent || []);
    setOtherItemsDetail(otherItemsDetail || []);
  };

  const handleGoToProfile = () => {
    router.push('/(setting)/profile');
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: "#f3f2f8"}}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Text style={styles.headerText}>Xin chào,</Text>
            {profileLoading ? (
              <View style={styles.loadingSkeleton}>
                <LinearGradient
                  colors={["#E0E0E0", "#F0F0F0", "#E0E0E0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.skeletonGradient}
                />
              </View>
            ) : (
              <MaskedView
                maskElement={<Text style={styles.gradientText}>{userProfile?.name || 'Sanni'}</Text>}
              >
                <LinearGradient
                  colors={["#DD5E89", "#EB8E90", "#F7BB97"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.gradientText, { opacity: 0 }]}> {userProfile?.name || 'Sanni'} </Text>
                </LinearGradient>
              </MaskedView>
            )}
          </View>
          <TouchableOpacity onPress={handleGoToProfile}>
          <MaskedView
            maskElement={
              <Text style={styles.gradientText}>
                <Ionicons name="person" size={24} />
              </Text>
            }
          >
            <LinearGradient
              colors={["#DD5E89", "#EB8E90", "#F7BB97"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.gradientText, { opacity: 0 }]}> 
                <Ionicons name="person" size={24} />
              </Text>
            </LinearGradient>
          </MaskedView>
          </TouchableOpacity>
        </View>

        {/* Zentra Wrapped Card */}
        <RewindCard onPress={() => router.push('/rewind/' as any)} />

        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems:'center'}}>
          <Text style={styles.sectionTitle}>Tổng quan</Text>
          <View style={{ flexDirection: "row", alignSelf: "center", borderRadius: 16, backgroundColor: "#f8f8f8", overflow: "hidden", marginBottom: 8, marginRight: 16 }}>
            <TouchableOpacity onPress={() => setViewMode("pie")} style={{ padding: 10, backgroundColor: viewMode === "pie" ? "#DD5E8922" : "transparent", flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="pie-chart" size={16} color={viewMode === "pie" ? "#DD5E89" : "#aaa"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode("bar")} style={{ padding: 10, backgroundColor: viewMode === "bar" ? "#F7BB9722" : "transparent", flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="stats-chart" size={16} color={viewMode === "bar" ? "#F7BB97" : "#aaa"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Biểu đồ */}
        <View style={{marginTop: -24}}>
          {viewMode === 'pie' ? (
            <MonthlySummary
              setCurrentMonth={setSelectedMonth}
              currentMonth={selectedMonth}
              onDataChange={handleDataChange}
              onSelectCategory={(name) => setSelectedCategoryName(name)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              reloadTrigger={reloadTrigger}
            />
          ) : (
            <MonthlyBarChart
              currentMonth={selectedMonth}
              setCurrentMonth={setSelectedMonth}
              onDataChange={handleDataChange}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              reloadTrigger={reloadTrigger}
            />
          )}
        </View>

        <Text style={styles.sectionTitle}>Chi tiết giao dịch</Text>
        {/* Debug info */}
        {/* <Text style={{ fontSize: 12, color: '#666', paddingHorizontal: 16, marginBottom: 8 }}>
          Debug: {filteredChart.length} filtered items, {otherItemsDetail.length} other items
        </Text> */}
        <View style={styles.list}>
          {filteredChart.length === 0 && otherItemsDetail.length === 0 ? (
            <Text style={{ textAlign: "center", color: "gray", marginTop: 32 }}>
              Không có giao dịch trong tháng này
            </Text>
          ) : (
            <>
              {filteredChart.map((cat, idx) => (
                <View
                  key={idx}
                  style={[styles.categoryItem, {
                    borderWidth: cat.name === selectedCategoryName ? 2 : 0,
                    borderColor: cat.name === selectedCategoryName ? "#f72aa4" : "#eee",
                    borderRadius: 12,
                    backgroundColor: "#fff",
                  }]}
                >
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryAmount}>{Number(cat.amount).toLocaleString("vi-VN")}đ</Text>
                </View>
              ))}

              {otherItemsDetail.length > 0 && (
                <View style={[{
                  borderWidth: selectedCategoryName === "Còn lại" ? 2 : 0,
                  borderColor: selectedCategoryName === "Còn lại" ? "#f72aa4" : "#eee",
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }]}
                >
                  {otherItemsDetail.map((item, subIdx) => {
                    return (
                      <View key={subIdx} style={[styles.categoryItem, {paddingBottom: 24}]}> 
                        <Ionicons
                          name={'help-circle-outline' as any}
                          size={20}
                          color={'#666'}
                        />
                        <Text style={styles.categoryName}>{item.name}</Text>
                        <Text style={styles.categoryAmount}>{typeof item.amount === 'number' ? item.amount.toLocaleString("vi-VN") : '0'}đ</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f2f8",
    fontFamily: "inter",
    paddingBottom: 100,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  headerText: { fontSize: 20, fontWeight: "bold" },
  gradientText: {
    fontFamily: "Inter",
    fontSize: 26,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    padding: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  categoryName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    gap: 8,
  },
  loadingSkeleton: {
    height: 26,
    width: 80,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  skeletonGradient: {
    flex: 1,
    height: '100%',
  },
});