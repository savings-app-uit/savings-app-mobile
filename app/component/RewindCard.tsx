import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RewindCardProps {
    onPress: () => void;
}

export default function RewindCard({ onPress }: RewindCardProps) {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthText = lastMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}>
                
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="sparkles" size={32} color="#fff" />
                    </View>
                    
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Zentra Wrapped</Text>
                        <Text style={styles.subtitle}>
                            Xem lại hành trình tài chính {lastMonthText}
                        </Text>
                    </View>
                    
                    <View style={styles.arrowContainer}>
                        <Ionicons name="chevron-forward" size={24} color="#fff" />
                    </View>
                </View>
                
                <View style={styles.decorationContainer}>
                    <View style={[styles.decoration, styles.decoration1]} />
                    <View style={[styles.decoration, styles.decoration2]} />
                    <View style={[styles.decoration, styles.decoration3]} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#667eea',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    gradient: {
        padding: 20,
        minHeight: 100,
        position: 'relative',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.9,
        lineHeight: 18,
    },
    arrowContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    decorationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    decoration: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 50,
    },
    decoration1: {
        width: 80,
        height: 80,
        top: -20,
        right: -20,
    },
    decoration2: {
        width: 60,
        height: 60,
        bottom: -10,
        left: -10,
    },
    decoration3: {
        width: 40,
        height: 40,
        top: 10,
        right: 60,
    },
});
