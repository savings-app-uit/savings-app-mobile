import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function SignIn() {
    const router = useRouter();
    const { previousScreen } = useLocalSearchParams<{ previousScreen?: string }>();

    const handleGoToSignIn = () => {
        router.push('/(auth)/signin');
    };

    const handleButton = () => {
        if (previousScreen === 'forgotpassword') {
            router.push("/(auth)/resetpassword");
        } else if (previousScreen === 'enteremail') {
            router.push("/(auth)/signup");
        }
    };

    const [otp, setOTP] = useState("");

    const user = {
        email: "email@gmail.com",
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

                <Text style={[styles.textTitle, {marginTop: 50, marginLeft: 20}]}>
                    Verification Code
                </Text> 

                <Text style={[styles.textdecription, {marginTop: 10, marginLeft: 20}]}>
                    We have sent a 4-digit code to
                </Text>

                <Text style={[styles.textEmail, {marginTop: 5, marginLeft: 20}]}>
                    {user.email}
                </Text> 

                <TextInput 
                    style={[styles.input, {alignSelf: 'center', marginTop: 20}]}
                    placeholder='Enter OTP'
                    placeholderTextColor='#999'
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOTP}/> 

                <View style={{flexDirection: 'row', marginTop: 10, marginLeft:20}}>
                    <Text style={[styles.textdecription, {marginLeft: 0,}]}>
                            Didn't receive it?
                    </Text>

                    <TouchableOpacity>
                        <Text style={[styles.textlink, {marginLeft: 5,}]}>
                            Resend
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleButton}>
                    <LinearGradient 
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}} 
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        style={[styles.linearGradient, {marginTop: 20, alignSelf: 'center', width: '80%', height: 50}]}>

                        <Text style={styles.buttonText}>
                            Verify code
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
