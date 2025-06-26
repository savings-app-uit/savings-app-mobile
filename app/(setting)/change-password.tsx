import { changePasswordAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ChangePassword() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePasswords = () => {
        if (!currentPassword.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại');
            return false;
        }

        if (!newPassword.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
            return false;
        }

        if (newPassword.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
            return false;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return false;
        }

        if (currentPassword === newPassword) {
            Alert.alert('Lỗi', 'Mật khẩu mới phải khác mật khẩu hiện tại');
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validatePasswords()) {
            return;
        }

        try {
            setSaving(true);
            
            const data: IChangePasswordRequest = {
                oldPassword: currentPassword.trim(),
                newPassword: newPassword.trim()
            };

            await changePasswordAPI(data);
            
            Alert.alert(
                'Thành công', 
                'Đổi mật khẩu thành công', 
                [
                    { text: 'OK', onPress: () => router.back() }
                ]
            );
        } catch (error: any) {
            console.error('Error changing password:', error);
            
            let errorMessage = 'Không thể đổi mật khẩu';
            if (error.response?.status === 400) {
                errorMessage = 'Mật khẩu hiện tại không đúng';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            Alert.alert('Lỗi', errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleCurrentPasswordChange = useCallback((text: string) => {
        setCurrentPassword(text);
    }, []);

    const handleNewPasswordChange = useCallback((text: string) => {
        setNewPassword(text);
    }, []);

    const handleConfirmPasswordChange = useCallback((text: string) => {
        setConfirmPassword(text);
    }, []);

    const toggleCurrentPassword = useCallback(() => {
        setShowCurrentPassword(prev => !prev);
    }, []);

    const toggleNewPassword = useCallback(() => {
        setShowNewPassword(prev => !prev);
    }, []);

    const toggleConfirmPassword = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);

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
                                    Đổi mật khẩu
                                </Text>
                            }>
                            <LinearGradient 
                                colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                                start={{ x: 0, y: 0 }} 
                                end={{ x: 1, y: 0 }}
                                style={styles.titleGradient}>
                                <Text style={[styles.title, { opacity: 0 }]}>
                                    Đổi mật khẩu
                                </Text>
                            </LinearGradient>
                        </MaskedView>
                    </View>

                    <View style={styles.spacer} />
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Current Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu hiện tại *</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={currentPassword}
                                onChangeText={handleCurrentPasswordChange}
                                placeholder="Nhập mật khẩu hiện tại"
                                secureTextEntry={!showCurrentPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="off"
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity 
                                style={styles.eyeButton}
                                onPress={toggleCurrentPassword}>
                                <Ionicons 
                                    name={showCurrentPassword ? "eye" : "eye-off"} 
                                    size={20} 
                                    color="#999" 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu mới *</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={newPassword}
                                onChangeText={handleNewPasswordChange}
                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                secureTextEntry={!showNewPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="off"
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity 
                                style={styles.eyeButton}
                                onPress={toggleNewPassword}>
                                <Ionicons 
                                    name={showNewPassword ? "eye" : "eye-off"} 
                                    size={20} 
                                    color="#999" 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Xác nhận mật khẩu mới *</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                placeholder="Nhập lại mật khẩu mới"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="off"
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity 
                                style={styles.eyeButton}
                                onPress={toggleConfirmPassword}>
                                <Ionicons 
                                    name={showConfirmPassword ? "eye" : "eye-off"} 
                                    size={20} 
                                    color="#999" 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.noteContainer}>
                        <Text style={styles.noteTitle}>Lưu ý:</Text>
                        <Text style={styles.noteText}>• Mật khẩu phải có ít nhất 6 ký tự</Text>
                        <Text style={styles.noteText}>• Mật khẩu mới phải khác mật khẩu hiện tại</Text>
                        <Text style={styles.noteText}>• Hãy ghi nhớ mật khẩu mới sau khi thay đổi</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.saveButton}
                        onPress={handleChangePassword}
                        disabled={saving}>
                        <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                            style={styles.buttonGradient}>
                            <Text style={styles.buttonText}>
                                {saving ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
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
        marginLeft: -40,
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: 'Inter',
    },
    eyeButton: {
        padding: 16,
    },
    noteContainer: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: '#DD5E89',
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Inter',
    },
    noteText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
        fontFamily: 'Inter',
    },
    saveButton: {
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
    spacer: {
        // width: 20, 
    },
});
