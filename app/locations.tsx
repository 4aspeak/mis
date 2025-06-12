import {useEffect, useState, useCallback, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Button, FlatList, Pressable} from 'react-native';
import {useRouter, useFocusEffect, useNavigation} from 'expo-router';
import { initDatabase } from '@/hooks/useDatabase';
import { getLocationsFromDb, deleteLocationFromDb } from '@/hooks/useDatabase';
import {Ionicons} from "@expo/vector-icons";

export default function HomeScreen() {
    const router = useRouter();
    const [locations, setLocations] = useState<{ id: number; name: string; lat: number; lon: number; country: string; state: string }[]>([]);
    const navigation = useNavigation();

    // 👆 Кнопка в хедере
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => router.push('/add-location')} style={{ marginRight: 15 }}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                </Pressable>
            ),
        });
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            const loadLocations = async () => {
                const locationsFromDb = await getLocationsFromDb();
                setLocations(locationsFromDb);
            };

            loadLocations();
        }, [])
    );


    const renderLocation = ({ item }: { item: { id: number; name: string; lat: number; lon: number; country: string; state: string } }) => (
        <View style={styles.locationItem}>
            <Pressable
                onPress={async () => {
                    await deleteLocationFromDb(item.id);
                    const updated = await getLocationsFromDb();
                    setLocations(updated);
                }}
                style={styles.deleteIcon}
            >
                <Ionicons name="trash-bin" size={20} color="#ff4d4f" />
            </Pressable>

            <Pressable
                onPress={() =>
                    router.push({
                        pathname: '/weather',
                        params: {
                            name: item.name,
                            lat: item.lat.toString(),
                            lon: item.lon.toString(),
                        },
                    })
                }
            >
                <Text style={styles.locationText}>{item.name}</Text>
                <Text style={styles.meta}>🌍 {item.country}, {item.state}</Text>
                <Text style={styles.coords}>📍 {item.lat.toFixed(2)}, {item.lon.toFixed(2)}</Text>
            </Pressable>
        </View>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>GeoWeather 🌦️</Text>

            {locations.length > 0 ? (
                <FlatList
                    data={locations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderLocation}
                    style={styles.list}
                />
            ) : (
                <Text>Нет добавленных локаций</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    list: {
        width: '100%',
        marginTop: 20,
    },
    locationItem: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: 'white',
        position: 'relative',
    },
    locationText: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    meta: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    coords: {
        fontSize: 13,
        color: '#999',
    },
    deleteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        padding: 4,
    },

});
