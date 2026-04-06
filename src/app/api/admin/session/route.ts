import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for admin sessions (in production, use Redis or a database)
const adminSessions = new Map<string, { expiresAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const { action, token } = await request.json();

    if (action === 'validate') {
      // Check if token exists and hasn't expired
      const session = adminSessions.get(token);
      if (session && session.expiresAt > Date.now()) {
        return NextResponse.json({ valid: true });
      }
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    if (action === 'store') {
      // Store the token with expiration
      adminSessions.set(token, {
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'logout') {
      adminSessions.delete(token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Session management error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
