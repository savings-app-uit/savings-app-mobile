import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ManualEntry from '../component/tabs/ManualEntry';
import ReceiptScanner from '../component/tabs/ReceiptScanner';
import { useRouter } from 'expo-router';

export default function AddTransactionScreen() {
  const [activeTab, setActiveTab] = useState<'manual' | 'scan'>('manual');
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
        
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm giao dịch</Text>
      </View>
      

      <View style={styles.tabSelectorContainer}>
        <View style={styles.tabSelector}>
          <TouchableOpacity 
            onPress={() => setActiveTab('manual')} 
            style={[
              styles.tab,
              { backgroundColor: activeTab === 'manual' ? '#DD5E8922' : 'transparent' }
            ]}
          >
            <Ionicons 
              name="create" 
              size={16} 
              color={activeTab === 'manual' ? '#DD5E89' : '#aaa'} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'manual' ? '#DD5E89' : '#aaa' }
            ]}>
              Nhập thủ công
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab('scan')} 
            style={[
              styles.tab,
              { backgroundColor: activeTab === 'scan' ? '#F7BB9722' : 'transparent' }
            ]}
          >
            <Ionicons 
              name="scan" 
              size={16} 
              color={activeTab === 'scan' ? '#F7BB97' : '#aaa'} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'scan' ? '#F7BB97' : '#aaa' }
            ]}>
              Chụp hóa đơn
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === 'manual' ? <ManualEntry /> : <ReceiptScanner />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2f8',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#2c3e50',
},
  tabSelectorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabSelector: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
    marginBottom: 8,
  },
  tab: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
  position: 'absolute',
  left: 16,
  top: 50,
  padding: 4,
  zIndex: 10,
},
});