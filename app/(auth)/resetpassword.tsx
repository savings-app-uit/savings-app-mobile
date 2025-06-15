import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter } from "expo-router";
import { useState } from 'react';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationHelper } from '../../utils/navigation';


export default function SignIn() {
    const router = useRouter();

    const toggleShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };

    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleGoToSignIn = () => {
        router.push('/(auth)/signin');
    };

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match!');
        } else {
            router.push('/(auth)/success?previousScreen=resetpassword');
        }
    };

    const [showPassword1, setShowPassword1] = React.useState(false);  
    const [showPassword2, setShowPassword2] = React.useState(false);  
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

                <Text style={[styles.textTitle, {marginTop: 50, alignSelf: 'center'}]}>
                    Enter Your New Password
                </Text> 

                <Text style={[styles.textdecription, {marginTop: 30, marginLeft: 40}]}>
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
                        style={[styles.linearGradient, {marginTop: 50, alignSelf: 'center', width: '80%', height: 50}]}>

                        <Text style={styles.buttonText}>
                            Reset password
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
