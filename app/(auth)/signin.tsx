import { Ionicons } from '@expo/vector-icons';
import React from 'react';
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
import { NavigationHelper } from '../../utils/navigation';

const bgImage = require('@/assets/images/hi/bg3.png');
const logo = require('@/assets/images/logo/logoonly.png');
const startImage = require('@/assets/images/hi/start.png');
const loginImage = require('@/assets/images/hi/login.png');

export default function SignIn() {
    const [showPassword, setShowPassword] = React.useState(false);
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        // Here you would normally validate credentials
        // For now, just navigate to home
        NavigationHelper.replaceWithHome();
    };

    const handleSignUp = () => {
        // Navigate to sign up screen (you can create this later)
        console.log('Navigate to Sign Up');
    };
    return (
        <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}>

            <ImageBackground
                source={bgImage} 
                style={styles.container}>

                <View style={{ flexGrow: 1, justifyContent: 'center'}}>
                    <Image 
                        source={logo}
                        style={styles.toplogo}
                        resizeMode='contain'/>
                    <Image 
                        source={startImage}
                        style={[styles.start, {marginTop: 40}]}
                        resizeMode='contain'/>
                    <Text style={[styles.text1, {marginTop: -50, alignSelf: 'center',}]}>
                        Create an account or log in to explore our app
                    </Text>
                    <Text style={[styles.text1, {marginTop: 70, marginLeft: 60}]}>
                        Email
                    </Text>
                    <TextInput 
                        style={[styles.input, {alignSelf: 'center', marginTop: 5}]}
                        placeholder='Enter your email'
                        placeholderTextColor='#999'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}/>
                    <Text style={[styles.text1, {marginTop: 10, marginLeft: 60}]}>
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
                        />                        
                        <TouchableOpacity
                            onPress={toggleShowPassword}
                            style={styles.toggleButton}
                        >
                            <Ionicons
                                name={showPassword ? 'eye' : 'eye-off'}
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={[styles.text2, {marginTop: 10, alignSelf: 'flex-end', marginRight: 60}]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image 
                        source={loginImage}
                        style={[styles.start, {marginTop: 20}]}
                        resizeMode='contain'></Image>
                    </TouchableOpacity>
                    
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <Text style={[styles.text1, {marginLeft: 100,}]}>
                            Don’t have an account?
                        </Text>
                        <Text style={[styles.text2, {marginLeft: 10,}]}>
                            Sign Up
                        </Text>
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
        marginTop: -20
    },
    bg: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        marginTop: 20
    },
    text1: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'regular',
        color: '#6c7278',
    },
    text2: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4d81e7',
    },
    start: {
        width: 250,
        height: 150,
        alignSelf: 'center',
        
    },
    input: {
        width: '70%',
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
        width: '70%',
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
        
    },    toggleButton: {
        padding: 10, 
    },
});