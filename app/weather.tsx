import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Image, Vibration, Animated } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { getSettingsFromDb } from '@/hooks/useDatabase';
import { Accelerometer } from 'expo-sensors';
import { LanguageKey, translations } from "@/constants";
import { sendTelegramWeather } from '@/hooks/sendTelegramWeather';

const API_KEY = '188ff43a2ad6e5dee3aac42f78005e38';
const SHAKE_THRESHOLD = 1.5;
const SHAKE_TIMEOUT = 1000;

const [shakeAnim] = useState(new Animated.Value(0));


export default function WeatherScreen() {
    const { name, lat, lon } = useLocalSearchParams();
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<LanguageKey>('en');
    const [lastUpdate, setLastUpdate] = useState(0);

    const fetchWeather = useCallback(async () => {
        if (!lat || !lon) return;

        try {
            setLoading(true);
            const settings = await getSettingsFromDb();
            const units = settings?.units;
            const language = settings?.language as LanguageKey || 'en';
            setLang(language);

            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${language}`
            );
            const data = await res.json();
            setWeather(data);
            await sendTelegramWeather(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [lat, lon]);

    const startShakeAnimation = () => {
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    };

    const handleShake = (accelerometerData: {x: number; y: number; z: number}) => {
        const {x, y, z} = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);

        const now = Date.now();
        if (acceleration > SHAKE_THRESHOLD && now - lastUpdate > SHAKE_TIMEOUT) {
            Vibration.vibrate(50);
            setLastUpdate(now);
            startShakeAnimation();
            fetchWeather();
        }
    };

    useEffect(() => {
        Accelerometer.setUpdateInterval(400);
        const subscription = Accelerometer.addListener(handleShake);
        return () => subscription.remove();
    }, []);

    // Обновляем данные при каждом открытии экрана
    useFocusEffect(
        useCallback(() => {
            fetchWeather();
        }, [fetchWeather])
    );

    if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007AFF" />;

    if (!weather || weather.cod !== 200) {
        return <Text style={{ marginTop: 50, textAlign: 'center', color: 'red' }}>Ошибка загрузки погоды</Text>;
    }

    const t = translations[lang];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Погода в {name}</Text>
            <Animated.View style={[
                styles.card,
                { transform: [{ translateX: shakeAnim }] }
            ]}>
                <Image
                    source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }}
                    style={styles.weatherIcon}
                />
                <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
                <Text style={styles.desc}>
                    {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
                </Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>💨 {t.wind}:</Text>
                    <Text style={styles.infoValue}>
                        {weather.wind.speed} {t.units.wind}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>💧 {t.humidity}:</Text>
                    <Text style={styles.infoValue}>
                        {weather.main.humidity} {t.units.humidity}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>🌡️ {t.pressure}:</Text>
                    <Text style={styles.infoValue}>
                        {weather.main.pressure} {t.units.pressure}
                    </Text>
                </View>

                <Text style={styles.shakeHint}>
                    {t.shakeHint}
                </Text>
            </Animated.View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    shakeHint: {
        marginTop: 20,
        color: '#666',
        fontStyle: 'italic',
        fontSize: 14,
    },
    container: {
        padding: 20,
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#d0e8f2',
        padding: 24,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        transform: [
            { translateX: shakeAnim }
        ]
    },
    icon: {
        fontSize: 48,
    },
    temp: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    desc: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#555',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    infoLabel: {
        fontWeight: '600',
    },
    infoValue: {
        fontWeight: '400',
    },
    weatherIcon: {
        width: 100,
        height: 100,
    },
});
