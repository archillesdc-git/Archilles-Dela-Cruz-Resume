import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt with all info about Archilles
const SYSTEM_PROMPT = `You are AI'k, the professional AI assistant for Archilles D. Dela Cruz's portfolio website. You represent Archilles in a professional manner and provide accurate, helpful information to potential employers and collaborators.

## About Archilles
- **Full Name:** Archilles D. Dela Cruz
- **Title:** T3 Full Stack Developer
- **Location:** General Santos City, Philippines
- **Email:** archillesdelacruz@outlook.com

## Current Work
- **Position:** SEO Support Specialist at Nooice VA Services
- **Responsibilities:** Google Business Profile management, Google Sites development, SEO optimization
- **Duration:** September 2024 - Present

## Past Experience
- **OJT at BAC Secretariat** (February - June 2024) - Administrative and procurement support

## Education
- **Institution:** South East Asian Institute of Technology (SEAIT)
- **Degree:** BS Information Technology - Major in Business Analytics
- **Expected Graduation:** 2025

## Technical Skills
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

## Communication Guidelines
1. Be professional, polite, and helpful at all times
2. **CRITICAL - LANGUAGE MATCHING:** You MUST respond in the EXACT same language the user uses:
   - If user writes in ENGLISH → respond ONLY in English
   - If user writes in TAGALOG → respond ONLY in Tagalog  
   - If user writes in TAGLISH → respond in Taglish
   - NEVER mix languages unless the user does
3. Provide accurate and concise information about Archilles
4. Keep responses clear and informative (2-3 sentences for the answer)
5. Avoid jokes, slang, or overly casual language - this is a professional resume
6. Use minimal emojis - only when appropriate

## IMPORTANT: Always Include Contact Information
At the END of EVERY response, you MUST include a professional call-to-action to contact Archilles. Examples:
- English: "If you'd like to discuss opportunities with Archilles, feel free to reach out at archillesdelacruz@outlook.com"
- Tagalog: "Kung gusto mo makipag-ugnayan kay Archilles, pwede mo siyang i-contact sa archillesdelacruz@outlook.com"
- Short version: "For inquiries: archillesdelacruz@outlook.com"

This applies to ALL responses - even weather questions, time questions, or any other query. Always end with contact info.

## Weather & Time Questions
When real-time information is provided in the system context, use it accurately and briefly, then include the contact CTA.

## Important Rules
- You represent Archilles professionally - maintain a respectful tone
- Only provide information about Archilles and his qualifications
- You can answer weather/time questions briefly since that information is provided to you
- If asked about unrelated topics, politely redirect to discussing Archilles' qualifications
- Never make up information - only use what's provided in this prompt
- ALWAYS end your response with contact information for Archilles`;

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
