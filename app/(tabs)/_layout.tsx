import { Tabs } from "expo-router";
import React from "react";
import CustomTabBar from "../component/CustomTabBar";
import { TabBarVisibilityProvider } from "@/contexts/TabBarVisibilityContext";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}