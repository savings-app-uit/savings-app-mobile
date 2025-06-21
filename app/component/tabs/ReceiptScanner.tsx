import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ReceiptScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert('Lỗi', 'Camera không khả dụng');
      return;
    }

    setIsScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });
      if (photo) {
        Alert.alert('Chụp hóa đơn thành công', 'Hóa đơn đã được chụp và sẽ được xử lý để trích xuất thông tin giao dịch.', [
          { 
            text: 'Xem ảnh', 
            onPress: () => console.log('Receipt photo URI:', photo.uri) 
          },
          { 
            text: 'Xử lý hóa đơn', 
            onPress: () => {
              // TODO: Gửi ảnh lên server để OCR và trích xuất thông tin
              Alert.alert('Đang xử lý', 'Tính năng OCR sẽ được tích hợp để tự động trích xuất thông tin từ hóa đơn');
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Lỗi', 'Không thể chụp hóa đơn');
    } finally {
      setIsScanning(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#DD5E89" />
        <Text style={styles.permissionText}>Đang kiểm tra quyền camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="receipt-outline" size={80} color="#ccc" />
        <Text style={styles.permissionText}>Cần quyền truy cập camera để chụp hóa đơn</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Cấp quyền Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      />
      
      <View style={styles.cameraOverlay}>
        <View style={styles.scanFrame}>
          {/* Góc chỉ dẫn */}
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
        <Text style={styles.scanText}>Đặt hóa đơn vào khung để chụp</Text>
      </View>

      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.captureButton, isScanning && styles.capturingButton]} 
          onPress={takePicture}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="camera" size={32} color="#fff" />
          )}
        </TouchableOpacity>
        
        <View style={styles.controlButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f2f8',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  permissionButton: {
    backgroundColor: '#DD5E89',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 350,
    borderWidth: 2,
    borderColor: '#DD5E89',
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#DD5E89',
    borderRadius: 4,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#DD5E89',
    borderRadius: 4,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#DD5E89',
    borderRadius: 4,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#DD5E89',
    borderRadius: 4,
  },
  scanText: {
    position: 'absolute',
    bottom: 120,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: '#DD5E89',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 4,
    borderColor: '#fff',
  },
  capturingButton: {
    backgroundColor: '#999',
  },
});
