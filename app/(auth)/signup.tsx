import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
    Alert,
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

const bgImage = require('@/assets/images/hi/bgsignup.png');
const logo = require('@/assets/images/logo/logoonly.png');



export default function SignIn() {
    const router = useRouter();
    
    const toggleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };

    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleGoToSignIn = () => {
        router.push("/(auth)/signin");
    };

    const handleSubmit = () => {
            if (password !== confirmPassword) {
                Alert.alert('Error', 'Passwords do not match!');
            } else {
                router.push('/(auth)/success?previousScreen=signup');
            }
        };

    const [showPassword1, setShowPassword1] = React.useState(false);  
    const [showPassword2, setShowPassword2] = React.useState(false); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');

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

                    <TouchableOpacity onPress={handleGoToSignIn}>
                        <Ionicons
                            style={{ marginLeft: 20, marginTop: 60 }}
                            name={'arrow-back'}
                            size={30}
                            color="#999"/>
                    </TouchableOpacity>

                    <MaskedView 
                        maskElement={
                            <Text style={styles.gradientText}>
                                Sign Up
                            </Text>
                        } 
                        style={{ alignSelf: 'center', marginTop: 20 }}>

                        <LinearGradient 
                            colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                            start={{ x: 0, y: 0 }} 
                            end={{ x: 1, y: 0 }}>

                            <Text style={[styles.gradientText, { opacity: 0 }]}>
                                Sign Up
                            </Text>
                        </LinearGradient>
                    </MaskedView>

                    <View style={{flexDirection: 'row', marginTop: 10, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={[styles.textdecription, {marginLeft: 0,}]}>
                            Already have an account?
                        </Text>

                        <TouchableOpacity onPress={handleGoToSignIn}>
                            <Text style={[styles.textlink, {marginLeft: 5,}]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.textdecription, {marginTop: 30, marginLeft: 40}]}>
                        Username
                    </Text>

                    <TextInput 
                        style={[styles.input, {alignSelf: 'center', marginTop: 5}]}
                        placeholder='Enter your username'
                        placeholderTextColor='#999'
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={username}
                        onChangeText={setUsername}/>

                    <Text style={[styles.textdecription, {marginTop: 10, marginLeft: 40}]}>
                        Phone Number 
                    </Text>

                    <TextInput 
                        style={[styles.input, {alignSelf: 'center', marginTop: 5}]}
                        placeholder='Enter your phone number'
                        placeholderTextColor='#999'
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='phone-pad'
                        value={phone}
                        onChangeText={setPhone}/>

                    <Text style={[styles.textdecription, {marginTop: 10, marginLeft: 40}]}>
                        Password
                    </Text>

                    <View style={[styles.passwordInputContainer, { alignSelf: 'center', marginTop: 5 }]}>
                        <TextInput
                            style={styles.passwordInput} 
                            placeholder='Enter your password'
                            placeholderTextColor='#999'
                            secureTextEntry={!showPassword1}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={password}
                            onChangeText={setPassword}/>  

                        <TouchableOpacity
                            onPress={toggleShowPassword1}
                            style={styles.toggleButton}>
                            <Ionicons
                                name={showPassword1 ? 'eye' : 'eye-off'}
                                size={20}
                                color="#999"/>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.textdecription, {marginTop: 20, marginLeft: 40}]}>
                        Confirm password
                    </Text>
                    
                    <View style={[styles.passwordInputContainer, { alignSelf: 'center', marginTop: 5 }]}>
                        <TextInput
                            style={styles.passwordInput} 
                            placeholder='Enter your password'
                            placeholderTextColor='#999'
                            secureTextEntry={!showPassword2}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}/>  
                                    
                        <TouchableOpacity
                            onPress={toggleShowPassword2}
                            style={styles.toggleButton}>
                            <Ionicons
                                name={showPassword2 ? 'eye' : 'eye-off'}
                                size={20}
                                color="#999"/>
                            </TouchableOpacity>
                        </View>

                    <TouchableOpacity onPress={handleSubmit}>
                        <LinearGradient 
                            start={{x: 0, y: 0}} 
                            end={{x: 1, y: 0}} 
                            colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                            style={[styles.linearGradient, {marginTop: 60, alignSelf: 'center', width: '80%', height: 50}]}>
                            <Text style={styles.buttonText}>
                                Sign Up
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
    },
});