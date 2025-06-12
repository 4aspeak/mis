import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    Button,
    SafeAreaView,
    SectionList
} from 'react-native';
import { getSettingsFromDb, updateSettingsInDb } from '@/hooks/useDatabase';

// Опции единиц измерения
const unitsOptions = [
    { code: 'standard', label: "Kelvin" },
    { code: 'metric', label: "Celsius" },
    { code: 'imperial', label: "Fahrenheit" },
];

// Опции языков
const languagesOptions = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Russian' },
    { code: 'es', label: 'Spanish' },
    { code: 'de', label: 'Germany'}
];

export default function SettingsScreen() {
    const [language, setLanguage] = useState('');
    const [units, setUnits] = useState('');

    const [unitModalVisible, setUnitModalVisible] = useState(false);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);

    // Загрузка настроек из базы данных
    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getSettingsFromDb();
            if (settings) {
                setLanguage(settings.language);
                setUnits(settings.units);
            }
        };
        loadSettings();
    }, []);

    // Сохранение настроек в базу данных
    const handleSave = async () => {
        await updateSettingsInDb(units, language);
        alert('Настройки сохранены!');
    };

    return (
        <View style={styles.container}>
            {/* Блок выбора единиц измерения */}
            <Text style={styles.label}>Выбор единиц измерения:</Text>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setUnitModalVisible(true)}
            >
                <Text>{units ? unitsOptions.find(u => u.code === units)?.label : 'Выберите единицы'}</Text>
            </TouchableOpacity>

            {/* Блок выбора языка */}
            <Text style={styles.label}>Выбор языка:</Text>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setLanguageModalVisible(true)}
            >
                <Text>{language ? languagesOptions.find(l => l.code === language)?.label : 'Выберите язык'}</Text>
            </TouchableOpacity>

            {/* Кнопка сохранения */}
            <Button title="Сохранить настройки" onPress={handleSave} />

            {/* Модальное окно выбора единиц измерения */}
            <Modal visible={unitModalVisible} animationType="slide">
                <SafeAreaView style={styles.modalContainer}>
                    <FlatList
                        data={unitsOptions}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setUnits(item.code);
                                    setUnitModalVisible(false);
                                }}
                                style={styles.option}
                            >
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </SafeAreaView>
            </Modal>

            {/* Модальное окно выбора языка */}
            <Modal visible={languageModalVisible} animationType="slide">
                <SafeAreaView style={styles.modalContainer}>
                    <FlatList
                        data={languagesOptions}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setLanguage(item.code);
                                    setLanguageModalVisible(false);
                                }}
                                style={styles.option}
                            >
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginTop: 20,
    },
    selector: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        paddingTop: 20, // Отступ для статус-бара
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});