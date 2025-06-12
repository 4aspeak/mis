export const sendTelegramWeather = async (weather: any) => {
    const BOT_TOKEN = '7539303301:AAFsu3OsU5_zgEHnCOyg75F8zRHmvNjAocg';
    const CHAT_ID = '@geoweatheropen'; // chat.id канала

    const city = weather.name;
    const temp = Math.round(weather.main.temp);
    const description = weather.weather[0].description;
    const wind = weather.wind.speed;
    const humidity = weather.main.humidity;

    const message = `🌤 *Погода в ${city}*\n
🌡 Температура: ${temp}°C
📝 Описание: ${description}
💨 Ветер: ${wind} м/с
💧 Влажность: ${humidity}%`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const payload = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!data.ok) {
            console.error('Ошибка Telegram:', data);
        }
    } catch (err) {
        console.error('Ошибка отправки в Telegram:', err);
    }
};
