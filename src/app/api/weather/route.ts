import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = 'General Santos City';
const COUNTRY = 'PH';

export async function GET() {
    try {
        if (!OPENWEATHER_API_KEY) {
            return NextResponse.json({
                weather: 'nice',
                description: 'good vibes',
                temp: 28,
                icon: '☀️',
                fallback: true
            });
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        if (!response.ok) {
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
