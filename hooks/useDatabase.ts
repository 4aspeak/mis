import {openDatabaseSync, SQLiteDatabase} from 'expo-sqlite';

let db: SQLiteDatabase | null = null;

export const initDatabase = async () => {
    db = openDatabaseSync('geoweather.db');

    try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            country TEXT NOT NULL,
            state TEXT
          );
         
          CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            units TEXT NOT NULL,
            language TEXT NOT NULL
          );
        `);

        const existing = await db.getFirstAsync<{ id: number }>('SELECT id FROM settings LIMIT 1');
        if (!existing) {
            await db.runAsync(
                'INSERT INTO settings (units, language) VALUES (?, ?)',
                'metric', 'ru'
            );
            console.log('Inserted default settings');
        }

        console.log('SQLite DB initialized');
    } catch (error) {
        console.error('SQLite DB init error:', error);
    }
};

// Тип для строки из таблицы locations
interface Location {
    id: number;
    name: string;
    lat: number;
    lon: number;
    country: string;
    state: string;
}

// Функция для добавления локации в базу данных
export const addLocationToDb = async (name: string, lat: number, lon: number, country: string, state: string) => {
    if (!db) {
        console.error('Database not initialized');
        return;
    }

    try {
        // Использование withTransactionAsync для транзакции
        await db.runAsync('INSERT INTO locations (name, lat, lon, country, state) VALUES (?, ?, ?, ?, ?)', name, lat, lon, country, state);
        console.log('Adding locations to db');
    } catch (error) {
        console.error('Error adding location in transaction:', error);
    }
};

// Функция для получения всех локаций из базы данных
export const getLocationsFromDb = async (): Promise<Location[]> => {
    if (!db) {
        console.error('Database not initialized');
        return [];
    }

    try {
        return await db.getAllAsync('SELECT * FROM locations') as Location[];
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
};


// Функция для удаления локации из базы данных
export const deleteLocationFromDb = async (id: number): Promise<void> => {
    if (!db) {
        console.error('Database not initialized');
        return;
    }

    try {
        console.log('Delete location from db');
        return await db.execAsync(`DELETE FROM locations WHERE id=${id}`);
    } catch (error) {
        console.error('Error deleting locations from db:', error);
    }
}


// Тип для строки из таблицы settings
interface Settings {
    id: number;
    units: string;
    language: string;
}

// Получить текущие настройки (предполагаем, что строка всегда одна)
export const getSettingsFromDb = async (): Promise<Settings | null> => {
    if (!db) {
        console.error('Database not initialized');
        return null;
    }

    try {
        return await db.getFirstAsync('SELECT * FROM settings') as Settings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
};

// Обновить или вставить настройки (если записи нет — вставим новую)
export const updateSettingsInDb = async (units: string, language: string): Promise<void> => {
    if (!db) {
        console.error('Database not initialized');
        return;
    }

    try {
        const existing = await db.getFirstAsync('SELECT id FROM settings') as Settings;

        if (existing) {
            await db.runAsync('UPDATE settings SET units = ?, language = ? WHERE id = ?', units, language, existing.id);
        }
        console.log('Settings updated');
    } catch (error) {
        console.error('Error updating settings:', error);
    }
};
