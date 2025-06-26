import { getProfileAPI, updateProfileAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
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
    const isInitialLoad = useRef(true);

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
            
            let profileData: IProfile | null = null;
            
            if (response) {
                if ('data' in response && response.data) {
                    profileData = response.data;
                }
                else if ('id' in response && response.id) {
                    profileData = response as any as IProfile;
                }
            }
            
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
            'Update Avatar',
            'Choose an option',
            [
                { text: 'Camera', onPress: () => console.log('Camera selected') },
                { text: 'Gallery', onPress: () => console.log('Gallery selected') },
                { text: 'Remove', onPress: () => handleUpdateAvatar('') },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleUpdateAvatar = async (imageUrl: string) => {
        try {
            const updateData: IUpdateProfileRequest = {
                imageUrl: imageUrl
            };

            const response = await updateProfileAPI(updateData);
            
            let profileData: IProfile | null = null;
            
            if (response) {
                if ('data' in response && response.data) {
                    profileData = response.data;
                } else if ('id' in response && response.id) {
                    profileData = response as any as IProfile;
                }
            }
            
            if (profileData) {
                setUser(profileData);
                setAvatar(profileData.imageUrl || '');
                Alert.alert('Success', 'Avatar updated successfully');
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            Alert.alert('Error', 'Failed to update avatar');
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
});