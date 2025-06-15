import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const bgImage = require('@/assets/images/hi/bgsignin.png');
const logo = require('@/assets/images/logo/logoonly.png');

export default function SignIn() {
    const router = useRouter();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleGoToSignUp = () => {
        router.push('/(auth)/signup');
    };

    const handleGoToForgotPassword = () => {
        router.push('/(auth)/forgotpassword');
    };

    // const handleLogin = () => {
    //     // Here you would normally validate credentials
    //     // For now, just navigate to home
    //     NavigationHelper.replaceWithHome();
    // };

    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}>

            <ImageBackground
                source={bgImage} 
                style={styles.container}>

                <View style={{ flexGrow: 1}}>
                    
                    <Image 
                        source={logo}
                        style={styles.toplogo}
                        resizeMode='contain'/>

                    <MaskedView 
                        maskElement={
                            <Text style={styles.gradientText}>
                                Start your Zentra!
                            </Text>
                        } 
                        style={{ alignSelf: 'center', marginTop: 100 }}>
                        <LinearGradient 
                            colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                            start={{ x: 0, y: 0 }} 
                            end={{ x: 1, y: 0 }}>

                            <Text style={[styles.gradientText, { opacity: 0 }]}>
                                Start your Zentra!
                            </Text>
                        </LinearGradient>
                    </MaskedView>

                    <Text style={[styles.textdecription, {marginTop: 10, alignSelf: 'center',}]}>
                        Create an account or log in to explore our app
                    </Text>

                    <Text style={[styles.textdecription, {marginTop: 70, marginLeft: 40}]}>
                        Email
                    </Text>

                    <TextInput 
                        style={[styles.input, {alignSelf: 'center', marginTop: 5}]}
                        placeholder='Enter your email'
                        placeholderTextColor='#999'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}/>

                    <Text style={[styles.textdecription, {marginTop: 10, marginLeft: 40}]}>
                        Password
                    </Text>

                    <View style={[styles.passwordInputContainer, { alignSelf: 'center', marginTop: 5 }]}>
                        <TextInput
                            style={styles.passwordInput} 
                            placeholder='Enter your password'
                            placeholderTextColor='#999'
                            secureTextEntry={!showPassword}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={password}
                            onChangeText={setPassword}/>  

                        <TouchableOpacity
                            onPress={toggleShowPassword}
                            style={styles.toggleButton}>
                            <Ionicons
                                name={showPassword ? 'eye' : 'eye-off'}
                                size={20}
                                color="#999"/>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleGoToForgotPassword}>
                        <Text style={[styles.textlink, {marginTop: 10, alignSelf: 'flex-end', marginRight: 40}]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                            style={[styles.linearGradient, {marginTop: 60, alignSelf: 'center', width: '80%', height: 50}]}>

                            <Text style={styles.buttonText}>
                                Sign In
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={{flexDirection: 'row', marginTop: 90, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={[styles.textdecription, {marginLeft: 0,}]}>
                            Don't have an account?
                        </Text>

                        <TouchableOpacity onPress={handleGoToSignUp}>
                            <Text style={[styles.textlink, {marginLeft: 5,}]}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
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
        marginTop: 60
    },
    bg: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        marginTop: 20
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
    passwordInputContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
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
        elevation: 5,
        
    },
    passwordInput: {
        flex: 1, 
        paddingHorizontal: 15,
        fontFamily: 'Inter',
        fontSize: 14,
        color: 'black',
        
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
    gradientText: {
        fontFamily: 'Inter',
        fontSize: 32,
        fontWeight: 'bold',
    }
});