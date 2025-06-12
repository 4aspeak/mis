export const translations = {
    en: {
        humidity: 'Humidity',
        wind: 'Wind',
        pressure: 'Pressure',
        shakeHint: 'Shake to refresh', // Добавлено
        units: {
            wind: 'm/s',
            humidity: '%',
            pressure: 'hPa',
        },
    },
    ru: {
        humidity: 'Влажность',
        wind: 'Ветер',
        pressure: 'Давление',
        shakeHint: 'Встряхните телефон для обновления', // Добавлено
        units: {
            wind: 'м/с',
            humidity: '%',
            pressure: 'гПа',
        },
    },
    es: {
        humidity: 'Humedad',
        wind: 'Viento',
        pressure: 'Presión',
        shakeHint: 'Agita el teléfono para actualizar', // Добавлено
        units: {
            wind: 'm/s',
            humidity: '%',
            pressure: 'hPa',
        },
    },
    de: {
        humidity: 'Luftfeuchtigkeit',
        wind: 'Wind',
        pressure: 'Druck',
        shakeHint: 'Schütteln zum Aktualisieren', // Добавлено
        units: {
            wind: 'm/s',
            humidity: '%',
            pressure: 'hPa',
        },
    },
} as const;

export type LanguageKey = keyof typeof translations;