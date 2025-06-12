// app/_layout.tsx
import { StatusBar } from 'expo-status-bar';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePushNotifications } from '../hooks/usePushNotifications';


export default function Layout() {
    usePushNotifications();  // Добавили вызов хука здесь

    return (
        <>
            <StatusBar style="dark" />
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Текущее место',
                        tabBarIcon: ({ color, size }) => <Ionicons name="cloud-outline" color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="locations"
                    options={{
                        title: 'Локации',
                        tabBarIcon: ({ color, size }) => <Ionicons name="cloud-outline" color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Настройки',
                        tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="add-location"
                    options={{
                        title: "Добавлние локации",
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="weather"
                    options={{
                        title: "Погода",
                        href: null,
                    }}
                />
            </Tabs>
        </>
    );
}
