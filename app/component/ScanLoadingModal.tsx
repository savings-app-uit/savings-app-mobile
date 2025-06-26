import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface ScanLoadingModalProps {
  visible: boolean;
  onRequestClose?: () => void;
}

export default function ScanLoadingModal({ visible, onRequestClose }: ScanLoadingModalProps) {
  const pulseValue = React.useRef(new Animated.Value(1)).current;
  const rotateValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1200, 
          useNativeDriver: true,
        })
      );

      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.08, 
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    } else {
      rotateValue.setValue(0);
      pulseValue.setValue(1);
    }
  }, [visible, pulseValue, rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Scanning Icon with Animation */}
            <Animated.View
              style={[
                styles.scanIconContainer,
                {
                  transform: [
                    { rotate: rotate },
                    { scale: pulseValue }
                  ]
                }
              ]}
            >
              <Ionicons name="scan" size={60} color="#DD5E89" />
            </Animated.View>

            <Text style={styles.title}>Đang quét hóa đơn</Text>

            <Text style={styles.description}>
              Hệ thống đang phân tích ảnh và trích xuất thông tin giao dịch...
            </Text>

            <View style={styles.tipsContainer}>
              <Ionicons name="information-circle-outline" size={16} color="#666" />
              <Text style={styles.tipsText}>
                Quá trình này có thể mất vài giây
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  scanIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DD5E8915',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#DD5E8930',
  },
  spinner: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#DD5E89',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DD5E89',
  },
  tipsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    fontStyle: 'italic',
  },
});
