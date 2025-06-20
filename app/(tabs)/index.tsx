<<<<<<< Updated upstream
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
=======
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { allCategories } from "../components/data";
import { transactions } from "../components/data";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import MonthlySummaryScreen from "../components/PieChart";
import { SafeAreaView } from "react-native-safe-area-context";
import MonthlySummary from "../components/PieChart";

const screenWidth = Dimensions.get("window").width;
const User = {
  name: 'Sanni'
}

export default function OverviewScreen() {
  const [tab, setTab] = useState<"child" | "parent">("child");
>>>>>>> Stashed changes

  return (
<<<<<<< Updated upstream
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
=======
    <ScrollView>

    
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <Text style={styles.headerText}>Hi</Text>
        <MaskedView 
          maskElement={
          <Text style={styles.gradientText}>
            {User.name}
          </Text>
          }>
            <LinearGradient 
              colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}>
        
                <Text style={[styles.gradientText, { opacity: 0 }]}>
                  {User.name}
               </Text>
            </LinearGradient>
        </MaskedView>
        <Text style={styles.headerText}>!</Text>
        </View>
        <MaskedView 
          maskElement={
          <Text style={styles.gradientText}>
            <Ionicons
                name="person"
                size={24}/>
          </Text>
          }>
            <LinearGradient 
              colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}>
        
                <Text style={[styles.gradientText, { opacity: 0 }]}>
                  <Ionicons
                  name="person"
                  size={24}/>
               </Text>
            </LinearGradient>
        </MaskedView>
        
      </View>
      {/*header*/}
      
      <Text style ={styles.sectionTitle}>Overview</Text>

      {/* Biểu đồ */}
      <MonthlySummary/>

      {/* Tabs */}
          <Text style ={styles.sectionTitle}>Details</Text>

      {/* Danh mục */}
      <View>
        {allCategories.map((cat, idx) => (
          <View key={idx} style={styles.categoryItem}>
            <Ionicons name={cat.icon as any} size={24} color={cat.color} />
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Text style={styles.hidden}>*******</Text>
          </View>
        ))}
      </View>
    </View>
    </ScrollView>
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
=======
  container: { flex: 1, backgroundColor: "#f3f2f8", fontFamily: 'inter', paddingBottom: 100},
  header: { paddingTop: 50, paddingBottom: 10, paddingHorizontal: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff'},
  headerText: { fontSize: 20, fontWeight: "bold" },

  overviewBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff0f5",
    borderRadius: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemBox: {
    alignItems: "center",
  },
  label: { fontWeight: "bold", marginBottom: 4 },
  hidden: { fontSize: 20, color: "#999" },
  summaryText: { marginTop: 10, fontSize: 12, color: "green" },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#f72aa4",
  },
  tabText: {
    color: "#888",
  },
  activeTabText: {
    color: "#f72aa4",
    fontWeight: "bold",
  },

  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  navLabel: { fontSize: 10, marginTop: 4, textAlign: "center" },

  addBtn: {
    backgroundColor: "#f72aa4",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -28,
    borderWidth: 4,
    borderColor: "#fff",
  },
  gradientText: {
        fontFamily: 'Inter',
        fontSize: 26,
        fontWeight: 'bold',
    },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10, padding: 16},
>>>>>>> Stashed changes
});
