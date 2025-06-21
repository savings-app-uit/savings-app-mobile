import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ManualEntry() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ghi chép Giao dịch</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f2f8',
  },
  text: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
  },
});
