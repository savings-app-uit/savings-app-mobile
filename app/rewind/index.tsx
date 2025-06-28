import { getRewindAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function RewindWrapped() {
    const router = useRouter();
    const [rewindData, setRewindData] = useState<IRewindResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    
    const translateX = useRef(new Animated.Value(0)).current;
    const slideOpacity = useRef(new Animated.Value(0)).current;
    const scaleValue = useRef(new Animated.Value(0.8)).current;
    const morphValue = useRef(new Animated.Value(1)).current;
    const slideTransition = useRef(new Animated.Value(0)).current;
    const iconRotation = useRef(new Animated.Value(0)).current;
    
    const bounceValue = useRef(new Animated.Value(0)).current;
    const spinValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;
    const shakeX = useRef(new Animated.Value(0)).current;
    const wobbleRotation = useRef(new Animated.Value(0)).current;
    const elasticScale = useRef(new Animated.Value(0)).current;
    const flipRotation = useRef(new Animated.Value(0)).current;
    const circularMotion = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadRewindData();
    }, []);

    useEffect(() => {
        if (rewindData && rewindData.slides[currentSlideIndex]) {
            const currentSlide = rewindData.slides[currentSlideIndex];
            const animationStyle = getAnimationStyle(currentSlide.type);
            startDynamicAnimation(animationStyle).start();
        }
    }, [currentSlideIndex, rewindData]);

    const loadRewindData = async () => {
        try {
            setLoading(true);
            const response = await getRewindAPI();
            
            if (response) {
                setRewindData(response);
            } else {
                Alert.alert('Lỗi', 'Không thể tải dữ liệu wrapped');
            }
        } catch (error: any) {
            Alert.alert('Lỗi', 'Không thể tải dữ liệu wrapped');
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        if (rewindData && currentSlideIndex < rewindData.slides.length - 1) {
            Animated.parallel([
                Animated.timing(slideOpacity, {
                    toValue: 0,
                    duration: 60, 
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 0.8,
                    duration: 60, 
                    useNativeDriver: true,
                }),
                Animated.timing(slideTransition, {
                    toValue: 50,
                    duration: 60, 
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setCurrentSlideIndex(currentSlideIndex + 1);
            });
        } else if (rewindData && currentSlideIndex === rewindData.slides.length - 1) {
            Animated.parallel([
                Animated.timing(slideOpacity, {
                    toValue: 0,
                    duration: 100, 
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 0.5,
                    duration: 100, 
                    useNativeDriver: true,
                }),
            ]).start(() => {
                router.back();
            });
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            Animated.parallel([
                Animated.timing(slideOpacity, {
                    toValue: 0,
                    duration: 60, 
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 0.8,
                    duration: 60, 
                    useNativeDriver: true,
                }),
                Animated.timing(slideTransition, {
                    toValue: -50,
                    duration: 60, 
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setCurrentSlideIndex(currentSlideIndex - 1);
            });
        }
    };

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX, velocityX } = event.nativeEvent;
            
            if (translationX < -50 || velocityX < -500) {
                nextSlide();
            } else if (translationX > 50 || velocityX > 500) {
                prevSlide();
            }
            
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    };

    const getSlideGradient = (slideType: string): [string, string] => {
        switch (slideType) {
            case 'intro':
                return ['#667eea', '#764ba2'];
            case 'top_category':
                return ['#f093fb', '#f5576c'];
            case 'biggest_transaction':
                return ['#4facfe', '#00f2fe'];
            case 'weekend_trend':
                return ['#43e97b', '#38f9d7'];
            case 'suggestion':
                return ['#fa709a', '#fee140'];
            case 'motivation':
                return ['#a8edea', '#fed6e3'];
            case 'fun_fact':
                return ['#ff9a9e', '#fecfef'];
            default:
                return ['#667eea', '#764ba2'];
        }
    };

    const getSlideIcon = (slideType: string) => {
        switch (slideType) {
            case 'intro':
                return 'sparkles';
            case 'top_category':
                return 'heart';
            case 'biggest_transaction':
                return 'diamond';
            case 'weekend_trend':
                return 'calendar';
            case 'suggestion':
                return 'bulb';
            case 'motivation':
                return 'rocket';
            case 'fun_fact':
                return 'star';
            default:
                return 'star';
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getAnimationStyle = (slideType: string) => {
        switch (slideType) {
            case 'intro':
                return 'sparkle'; 
            case 'top_category':
                return 'heartbeat'; 
            case 'biggest_transaction':
                return 'explosion'; 
            case 'weekend_trend':
                return 'wave'; 
            case 'suggestion':
                return 'lightbulb'; 
            case 'motivation':
                return 'rocket'; 
            case 'fun_fact':
                return 'twinkle'; 
            default:
                return 'fade';
        }
    };

    const startDynamicAnimation = (animationStyle: string) => {
        const resetValues = () => {
            slideOpacity.setValue(0);
            scaleValue.setValue(0.3);
            morphValue.setValue(0);
            slideTransition.setValue(0);
            iconRotation.setValue(0);
            bounceValue.setValue(0);
            spinValue.setValue(0);
            pulseValue.setValue(1);
            shakeX.setValue(0);
            wobbleRotation.setValue(0);
            elasticScale.setValue(0);
            flipRotation.setValue(0);
            circularMotion.setValue(0);
        };

        resetValues();

        switch (animationStyle) {
            case 'sparkle':
                return Animated.sequence([
                    Animated.delay(30), 
                    Animated.parallel([
                        Animated.timing(slideOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                        Animated.spring(scaleValue, { toValue: 1, tension: 180, friction: 6, useNativeDriver: true }), 
                        Animated.timing(morphValue, { toValue: 1, duration: 250, useNativeDriver: true }),
                        Animated.loop(
                            Animated.sequence([
                                Animated.timing(spinValue, { toValue: 1, duration: 600, useNativeDriver: true }), 
                                Animated.timing(spinValue, { toValue: 0, duration: 0, useNativeDriver: true }),
                            ]),
                            { iterations: 1 } 
                        ),
                    ]),
                ]);

            case 'heartbeat':
                return Animated.sequence([
                    Animated.parallel([
                        Animated.timing(slideOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
                        Animated.timing(morphValue, { toValue: 1, duration: 180, useNativeDriver: true }), 
                    ]),
                    Animated.loop(
                        Animated.sequence([
                            Animated.spring(pulseValue, { toValue: 1.3, tension: 300, friction: 2, useNativeDriver: true }), 
                            Animated.spring(pulseValue, { toValue: 1, tension: 300, friction: 2, useNativeDriver: true }),
                            Animated.delay(50), 
                        ]),
                        { iterations: 1 } 
                    ),
                    Animated.spring(scaleValue, { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }),
                ]);

            case 'explosion':
                return Animated.sequence([
                    Animated.timing(elasticScale, { toValue: 0.5, duration: 60, useNativeDriver: true }), 
                    Animated.parallel([
                        Animated.spring(elasticScale, { toValue: 1.5, tension: 120, friction: 2, useNativeDriver: true }),
                        Animated.timing(slideOpacity, { toValue: 1, duration: 100, useNativeDriver: true }), 
                        Animated.sequence([
                            Animated.timing(shakeX, { toValue: 10, duration: 20, useNativeDriver: true }),
                            Animated.timing(shakeX, { toValue: -10, duration: 20, useNativeDriver: true }),
                            Animated.timing(shakeX, { toValue: 5, duration: 20, useNativeDriver: true }),
                            Animated.timing(shakeX, { toValue: 0, duration: 20, useNativeDriver: true }),
                        ]),
                    ]),
                    Animated.spring(elasticScale, { toValue: 1, tension: 150, friction: 6, useNativeDriver: true }),
                    Animated.spring(scaleValue, { toValue: 1, tension: 130, friction: 6, useNativeDriver: true }),
                    Animated.timing(morphValue, { toValue: 1, duration: 120, useNativeDriver: true }),
                ]);

            case 'wave':
                return Animated.sequence([
                    Animated.parallel([
                        Animated.timing(slideOpacity, { toValue: 1, duration: 180, useNativeDriver: true }), 
                        Animated.timing(morphValue, { toValue: 1, duration: 200, useNativeDriver: true }), 
                        Animated.loop(
                            Animated.sequence([
                                Animated.timing(wobbleRotation, { toValue: 1, duration: 250, useNativeDriver: true }), 
                                Animated.timing(wobbleRotation, { toValue: -1, duration: 250, useNativeDriver: true }),
                                Animated.timing(wobbleRotation, { toValue: 0, duration: 120, useNativeDriver: true }), 
                            ]),
                            { iterations: 1 }
                        ),
                    ]),
                    Animated.spring(scaleValue, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
                ]);

            case 'lightbulb':
                return Animated.sequence([
                    Animated.timing(slideOpacity, { toValue: 0.3, duration: 60, useNativeDriver: true }), 
                    Animated.timing(slideOpacity, { toValue: 1, duration: 30, useNativeDriver: true }),
                    Animated.timing(slideOpacity, { toValue: 0.5, duration: 45, useNativeDriver: true }), 
                    Animated.timing(slideOpacity, { toValue: 1, duration: 30, useNativeDriver: true }), 
                    Animated.parallel([
                        Animated.spring(scaleValue, { toValue: 1, tension: 180, friction: 6, useNativeDriver: true }), 
                        Animated.timing(morphValue, { toValue: 1, duration: 180, useNativeDriver: true }), 
                        Animated.timing(bounceValue, { toValue: 1, duration: 200, useNativeDriver: true }), 
                    ]),
                ]);

            case 'rocket':
                return Animated.sequence([
                    Animated.timing(slideTransition, { toValue: -200, duration: 0, useNativeDriver: true }),
                    Animated.parallel([
                        Animated.spring(slideTransition, { toValue: 0, tension: 120, friction: 6, useNativeDriver: true }),
                        Animated.timing(slideOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                        Animated.timing(iconRotation, { toValue: 1, duration: 300, useNativeDriver: true }),
                    ]),
                    Animated.spring(scaleValue, { toValue: 1, tension: 150, friction: 6, useNativeDriver: true }), 
                    Animated.timing(morphValue, { toValue: 1, duration: 120, useNativeDriver: true }),
                ]);

            case 'twinkle':
                return Animated.sequence([
                    Animated.parallel([
                        Animated.timing(slideOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
                        Animated.spring(scaleValue, { toValue: 1, tension: 200, friction: 5, useNativeDriver: true }),
                    ]),
                    Animated.loop(
                        Animated.parallel([
                            Animated.sequence([
                                Animated.timing(pulseValue, { toValue: 1.2, duration: 200, useNativeDriver: true }),
                                Animated.timing(pulseValue, { toValue: 1, duration: 200, useNativeDriver: true }),
                            ]),
                            Animated.sequence([
                                Animated.timing(spinValue, { toValue: 1, duration: 800, useNativeDriver: true }),
                                Animated.timing(spinValue, { toValue: 0, duration: 0, useNativeDriver: true }),
                            ]),
                            Animated.sequence([
                                Animated.timing(bounceValue, { toValue: 1.1, duration: 150, useNativeDriver: true }),
                                Animated.timing(bounceValue, { toValue: 1, duration: 150, useNativeDriver: true }),
                                Animated.timing(bounceValue, { toValue: 1.05, duration: 100, useNativeDriver: true }),
                                Animated.timing(bounceValue, { toValue: 1, duration: 100, useNativeDriver: true }),
                            ]),
                        ]),
                        { iterations: 2 }
                    ),
                    Animated.timing(morphValue, { toValue: 1, duration: 180, useNativeDriver: true }),
                ]);

            default:
                return Animated.parallel([
                    Animated.timing(slideOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                    Animated.spring(scaleValue, { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }),
                    Animated.timing(morphValue, { toValue: 1, duration: 200, useNativeDriver: true }), 
                ]);
        }
    };

    const renderFloatingParticles = () => {
        const particles = [];
        const currentSlide = rewindData?.slides?.[currentSlideIndex];
        const slideType = currentSlide?.type || 'intro';
        
        // Chỉ cho particles đập với fun_fact và heartbeat
        const shouldPulse = slideType === 'fun_fact' || slideType === 'top_category';
        
        for (let i = 0; i < 6; i++) {
            const randomDelay = Math.random() * 2000;
            const randomDuration = 3000 + Math.random() * 2000;
            const randomX = Math.random() * screenWidth;
            const randomY = Math.random() * screenHeight;
            
            particles.push(
                <Animated.View
                    key={i}
                    style={[
                        styles.particle,
                        {
                            left: randomX,
                            top: randomY,
                            opacity: morphValue.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 0.8, 0.3]
                            }),
                            transform: [
                                {
                                    translateY: morphValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [50, -50]
                                    })
                                },
                                {
                                    rotate: spinValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [`${i * 60}deg`, `${i * 60 + 360}deg`]
                                    })
                                },
                                // Chỉ thêm scale cho particles khi cần thiết
                                ...(shouldPulse ? [{
                                    scale: pulseValue.interpolate({
                                        inputRange: [1, 1.3],
                                        outputRange: [0.6, 1.1]
                                    })
                                }] : [])
                            ]
                        }
                    ]}
                >
                    <Ionicons 
                        name={['star', 'heart', 'diamond', 'triangle', 'square', 'hexagon'][i % 6] as any} 
                        size={12} 
                        color="rgba(255,255,255,0.6)" 
                    />
                </Animated.View>
            );
        }
        return particles;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.loadingGradient}>
                    <Animated.View style={[
                        styles.loadingContent,
                        {
                            transform: [{
                                rotate: slideOpacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg']
                                })
                            }]
                        }
                    ]}>
                        <Ionicons name="sparkles" size={60} color="#fff" />
                    </Animated.View>
                    <Text style={styles.loadingText}>Đang tạo Wrapped của bạn...</Text>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    if (!rewindData || rewindData.slides.length === 0) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>Không có dữ liệu để hiển thị</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const currentSlide = rewindData.slides[currentSlideIndex];
    const gradientColors = getSlideGradient(currentSlide.type);
    const iconName = getSlideIcon(currentSlide.type);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}>
                <Animated.View style={styles.slideContainer}>
                    <Animated.View
                        style={[
                            { flex: 1 },
                            {
                                transform: [
                                    {
                                        scale: morphValue.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [0.95, 1.02, 1]
                                        })
                                    }
                                ]
                            }
                        ]}>
                        <LinearGradient
                            colors={gradientColors}
                            style={styles.slide}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}>
                        
                            {/* Header */}
                            <Animated.View 
                                style={[
                                    styles.header,
                                    {
                                        opacity: morphValue,
                                        transform: [
                                            {
                                                translateY: morphValue.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [-20, 0]
                                                })
                                            }
                                        ]
                                    }
                                ]}>
                                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                                    <Ionicons name="close" size={28} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Zentra Wrapped</Text>
                                <View style={styles.spacer} />
                            </Animated.View>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            {rewindData.slides.map((_, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.progressBar,
                                        {
                                            backgroundColor: index <= currentSlideIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                                            transform: [
                                                {
                                                    scaleX: index === currentSlideIndex ? 
                                                        morphValue.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0.5, 1.2]
                                                        }) : 1
                                                }
                                            ]
                                        }
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Slide Content */}
                        <Animated.View
                            style={[
                                styles.slideContent,
                                {
                                    opacity: slideOpacity,
                                    transform: [
                                        { 
                                            scale: scaleValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.5, 1]
                                            })
                                        },
                                        { 
                                            translateX: Animated.add(
                                                translateX,
                                                slideTransition
                                            )
                                        },
                                        {
                                            perspective: morphValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [800, 1000]
                                            })
                                        },
                                        {
                                            rotateY: morphValue.interpolate({
                                                inputRange: [0, 0.5, 1],
                                                outputRange: ['15deg', '0deg', '0deg']
                                            })
                                        }
                                    ]
                                }
                            ]}>
                            
                            <Animated.View 
                                style={[
                                    styles.iconContainer,
                                    {
                                        transform: [
                                            // Rotation animation
                                            {
                                                rotate: Animated.add(
                                                    iconRotation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '360deg']
                                                    }),
                                                    spinValue.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '360deg']
                                                    })
                                                )
                                            },
                                            // Scale với multiple effects
                                            {
                                                scale: Animated.multiply(
                                                    morphValue.interpolate({
                                                        inputRange: [0, 0.5, 1],
                                                        outputRange: [0.3, 0.8, 1]
                                                    }),
                                                    Animated.add(
                                                        pulseValue,
                                                        elasticScale.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0, 0.3]
                                                        })
                                                    )
                                                )
                                            },
                                            // Shake effect
                                            {
                                                translateX: Animated.add(
                                                    shakeX,
                                                    circularMotion.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 20]
                                                    })
                                                )
                                            },
                                            // Wobble effect
                                            {
                                                rotateZ: wobbleRotation.interpolate({
                                                    inputRange: [-1, 0, 1],
                                                    outputRange: ['-15deg', '0deg', '15deg']
                                                })
                                            },
                                            // Bounce effect
                                            {
                                                translateY: bounceValue.interpolate({
                                                    inputRange: [0, 0.5, 1],
                                                    outputRange: [0, -20, 0]
                                                })
                                            },
                                            // Flip effect
                                            {
                                                rotateX: flipRotation.interpolate({
                                                    inputRange: [0, 0.5, 1],
                                                    outputRange: ['0deg', '180deg', '360deg']
                                                })
                                            }
                                        ]
                                    }
                                ]}>
                                <Ionicons name={iconName as any} size={80} color="#fff" />
                            </Animated.View>

                            <Animated.Text 
                                style={[
                                    styles.slideTitle,
                                    {
                                        opacity: morphValue,
                                        transform: [
                                            {
                                                translateY: morphValue.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [30, 0]
                                                })
                                            },
                                            {
                                                scale: Animated.add(
                                                    1,
                                                    pulseValue.interpolate({
                                                        inputRange: [1, 1.3],
                                                        outputRange: [0, 0.1]
                                                    })
                                                )
                                            },
                                            {
                                                rotateZ: wobbleRotation.interpolate({
                                                    inputRange: [-1, 0, 1],
                                                    outputRange: ['-2deg', '0deg', '2deg']
                                                })
                                            }
                                        ]
                                    }
                                ]}>
                                {currentSlide.title}
                            </Animated.Text>
                            
                            <Animated.Text 
                                style={[
                                    styles.slideMessage,
                                    {
                                        opacity: morphValue.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [0, 0.5, 0.9]
                                        }),
                                        transform: [
                                            {
                                                translateY: Animated.add(
                                                    morphValue.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [20, 0]
                                                    }),
                                                    bounceValue.interpolate({
                                                        inputRange: [0, 0.5, 1],
                                                        outputRange: [0, -5, 0]
                                                    })
                                                )
                                            },
                                            {
                                                translateX: shakeX.interpolate({
                                                    inputRange: [-10, 0, 10],
                                                    outputRange: [-2, 0, 2]
                                                })
                                            }
                                        ]
                                    }
                                ]}>
                                {currentSlide.message}
                            </Animated.Text>

                            {currentSlide.data && (
                                <Animated.View 
                                    style={[
                                        styles.dataContainer,
                                        {
                                            opacity: morphValue,
                                            transform: [
                                                {
                                                    scale: morphValue.interpolate({
                                                        inputRange: [0, 0.7, 1],
                                                        outputRange: [0.5, 0.9, 1]
                                                    })
                                                },
                                                {
                                                    translateY: morphValue.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [40, 0]
                                                    })
                                                }
                                            ]
                                        }
                                    ]}>
                                    {currentSlide.data.category && (
                                        <Text style={styles.dataCategory}>
                                            📊 {currentSlide.data.category}
                                        </Text>
                                    )}
                                    {currentSlide.data.amount && (
                                        <Text style={styles.dataAmount}>
                                            💰 {formatAmount(currentSlide.data.amount)}
                                        </Text>
                                    )}
                                </Animated.View>
                            )}
                        </Animated.View>

                        {/* Floating Particles */}
                        {renderFloatingParticles()}

                        {/* Invisible tap areas for navigation */}
                        <TouchableOpacity
                            style={styles.leftTapArea}
                            onPress={prevSlide}
                            activeOpacity={1}
                        />
                        <TouchableOpacity
                            style={styles.rightTapArea}
                            onPress={nextSlide}
                            activeOpacity={1}
                        />
                        </LinearGradient>
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
    },
    loadingGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        marginBottom: 20,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    slideContainer: {
        flex: 1,
    },
    slide: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    spacer: {
        width: 44,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    progressBar: {
        height: 3,
        flex: 1,
        borderRadius: 2,
        maxWidth: 40,
    },
    slideContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 30,
    },
    slideTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 34,
    },
    slideMessage: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 26,
        opacity: 0.9,
        marginBottom: 30,
    },
    dataContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        minWidth: 200,
    },
    dataCategory: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    dataAmount: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
    },
    leftTapArea: {
        position: 'absolute',
        left: 0,
        top: 100,
        bottom: 100,
        width: '40%',
        backgroundColor: 'transparent',
    },
    rightTapArea: {
        position: 'absolute',
        right: 0,
        top: 100,
        bottom: 100,
        width: '40%',
        backgroundColor: 'transparent',
    },
    particle: {
        position: 'absolute',
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});