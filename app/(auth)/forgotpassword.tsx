import { forgotPasswordSendCodeAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
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

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoToSignIn = () => {
        router.push('/(auth)/signin');
    };

    const handleSendCode = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            console.log('Sending forgot password code to:', email);
            const response = await forgotPasswordSendCodeAPI(email);
            console.log('Send code response:', response);
            
            if (response.statusCode === 200 || response.statusCode === '200' || response.message) {
                router.push({
                    pathname: '/(auth)/OTP',
                    params: { 
                        email,
                        previousScreen: 'forgotpassword'
                    }
                });
                
                Alert.alert(
                    'Success', 
                    response.message || 'Verification code sent to your email'
                );
            } else {
                Alert.alert('Error', response.message || 'Failed to send code');
            }
        } catch (error: any) {
            console.error('Send code error:', error);
            let errorMessage = 'Network error occurred';
            
            if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = error.message || 'Request setup error';
            }
            
            Alert.alert('Error', errorMessage);
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

            <View style={{ flexGrow: 1, backgroundColor: '#fff'}}>

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
                            name={'shield-checkmark-outline'}
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
                            name={'shield-checkmark-outline'}
                            size={200}
                            color={'black'}/>
                    </LinearGradient>
                </MaskedView>

                <MaskedView 
                    maskElement={
                        <Text style={styles.gradientText}>
                            Forgot your password?
                        </Text>
                    } 
                    style={{ alignSelf: 'center', marginTop: 50 }}>
                    <LinearGradient 
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 1, y: 0 }}>
                        <Text style={[styles.gradientText, { opacity: 0 }]}>
                            Forgot your password?
                        </Text>
                    </LinearGradient>
                </MaskedView>

                <Text style={[styles.textdecription, {marginTop: 10, alignSelf: 'center',}]}>
                    Enter your email and we will send you a verification code
                </Text>

                <Text style={[styles.textdecription, {marginTop: 50, marginLeft: 40}]}>
                    Email
                </Text>

                <TextInput 
                    style={[styles.input, {alignSelf: 'center', marginTop: 5}]}
                    placeholder='Enter your email'
                    placeholderTextColor='#999'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={setEmail}/>

                <TouchableOpacity onPress={handleSendCode} disabled={loading}>
                    <LinearGradient 
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}} 
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        style={[styles.linearGradient, {marginTop: 60, alignSelf: 'center', width: '80%', height: 50}]}>

                        <Text style={styles.buttonText}>
                            {loading ? 'Sending...' : 'Send code'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
}

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
    textdecription: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'regular',
        color: '#6c7278',
    },
    textlink: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4d81e7',
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
    toggleButton: {
        padding: 10, 
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
    }
});