import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = 'General Santos City';
const COUNTRY = 'PH';

export async function GET() {
    try {
        console.log('OPENWEATHER_API_KEY exists:', !!OPENWEATHER_API_KEY);

        if (!OPENWEATHER_API_KEY) {
            console.log('No OpenWeather API key found');
            return NextResponse.json({
                weather: 'nice',
                description: 'good vibes',
                temp: 28,
                icon: '☀️',
                fallback: true
            });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)},${COUNTRY}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        console.log('Fetching weather from:', url.replace(OPENWEATHER_API_KEY, '***'));

        const response = await fetch(url);
        console.log('Weather API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Weather API error:', errorText);
            throw new Error('Weather API failed');
        }

        const data = await response.json();

        // Map weather conditions to emojis
        const weatherIcons: { [key: string]: string } = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Fog': '🌫️',
            'Haze': '🌫️',
        };

        const mainWeather = data.weather[0]?.main || 'Clear';
        const description = data.weather[0]?.description || 'clear sky';
        const temp = Math.round(data.main?.temp || 28);
        const icon = weatherIcons[mainWeather] || '🌤️';

        return NextResponse.json({
            weather: mainWeather.toLowerCase(),
            description: description,
            temp: temp,
            icon: icon,
            city: CITY,
            fallback: false
        });
    } catch (error) {
        console.error('Weather API Error:', error);
        // Return fallback weather
        return NextResponse.json({
            weather: 'nice',
            description: 'good vibes',
            temp: 28,
            icon: '🌤️',
            city: CITY,
            fallback: true
        });
    }
}
