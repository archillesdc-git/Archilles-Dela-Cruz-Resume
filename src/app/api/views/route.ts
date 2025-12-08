import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis - will use env vars UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const VIEWS_KEY = 'portfolio:views';
const IPS_KEY = 'portfolio:ips';

// GET - Get total views (only for admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isOwner = searchParams.get('owner') === 'archilles';

        if (!isOwner) {
            return NextResponse.json({ views: null, message: 'Unauthorized' }, { status: 403 });
        }

        const views = await redis.get<number>(VIEWS_KEY) || 0;
        return NextResponse.json({ views });
    } catch (error) {
        console.error('Redis GET error:', error);
        // Fallback for when Redis is not configured
        return NextResponse.json({ views: 0, fallback: true });
    }
}

// POST - Track a new view (based on IP)
export async function POST(request: NextRequest) {
    try {
        // Get visitor IP from headers
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

        // Check if this IP has already been counted
        const hasVisited = await redis.sismember(IPS_KEY, ip);

        if (!hasVisited) {
            // New visitor - add IP to set and increment views
            await redis.sadd(IPS_KEY, ip);
            const newViews = await redis.incr(VIEWS_KEY);
            return NextResponse.json({ success: true, isNewVisitor: true, views: newViews });
        }

        // Returning visitor
        const currentViews = await redis.get<number>(VIEWS_KEY) || 0;
        return NextResponse.json({ success: true, isNewVisitor: false, views: currentViews });
    } catch (error) {
        console.error('Redis POST error:', error);
        // Fallback for when Redis is not configured
        return NextResponse.json({ success: false, fallback: true, views: 0 });
    }
}
