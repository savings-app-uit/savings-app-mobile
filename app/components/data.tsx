import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


export const allCategories = [
  { name: "Chợ, siêu thị", icon: "basket", color: "#f46e45" },
  { name: "Ăn uống", icon: "fast-food", color: "#f46e45" },
  { name: "Di chuyển", icon: "car", color: "#62aef7" },
  { name: "Mua sắm", icon: "cart", color: "#f6b100" },
  { name: "Giải trí", icon: "play", color: "#f78c8c" },
  { name: "Làm đẹp", icon: "cut", color: "#ef60a3" },
  { name: "Sức khỏe", icon: "heart", color: "#f5536c" },
  { name: "Từ thiện", icon: "gift", color: "#f58cd2" },
  { name: "Hóa đơn", icon: "document-text", color: "#2ec3a2" },
  { name: "Nhà cửa", icon: "home", color: "#937be1" },
  { name: "Người thân", icon: "people", color: "#f57cac" },
  { name: "Đầu tư", icon: "trending-up", color: "#4caf50" },
  { name: "Tiết kiệm", icon: "wallet", color: "#4caf50" },
];

export const transactions = [
    { id: '1', date: '2025-06-19', title: 'Thanh toán RAU MÁ BK', category: 'Ăn uống', amount: 35000 },
    { id: '2', date: '2025-06-18', title: 'Mua nước', category: 'Ăn uống', amount: 15000 },
    { id: '3', date: '2025-06-19', title: 'Dukki', category: 'Ăn uống', amount: 500000 },
    { id: '4', date: '2025-06-17', title: 'Mua xăng', category: 'Di chuyển', amount: 80000 },
    { id: '5', date: '2025-06-16', title: 'Ăn trưa quán cơm', category: 'Ăn uống', amount: 40000 },
    { id: '7', date: '2025-06-15', title: 'Mua sách', category: 'Mua sắm', amount: 120000 },
    { id: '8', date: '2025-06-14', title: 'Mua áo thun', category: 'Mua sắm', amount: 150000 },
    { id: '10', date: '2025-06-13', title: 'Cà phê với bạn', category: 'Giải trí', amount: 60000 },
    { id: '11', date: '2025-06-12', title: 'Gửi xe tháng', category: 'Hóa đơn', amount: 100000 },
    { id: '12', date: '2025-06-11', title: 'Thanh toán Internet', category: 'Hóa đơn', amount: 200000 },
  ];