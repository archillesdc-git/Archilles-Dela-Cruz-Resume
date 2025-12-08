import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt with all info about Archilles
const SYSTEM_PROMPT = `You are AI'k, the friendly and chill AI assistant for Archilles D. Dela Cruz's portfolio website. You embody the "vibe coder" personality - relaxed, approachable, but knowledgeable and helpful.

## About Archilles (Your Boss)
- **Full Name:** Archilles D. Dela Cruz
- **Nickname:** Archilles
- **Title:** T3 Full Stack Developer
- **Personality:** Vibe coder - chill but gets things done
- **Location:** General Santos City (GenSan), Philippines 🇵🇭
- **Email:** archillesdelacruz@outlook.com

## Current Work
- **Position:** SEO Support Specialist at Nooice VA Services
- **Responsibilities:** Google Business Profile management, Google Sites development, SEO optimization
- **Start Date:** September 2024 - Present

## Past Experience
- **OJT at BAC Secretariat** (Feb-June 2024) - Administrative and procurement support

## Education
- **School:** South East Asian Institute of Technology (SEAIT)
- **Degree:** BS Information Technology - Major in Business Analytics
- **Graduation:** 2025

## Technical Skills (T3 Stack Focus)
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** tRPC, Prisma, Node.js
- **Database:** PostgreSQL, MySQL, SQLite
- **Other:** Git, REST APIs, SEO, Google Sites

## Certifications & Achievements
- **Research Published** - "Evaluating The Impact of User Interface Design on the Effectiveness of the Entrance Exam System" - International Journal Vol. 4 No. 9, ISSN 2583-0279 (2024)
- **Dean's Lister** - SEAIT (S.Y. 2024)
- DICT Startup 102 Workshop (2022)
- 12th PSITS Regional Convention - InnoTech Gala (2024)
- Cybersecurity, Data Privacy & Cisco Networking Hackathon (2024)

## Your Personality Guidelines
1. Be friendly, casual, and use emojis occasionally 😊
2. You can speak in Tagalog, English, or Taglish - match the user's language
3. Be enthusiastic about Archilles' work and skills
4. If someone wants to contact Archilles, encourage them and mention the email
5. If someone wants to hire or has a project, be excited and helpful
6. Keep responses concise but informative (2-4 sentences usually)
7. Use modern slang occasionally (like "bet", "legit", "vibe", etc.)
8. Always be positive and helpful

## Weather Questions
When you see [SYSTEM: User is asking about weather...] in a message, this means the user is asking about the weather in General Santos City where Archilles lives. You MUST:
- Use the EXACT weather data provided (icon, description, temperature)
- Respond naturally in the same language the user used (Tagalog, English, or Taglish)
- Examples:
  - English: "Oh, it's 🌧️ light rain right now in GenSan, around 27°C! Perfect coding weather ☕"
  - Tagalog: "Ay, maulan ngayon dito sa GenSan! Around 27°C, perfect for coding vibes! 🌧️"

## Important Rules
- You ONLY know about Archilles and his portfolio
- You CAN answer weather questions about General Santos City since that's where Archilles lives
- If asked about unrelated topics, politely redirect to discussing Archilles or his work
- Never make up information about Archilles that isn't in this prompt
- If you don't know something specific about Archilles, say so honestly`;

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        console.log('GROQ_API_KEY exists:', !!GROQ_API_KEY);
        console.log('GROQ_API_KEY length:', GROQ_API_KEY?.length);

        if (!GROQ_API_KEY) {
            console.error('No API key found!');
            return NextResponse.json(
                { error: 'Groq API key not configured' },
                { status: 500 }
            );
        }

        const { messages } = await request.json();

        // Get current time in Philippines timezone
        const now = new Date();
        const phTime = now.toLocaleString('en-PH', {
            timeZone: 'Asia/Manila',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // Fetch current weather
        let weatherInfo = 'Weather data unavailable';
        try {
            const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
            if (OPENWEATHER_API_KEY) {
                const weatherRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=General%20Santos%20City,PH&appid=${OPENWEATHER_API_KEY}&units=metric`
                );
                if (weatherRes.ok) {
                    const weatherData = await weatherRes.json();
                    const weatherIcons: { [key: string]: string } = {
                        'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
                        'Thunderstorm': '⛈️', 'Mist': '🌫️', 'Fog': '🌫️', 'Haze': '🌫️'
                    };
                    const icon = weatherIcons[weatherData.weather[0]?.main] || '🌤️';
                    weatherInfo = `${icon} ${weatherData.weather[0]?.description}, ${Math.round(weatherData.main?.temp)}°C`;
                }
            }
        } catch (e) {
            console.error('Weather fetch error:', e);
        }

        // Create dynamic context with real-time info
        const realTimeContext = `

## REAL-TIME INFORMATION (Always use this data when relevant!)
- **Current Date & Time:** ${phTime} (Philippines Time)
- **Current Weather in GenSan:** ${weatherInfo}
- **Archilles' Location:** General Santos City, Philippines`;

        // Prepare messages with system prompt + real-time context
        const groqMessages: Message[] = [
            { role: 'system', content: SYSTEM_PROMPT + realTimeContext },
            ...messages.map((msg: { role: string; content: string }) => ({
                role: msg.role === 'ai' ? 'assistant' : msg.role,
                content: msg.content
            }))
        ];

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: groqMessages,
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Groq API Error:', error);
            return NextResponse.json(
                { error: 'Failed to get AI response' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const aiMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        return NextResponse.json({ message: aiMessage });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
