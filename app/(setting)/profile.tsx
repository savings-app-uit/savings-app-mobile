import { createAvatarFormData, extractProfileData, getProfileAPI, updateAvatarAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskedView from '@react-native-masked-view/masked-view';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IProfile | null>(null);
    const [avatar, setAvatar] = useState('');
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const isInitialLoad = useRef(true);
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        checkAuthAndLoadProfile();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (isInitialLoad.current) {
                isInitialLoad.current = false;
                return;
            }
            
            loadProfile();
        }, [])
    );

    const checkAuthAndLoadProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            
            if (!token) {
                Alert.alert('Authentication Error', 'Please login again', [
                    { text: 'OK', onPress: () => router.replace('/(auth)/signin') }
                ]);
                return;
            }
            
            await loadProfile();
        } catch (error) {
            console.error('Error checking auth:', error);
            Alert.alert('Error', 'Authentication check failed');
        }
    };

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await getProfileAPI();
            
            const profileData = extractProfileData(response);
            
            if (profileData) {
                setUser(profileData);
                setAvatar(profileData.imageUrl || '');
            } else {
                Alert.alert('Error', 'No profile data received from server');
            }
        } catch (error: any) {
            console.error('Error loading profile:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            
            let errorMessage = 'Failed to load profile data';
            if (error.response?.status === 401) {
                errorMessage = 'Please login again';
            } else if (error.response?.status === 404) {
                errorMessage = 'Profile not found';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleAvatarEdit = () => {
        Alert.alert(
            'Cập nhật ảnh đại diện',
            'Chọn một tùy chọn',
            [
                { text: 'Chụp ảnh', onPress: () => handleCameraOption() },
                { text: 'Chọn từ thư viện', onPress: () => handleGalleryOption() },
                { text: 'Hủy', style: 'cancel' }
            ]
        );
    };

    const handleCameraOption = async () => {
        if (!cameraPermission) {
            Alert.alert('Lỗi', 'Đang kiểm tra quyền camera...');
            return;
        }

        if (!cameraPermission.granted) {
            const permission = await requestCameraPermission();
            if (!permission.granted) {
                Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền camera để chụp ảnh');
                return;
            }
        }

        setShowCameraModal(true);
    };

    const handleGalleryOption = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện ảnh');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], 
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                await handleUpdateAvatar(imageUri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện');
        }
    };

    const handleTakePicture = async () => {
        if (!cameraRef.current) {
            Alert.alert('Lỗi', 'Camera không khả dụng');
            return;
        }

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
            });

            if (photo) {
                setCapturedPhoto(photo.uri);
                setShowCameraModal(false);
                setShowPreviewModal(true);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
            Alert.alert('Lỗi', 'Không thể chụp ảnh');
        }
    };

    const handleConfirmPhoto = async () => {
        if (capturedPhoto) {
            setShowPreviewModal(false);
            await handleUpdateAvatar(capturedPhoto);
            setCapturedPhoto(null);
        }
    };

    const handleRetakePhoto = () => {
        setShowPreviewModal(false);
        setCapturedPhoto(null);
        setShowCameraModal(true);
    };

    const handleFlipCamera = () => {
        setCameraFacing(current => current === 'front' ? 'back' : 'front');
    };

    const handleUpdateAvatar = async (imageUri: string) => {
        try {
            setIsUpdatingAvatar(true);
            
            const formData = createAvatarFormData(imageUri, 'avatar.jpg');
            
            const response = await updateAvatarAPI(formData);
            
            if (response && response.user) {
                const updatedUser = {
                    ...user!,
                    imageUrl: response.user.imageUrl
                };
                setUser(updatedUser);
                setAvatar(response.user.imageUrl);
                
                Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật');
            }
        } catch (error: any) {
            console.error('Error updating avatar:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Không thể cập nhật ảnh đại diện';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Lỗi', errorMessage);
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                { 
                    text: 'Đăng xuất', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('accessToken');
                            router.replace('/(auth)/signin');
                        } catch (error) {
                            console.error('Error during logout:', error);
                            Alert.alert('Error', 'Failed to logout');
                        }
                    }
                }
            ]
        );
    };
    return (
      <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}>

          <View style={{ flexGrow: 1, backgroundColor: '#fff'}}>

              <View style={{flexDirection: 'row', marginTop: 0}}>
                  <TouchableOpacity onPress={handleBack}>
                      <Ionicons
                          style={{ marginLeft: 20, marginTop: 50,}}
                          name={'arrow-back'}
                          size={30}
                          color="#999"/>
                  </TouchableOpacity>

                  <View style={{ flex: 1, alignItems: 'center', position: 'relative', marginLeft: -30 }}>
                      <MaskedView 
                          maskElement={
                              <Text style={styles.gradientLogo}>
                                  Zentra
                              </Text>
                          } 
                          style={{marginTop: 50, position: 'absolute'}}>
                          <LinearGradient 
                              colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                              start={{ x: 0, y: 0 }} 
                              end={{ x: 1, y: 0 }}
                              style={{ paddingHorizontal: 10 }}>

                              <Text style={[styles.gradientLogo, { opacity: 0 }]}>
                                  Zentra
                              </Text>
                          </LinearGradient>
                      </MaskedView>
                  </View> 
              </View> 
                    
              <View style={styles.content}>
                  {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                      <Text style={{ fontSize: 18, color: '#666' }}>Loading...</Text>
                    </View>
                  ) : user ? (
                    <View style={styles.profileContainer}>
                      {/* Avatar Section */}
                      <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={handleAvatarEdit} style={{ position: 'relative' }}>
                          {user.imageUrl ? (
                            <Image
                              source={{uri: user.imageUrl}}
                              style={styles.avatar}
                            />
                          ) : (
                            <LinearGradient 
                              colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                              start={{ x: 0, y: 0 }} 
                              end={{ x: 1, y: 0 }}
                              style={styles.avatarGradient}>
                              <Ionicons
                                name="person"
                                size={60}
                                color="#fff"
                              />
                            </LinearGradient>
                          )}
                          {/* Loading overlay */}
                          {isUpdatingAvatar && (
                            <View style={styles.avatarLoadingOverlay}>
                              <ActivityIndicator size="large" color="#DD5E89" />
                            </View>
                          )}
                          {/* Edit icon overlay */}
                          <View style={styles.avatarEditIcon}>
                            <Ionicons
                              name="camera"
                              size={18}
                              color="#999"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>

                      {/* User Name */}
                      <View style={styles.nameSection}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => router.push('./update-profile')}
                        >
                          <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                            style={styles.buttonGradient}>
                            <Ionicons name="person-outline" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>
                              Cập nhật thông tin cá nhân
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => router.push('./change-password')}
                        >
                          <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                            style={styles.buttonGradient}>
                            <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>
                              Đổi mật khẩu
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>

                      {/* Logout Button - Fixed at bottom */}
                      <View style={styles.logoutContainer}>
                        <TouchableOpacity 
                          style={styles.logoutButton}
                          onPress={handleLogout}
                        >
                          <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#FF6B6B', '#FF8E85', '#FFB199']} 
                            style={styles.buttonGradient}>
                            <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>
                              Đăng xuất
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 100 }}>
                      <Text style={{ marginBottom: 20, textAlign: 'center', fontSize: 18, color: '#666' }}>Failed to load profile</Text>
                      <Text style={{ marginBottom: 20, textAlign: 'center', color: '#999', fontSize: 12 }}>
                        Check the console for error details
                      </Text>
                      <TouchableOpacity onPress={checkAuthAndLoadProfile} style={{ marginBottom: 10 }}>
                        <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                            style={[styles.linearGradient1, { paddingHorizontal: 20 }]}>
                            <Text style={styles.buttonText1}>
                                Retry
                            </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={async () => {
                        const token = await AsyncStorage.getItem('accessToken');
                        Alert.alert('Debug Info', `Token: ${token ? 'exists' : 'not found'}\nAPI URL: ${process.env.EXPO_PUBLIC_API_URL || 'not set'}`);
                      }}>
                        <Text style={{ color: '#999', fontSize: 12 }}>Debug Info</Text>
                      </TouchableOpacity>
                    </View>
                  )}                          
              </View>    
                          
              {/* Camera Modal */}
              <Modal
                visible={showCameraModal}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setShowCameraModal(false)}
              >
                <View style={styles.cameraContainer}>
                  <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={cameraFacing}
                  />
                  
                  <View style={styles.cameraControls}>
                    <TouchableOpacity 
                      style={styles.cameraButton}
                      onPress={() => setShowCameraModal(false)}
                    >
                      <Ionicons name="close" size={30} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.captureButton}
                      onPress={handleTakePicture}
                    >
                      <Ionicons name="camera" size={32} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.cameraButton}
                      onPress={handleFlipCamera}
                    >
                      <Ionicons name="camera-reverse" size={30} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Photo Preview Modal */}
              <Modal
                visible={showPreviewModal}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setShowPreviewModal(false)}
              >
                <View style={styles.previewContainer}>
                  {capturedPhoto && (
                    <>
                      <Image
                        source={{ uri: capturedPhoto }}
                        style={styles.previewImage}
                        resizeMode="cover"
                      />
                    </>
                  )}
                  
                  <View style={styles.previewOverlay}>
                    <View style={styles.previewControls}>
                      <TouchableOpacity 
                        style={[styles.previewButton, styles.retakeButton]}
                        onPress={handleRetakePhoto}
                      >
                        <Ionicons name="camera" size={20} color="#fff" />
                        <Text style={styles.previewButtonText}>Chụp lại</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.previewButton, styles.confirmButton]}
                        onPress={handleConfirmPhoto}
                        disabled={isUpdatingAvatar}
                      >
                        {isUpdatingAvatar ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        )}
                        <Text style={styles.previewButtonText}>
                          {isUpdatingAvatar ? 'Đang cập nhật...' : 'Xác nhận'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              
          </View>
      </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      resizeMode: 'contain',
    },
    
    gradientLogo: {
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: 'bold',
    },
    content: {
      marginTop: 20,
      padding: 30
    },
    profileContainer: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 40,
      position: 'relative',
      paddingBottom: 100, 
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 999,
    },
    avatarGradient: {
      width: 120,
      height: 120,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 8,
    },
    avatarEditIcon: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: '#fff',
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 4,
    },
    avatarLoadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nameSection: {
      alignItems: 'center',
      marginBottom: 40,
    },
    userName: {
      fontFamily: 'Inter',
      fontSize: 28,
      fontWeight: '700',
      color: '#333',
      marginBottom: 8,
    },
    userEmail: {
      fontFamily: 'Inter',
      fontSize: 16,
      color: '#666',
      fontWeight: '400',
    },
    actionsContainer: {
      width: '100%',
      paddingHorizontal: 20,
      flex: 1,
    },
    logoutContainer: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
    },
    logoutButton: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    actionButton: {
      marginBottom: 16,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    buttonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    buttonIcon: {
      marginRight: 12,
    },
    buttonText: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    // Legacy styles for compatibility
    bold: {
      fontFamily: 'Inter',
      fontWeight: 700,
      color: '#000',
      fontSize: 30
    },
    label: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: 16,
      color: '#6c7278'
    },
    data: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: 20,
      color: '#000'
    },
    linearGradient1: {
        flex: 1,
        borderRadius: 60,
        alignContent: 'center',
        marginVertical: 10
    },
    buttonText1: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 60
    },
    // Camera styles
    cameraContainer: {
        flex: 1,
        position: 'relative',
    },
    camera: {
        flex: 1,
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
    cameraButton: {
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
    // Preview styles
    previewContainer: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
    },
    previewImage: {
        flex: 1,
        width: '100%',
    },
    previewOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 30,
        paddingBottom: 50,
    },
    previewTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Inter',
    },
    previewControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    previewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        minWidth: 120,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    retakeButton: {
        backgroundColor: '#666',
    },
    confirmButton: {
        backgroundColor: '#DD5E89',
    },
    previewButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
        fontFamily: 'Inter',
    },
    // Camera UI improvements
    cameraIndicator: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    cameraIndicatorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Inter',
    },
    captureInstruction: {
        position: 'absolute',
        bottom: 150,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    captureInstructionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        fontFamily: 'Inter',
    },
    // Avatar preview overlay
    avatarPreviewOverlay: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    avatarPreviewCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    avatarPreviewImage: {
        width: '100%',
        height: '100%',
    },
    avatarPreviewText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        fontFamily: 'Inter',
    },
});