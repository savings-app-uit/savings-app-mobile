import { createImageFormData, parseVietnameseDate, scanReceiptAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScanLoadingModal from '../ScanLoadingModal';

interface ReceiptScannerProps {
  onScanResult?: (result: IScanReceiptResponse) => void;
}

export default function ReceiptScanner({ onScanResult }: ReceiptScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [isFromCamera, setIsFromCamera] = useState(false); 
  const cameraRef = useRef<CameraView>(null);

  // Crop image to scan frame area
  const cropImageToFrame = async (imageUri: string): Promise<string> => {
    try {
      const imageInfo = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG }
      );
      
      const imageWidth = imageInfo.width;
      const imageHeight = imageInfo.height;
      
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;
      
      const frameWidth = 250;
      const frameHeight = 350;
      
      const frameLeft = (screenWidth - frameWidth) / 2;
      const frameTop = (screenHeight - frameHeight) / 2;
      
      let scaleX, scaleY, offsetX = 0, offsetY = 0;
      
      const imageAspectRatio = imageWidth / imageHeight;
      const screenAspectRatio = screenWidth / screenHeight;
      
      if (imageAspectRatio > screenAspectRatio) {
        scaleY = imageHeight / screenHeight;
        scaleX = scaleY;
        offsetX = (imageWidth - screenWidth * scaleX) / 2;
      } else {
        scaleX = imageWidth / screenWidth;
        scaleY = scaleX;
        offsetY = (imageHeight - screenHeight * scaleY) / 2;
      }
      
      const padding = 30; 
      const cropX = Math.max(0, (frameLeft - padding) * scaleX + offsetX);
      const cropY = Math.max(0, (frameTop - padding) * scaleY + offsetY);
      const cropWidth = Math.min((frameWidth + padding * 2) * scaleX, imageWidth - cropX);
      const cropHeight = Math.min((frameHeight + padding * 2) * scaleY, imageHeight - cropY);
      
      const croppedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropX,
              originY: cropY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      
      return croppedImage.uri;
    } catch (error) {
      return imageUri;
    }
  };

  const processScanResult = async (imageUri: string) => {
    try {
      setIsScanning(true);
      
      // Create FormData for the image
      const formData = createImageFormData(imageUri, 'receipt.jpg');
      
      const scanResult = await scanReceiptAPI(formData);
      
      if (scanResult) {
        // Check if amount is 0 or invalid
        let numericAmount = 0;
        if (scanResult.amount && typeof scanResult.amount === 'string') {
          numericAmount = parseFloat(scanResult.amount.replace(/[^\d.]/g, ''));
        }

        // If amount is 0 or invalid, show error alert
        if (isNaN(numericAmount) || numericAmount <= 0) {
          Alert.alert('Hóa đơn không hợp lệ', 'Không thể xác định hóa đơn này. Vui lòng thử lại.');
          return;
        }

        // Format amount for display
        let formattedAmount = 'Không xác định';
        formattedAmount = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(numericAmount);

        let formattedDate = 'Không xác định';
        if (scanResult.date) {
          const parsedDate = parseVietnameseDate(scanResult.date);
          if (parsedDate) {
            formattedDate = parsedDate.toLocaleDateString('vi-VN');
          } else {
            formattedDate = scanResult.date;
          }
        }

        Alert.alert(
          'Quét hóa đơn thành công!',
          `Đã phát hiện giao dịch:\n\n📁 Danh mục: ${scanResult.category?.name || 'Không xác định'}\n💰 Số tiền: ${formattedAmount}\n📅 Ngày: ${formattedDate}`,
          [
            { text: 'Hủy', style: 'cancel' },
            { 
              text: 'Thêm giao dịch',
              style: 'default',
              onPress: () => {
                if (onScanResult) {
                  onScanResult(scanResult);
                }
              }
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      let errorMessage = 'Không thể quét hóa đơn. Vui lòng thử lại.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Lỗi quét hóa đơn', errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert('Lỗi', 'Camera không khả dụng');
      return;
    }

    setIsCapturing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });
      
      if (photo) {
        setIsCropping(true);
        
        setTimeout(async () => {
          const croppedImageUri = await cropImageToFrame(photo.uri);
          setCapturedImage(croppedImageUri);
          setIsFromCamera(true); // Mark as camera image
          setShowImagePreview(true);
          setIsCapturing(false);
          setIsCropping(false);
        }, 500);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chụp hóa đơn');
      setIsCapturing(false);
    }
  };

  const handleConfirmImage = async () => {
    if (capturedImage) {
      setShowImagePreview(false);
      await processScanResult(capturedImage);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setShowImagePreview(false);
    setIsFromCamera(false); // Reset source flag
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện ảnh');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setCapturedImage(imageUri);
        setIsFromCamera(false); // Mark as gallery image
        setShowImagePreview(true);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện');
    }
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
        {(isCapturing || isCropping) && (
          <View style={styles.captureOverlay}>
            <Text style={styles.captureText}>
              {isCapturing ? 'Đang chụp ảnh...' : 'Đang cắt ảnh theo khung...'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.controlButton} onPress={pickImageFromGallery}>
          <Ionicons name="image" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.captureButton, isCapturing && styles.capturingButton]} 
          onPress={takePicture}
          disabled={isCapturing}
        >
          {isCapturing ? (
            <ActivityIndicator size={32} color="#fff" />
          ) : (
            <Ionicons name="camera" size={32} color="#fff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Image Preview Modal */}
      <Modal
        visible={showImagePreview}
        transparent={true}
        animationType="fade"
        onRequestClose={handleRetakePhoto}
      >
        <View style={styles.previewContainer}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                Hóa đơn của bạn
              </Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={handleRetakePhoto}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {capturedImage && (
              <>
                <Image 
                  source={{ uri: capturedImage }} 
                  style={styles.previewImage}
                  resizeMode="contain"
                />
                <Text style={styles.previewInstruction}>
                  Hãy kiểm tra chất lượng ảnh và nhấn "Quét hóa đơn" để tiếp tục.
                </Text>
              </>
            )}
            
            <View style={styles.previewActions}>
              <TouchableOpacity 
                style={[styles.previewButton, styles.retakeButton]} 
                onPress={handleRetakePhoto}
              >
                <Ionicons name={isFromCamera ? "camera" : "image"} size={20} color="#fff" />
                <Text style={styles.previewButtonText}>
                  {isFromCamera ? 'Chụp lại' : 'Chọn lại'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.previewButton, styles.confirmButton]} 
                onPress={handleConfirmImage}
              >
                <Ionicons name="scan" size={20} color="#fff" />
                <Text style={styles.previewButtonText}>Quét hóa đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Scan Loading Modal */}
      <ScanLoadingModal 
        visible={isScanning}
        onRequestClose={() => {
        }}
      />
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
    borderWidth: 3,
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
  captureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  instructionText: {
    position: 'absolute',
    bottom: 80,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 6,
    maxWidth: '90%',
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
  // Preview Modal Styles
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  previewImage: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.5,
    borderRadius: 8,
    marginBottom: 15,
  },
  previewInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 15,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#DD5E89',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
