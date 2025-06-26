import { extractProfileData, getProfileAPI, isSuccessResponse, updateProfileAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function UpdateProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<IProfile | null>(null);
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    
    const [originalName, setOriginalName] = useState('');
    const [originalPhone, setOriginalPhone] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await getProfileAPI();
            
            const profileData = extractProfileData(response);
            
            if (profileData && profileData.id) {
                setUser(profileData);
                setName(profileData.name);
                setPhone(profileData.phone || '');
                setEmail(profileData.email);
                
                setOriginalName(profileData.name);
                setOriginalPhone(profileData.phone || '');
            } else {
                Alert.alert('Lỗi', 'Không thể tải thông tin profile từ server');
            }
        } catch (error: any) {
            console.error('❌ Error loading profile:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Không thể tải thông tin profile';
            if (error.response?.status === 401) {
                errorMessage = 'Phiên đăng nhập đã hết hạn';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Alert.alert('Lỗi', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = () => {
        return name.trim() !== originalName || phone.trim() !== originalPhone;
    };

    const validatePhoneNumber = (phoneNumber: string) => {
        if (!phoneNumber.trim()) return true; 
        
        const cleanPhone = phoneNumber.replace(/[\s\-\(\)\.]/g, '');
        
        const vietnamesePhoneRegex = /^(\+84|84|0)[0-9]{9}$/;
        
        return vietnamesePhoneRegex.test(cleanPhone);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Lỗi', 'Tên hiển thị không được để trống');
            return;
        }

        if (!validatePhoneNumber(phone)) {
            Alert.alert(
                'Lỗi', 
                'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam đúng định dạng (VD: 0912345678, +84912345678)'
            );
            return;
        }

        if (!hasChanges()) {
            Alert.alert('Thông báo', 'Không có thay đổi nào để lưu');
            return;
        }

        try {
            setSaving(true);
            const updateData: IUpdateProfileRequest = {
                name: name.trim(),
                phone: phone.trim()
            };

            const response = await updateProfileAPI(updateData);
            
            if (isSuccessResponse(response)) {
                
                setOriginalName(name.trim());
                setOriginalPhone(phone.trim());
                
                Alert.alert(
                    'Thành công', 
                    'Cập nhật thông tin thành công!', 
                    [
                        { 
                            text: 'OK', 
                            onPress: () => {
                                router.back();
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Lỗi', 'Không nhận được xác nhận thành công từ server');
            }
        } catch (error: any) {
            console.error('❌ Error updating profile:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Không thể cập nhật thông tin';
            if (error.response?.status === 400) {
                errorMessage = 'Thông tin không hợp lệ';
            } else if (error.response?.status === 401) {
                errorMessage = 'Phiên đăng nhập đã hết hạn';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Lỗi', errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}>

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <MaskedView 
                            maskElement={
                                <Text style={styles.title}>
                                    Cập nhật thông tin
                                </Text>
                            }>
                            <LinearGradient 
                                colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                                start={{ x: 0, y: 0 }} 
                                end={{ x: 1, y: 0 }}
                                style={styles.titleGradient}>
                                <Text style={[styles.title, { opacity: 0 }]}>
                                    Cập nhật thông tin
                                </Text>
                            </LinearGradient>
                        </MaskedView>
                    </View>

                    <View style={styles.spacer} />
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên hiển thị <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[
                                styles.input,
                                !name.trim() && styles.errorInput
                            ]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nhập tên hiển thị"
                            autoCapitalize="words"
                        />
                        {!name.trim() && (
                            <Text style={styles.errorText}>
                                Tên hiển thị không được để trống
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={email}
                            editable={false}
                            placeholder="Email"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Số điện thoại</Text>
                        <TextInput
                            style={[
                                styles.input,
                                !validatePhoneNumber(phone) && phone.trim() !== '' && styles.errorInput
                            ]}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                        />
                        {!validatePhoneNumber(phone) && phone.trim() !== '' && (
                            <Text style={styles.errorText}>
                                Số điện thoại không hợp lệ
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity 
                        style={[
                            styles.saveButton,
                            (!hasChanges() || saving) && styles.disabledButton
                        ]}
                        onPress={handleSave}
                        disabled={!hasChanges() || saving}>
                        <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={
                                (!hasChanges() || saving) 
                                    ? ['#CCCCCC', '#CCCCCC', '#CCCCCC'] 
                                    : ['#DD5E89', '#EB8E90', '#F7BB97']
                            }
                            style={styles.buttonGradient}>
                            <Text style={[
                                styles.buttonText,
                                (!hasChanges() || saving) && styles.disabledButtonText
                            ]}>
                                {saving ? 'Đang lưu...' : 
                                 !hasChanges() ? 'Không có thay đổi' : 'Lưu thay đổi'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spacer: {
        // width: 20, 
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Inter',
    },
    titleGradient: {
        paddingHorizontal: 10,
    },
    form: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Inter',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: 'Inter',
        backgroundColor: '#FAFAFA',
    },
    disabledInput: {
        backgroundColor: '#F5F5F5',
        color: '#999',
    },
    note: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        fontFamily: 'Inter',
    },
    saveButton: {
        marginTop: 30,
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
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter',
    },
    disabledButton: {
        opacity: 0.6,
    },
    disabledButtonText: {
        color: '#999',
    },
    errorInput: {
        borderColor: '#FF6B6B',
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        fontSize: 12,
        color: '#FF6B6B',
        marginTop: 4,
        fontFamily: 'Inter',
    },
    required: {
        color: '#FF6B6B',
    },
});
