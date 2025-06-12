import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        Alert.alert('Push уведомления работают только на реальном устройстве');
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        Alert.alert('Разрешение на уведомления не получено!');
        return;
    }

    // Запланируем новое уведомление на каждый день в 9:00
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Проверь погоду!',
            body: 'Зайди в приложение и проверь температуру 🌤️',
            sound: 'default',
        },
        trigger: {
            hour: 17,
            minute: 7,
            repeats: true,
        },

    });



    console.log('Уведомление запланировано на каждый день в 17:07');
}

export async function scheduleOneMinuteNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Проверь погоду!',
            body: 'Прошла минута — проверь погоду 🌥️',
            sound: 'default',
        },
        trigger: {
            seconds: 30,
            repeats: false,
        },
    });

    console.log('Уведомление запланировано после 30 секунд открытия приложения');

}

export const usePushNotifications = () => {
    useEffect(() => {
        scheduleOneMinuteNotification(); // <-- вот он
    }, []);
};
