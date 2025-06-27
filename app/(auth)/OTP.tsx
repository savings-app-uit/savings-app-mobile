import { forgotPasswordVerifyCodeAPI, signUpVerifyCodeAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OTPInput from '../component/OTPinput';


export default function OTP() {
    const router = useRouter();
    const { previousScreen, email, flow } = useLocalSearchParams<{ 
        previousScreen?: string;
        email?: string;
        flow?: string;
    }>();
    
    const [otp, setOTP] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGoToSignIn = () => {
        router.push('/(auth)/signin');
    };

    const handleVerifyCode = async () => {
        if (!otp.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã xác minh.');
            return;
        }

        if (!email) {
            Alert.alert('Lỗi', 'Không tìm thấy email.');
            return;
        }

        setLoading(true);
        try {
            console.log('Verifying code:', { email, code: otp, flow, previousScreen });
            
            let response;
            
            // Check flow parameter first, then previousScreen for backward compatibility
            const currentFlow = flow || previousScreen;
            
            if (currentFlow === 'forgotpassword') {
                response = await forgotPasswordVerifyCodeAPI(email, otp);
                if (response.message || response.statusCode === 200 || response.statusCode === '200') {
                    router.push({
                        pathname: '/(auth)/resetpassword',
                        params: { email, code: otp }
                    });
                }
            } else if (currentFlow === 'signup') {
                response = await signUpVerifyCodeAPI(email, otp);
                if (response.message == "Code verified successfully") {
                    router.push({
                        pathname: '/(auth)/signup',
                        params: { email, code: otp }
                    });
                }
                else {
                    Alert.alert('Lỗi', 'Mã xác minh không chính xác!');
                    return;
                }
            } else {
                Alert.alert('Lỗi', 'Thông tin xác minh không hợp lệ');
                return;
            }
            
            console.log('Verify code response:', response);
        } catch (error: any) {
            console.error('Verify code error:', error);
            Alert.alert('Lỗi', error.message || 'Xác minh thất bại');
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}>

            <View style={{ flexGrow: 1, alignContent: 'center', backgroundColor: '#fff'}}>

                <View style={{flexDirection: 'row', marginTop: 0}}>
                    <TouchableOpacity onPress={handleGoToSignIn}>
                        <Ionicons
                            style={{ marginLeft: 20, marginTop: 50,}}
                            name={'arrow-back'}
                            size={30}
                            color="#999"/>
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center', position: 'relative' }}>
                        <MaskedView 
                            maskElement={
                                <Text style={styles.gradientText}>
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

                <MaskedView 
                    maskElement={
                        <Ionicons
                            style={{ marginLeft: 0, marginTop: 50 }}
                            name={'lock-closed-outline'}
                            size={200}
                            color={'black'}/>
                    } 
                    style={{ alignSelf: 'center', marginTop: 50 }}>
                    <LinearGradient 
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 1, y: 0 }}>

                        <Ionicons
                            style={{ marginLeft: 0, marginTop: 50, opacity: 0 }}
                            name={'lock-closed-outline'}
                            size={200}
                            color={'black'}/>
                    </LinearGradient>
                </MaskedView>

                <MaskedView 
                    maskElement={
                        <Text style={styles.gradientText}>
                            Nhập mã xác minh
                        </Text>
                    } 
                    style={{ alignSelf: 'center', marginTop: 50 }}>
                    <LinearGradient 
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 1, y: 0 }}>
                        <Text style={[styles.gradientText, { opacity: 0 }]}>
                            Nhập mã xác minh
                        </Text>
                    </LinearGradient>
                </MaskedView>

                {/* <Text style={[styles.textTitle, {marginTop: 50, marginLeft: 20}]}>
                    Verification Code
                </Text>  */}

                <Text style={[styles.textdecription, {marginTop: 10, alignSelf: 'center'}]}>
                    Chúng tôi đã gửi mã gồm 4 chữ số đến
                </Text>

                <Text style={[styles.textEmail, {marginTop: 5, alignSelf: 'center'}]}>
                    {email || 'your email'}
                </Text> 

                {/* <TextInput 
                    style={[styles.input, {alignSelf: 'center', marginTop: 20}]}
                    placeholder='Enter OTP'
                    placeholderTextColor='#999'
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOTP}/>  */}

                <OTPInput
                    code={otp}
                    setCode={setOTP}
                    maxLength={4}
                />

                <View style={{flexDirection: 'row', marginTop: 10, alignSelf: 'center'}}>
                    <Text style={[styles.textdecription, {marginLeft: 0,}]}>
                            Bạn chưa nhận được mã?
                    </Text>

                    <TouchableOpacity>
                        <Text style={[styles.textlink, {marginLeft: 5,}]}>
                            Gửi lại
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleVerifyCode} disabled={loading}>
                    <LinearGradient 
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}} 
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        style={[styles.linearGradient, {marginTop: 20, alignSelf: 'center', width: '80%', height: 50}]}>

                        <Text style={styles.buttonText}>
                            {loading ? 'Đang xác minh' : 'Xác minh'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'contain',
    },
    toplogo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 0
    },
    textTitle: {
        fontFamily: 'Inter',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#323232',
    },
    textdecription: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'regular',
        color: '#6c7278',
    },
    textEmail: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#323232',
    },
    input: {
        width: '80%',
        height: 45,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        paddingHorizontal: 15,
        fontFamily: 'Inter',
        fontSize: 14,
        color: 'black'
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 60
    },
    buttonText: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 15,
    },
    gradientLogo: {
        fontFamily: 'Inter',
        fontSize: 32,
        fontWeight: 'bold',
    },
    gradientText: {
        fontFamily: 'Inter',
        fontSize: 26,
        fontWeight: 'bold',
    },
    textlink: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4d81e7',
    },
});
