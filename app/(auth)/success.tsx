import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function SignIn() {
    const router = useRouter();
    const { previousScreen } = useLocalSearchParams<{ previousScreen?: string }>();

    let displayText = '';
    let buttonText = '';

    if (previousScreen === 'resetpassword') {
        displayText = 'Password reseted';
        buttonText = 'Back to Sign In'
    } else if (previousScreen === 'signup') {
        displayText = 'Account created';
        buttonText = 'Back to Sign In';
    }

    const handleButton = () => {
        if (previousScreen === 'resetpassword') {
            router.push('/(auth)/signin');
        } else if (previousScreen === 'signup') {
            router.push('/(auth)/signin');
        }
    };

    return (
        <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}>

            <View style={{ flexGrow: 1, backgroundColor: '#fff'}}>
                    
                <MaskedView 
                    maskElement={
                        <Ionicons
                            style={{ marginLeft: 0, marginTop: 50 }}
                            name={'checkmark-circle-outline'}
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
                            name={'checkmark-circle-outline'}
                            size={200}
                            color={'black'}/>
                    </LinearGradient>
                </MaskedView>

                <MaskedView 
                    maskElement={
                        <Text style={styles.gradientText}>
                            {displayText}
                        </Text>
                    } 
                    style={{ alignSelf: 'center', marginTop: 50 }}>
                    <LinearGradient
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 1, y: 0 }}>
                        <Text style={[styles.gradientText, { opacity: 0 }]}>
                            {displayText}
                        </Text>
                    </LinearGradient>
                </MaskedView>

                <MaskedView 
                    maskElement={
                        <Text style={styles.gradientText}>
                            successfully!
                        </Text>
                    } 
                    style={{ alignSelf: 'center', marginTop: 10 }}>
                    <LinearGradient
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 1, y: 0 }}>
                        <Text style={[styles.gradientText, { opacity: 0 }]}>
                            successfully!
                        </Text>
                    </LinearGradient>
                </MaskedView>

                <TouchableOpacity onPress={handleButton}>
                    <LinearGradient 
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}} 
                        colors={['#DD5E89', '#EB8E90', '#F7BB97']} 
                        style={[styles.linearGradient, {marginTop: 60, alignSelf: 'center', width: '80%', height: 50}]}>

                        <Text style={styles.buttonText}>
                            {buttonText}
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