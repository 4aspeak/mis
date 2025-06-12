import { useState, useEffect } from 'react';
import {
    View, Text, TextInput, ActivityIndicator,
    FlatList, TouchableOpacity, Alert, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { addLocationToDb } from '@/hooks/useDatabase';

const API_KEY = '188ff43a2ad6e5dee3aac42f78005e38';

export default function AddLocation() {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (city.length < 3) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=8&appid=${API_KEY}`
                );
                const data = await response.json();
                setSuggestions(data);
            } catch (e) {
                console.error(e);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [city]);

    const handleSelect = async (item: any) => {
        setLoading(true);
        try {
            const { name, lat, lon, country, state } = item;
            await addLocationToDb(name, lat, lon, country, state);
            Alert.alert('✅ Успех', `Город ${name} добавлен`);
            router.push({
                pathname: '/weather',
                params: {
                    name: item.name,
                    lat: item.lat.toString(),
                    lon: item.lon.toString(),
                },
            });
        } catch (e) {
            Alert.alert('❌ Ошибка', 'Не удалось добавить город');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>🏙️ Введите название города:</Text>
            <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Например: Казань"
                placeholderTextColor="#999"
            />

            {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007AFF" />}

            {!loading && suggestions.length > 0 && (
                <FlatList
                    style={{ marginTop: 16 }}
                    data={suggestions}
                    keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => handleSelect(item)}
                        >
                            <Text style={styles.cityName}>{item.name}</Text>
                            <Text style={styles.meta}>🌍 {item.country}{item.state ? `, ${item.state}` : ''}</Text>
                            <Text style={styles.coords}>📍 {item.lat.toFixed(2)}, {item.lon.toFixed(2)}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#f9fbfd',
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    suggestionItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    cityName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    meta: {
        fontSize: 14,
        color: '#555',
    },
    coords: {
        fontSize: 13,
        color: '#888',
        marginTop: 4,
    },
});
