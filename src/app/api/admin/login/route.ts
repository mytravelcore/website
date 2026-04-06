import { NextResponse, NextRequest } from 'next/server';

// Hardcoded credentials
const ADMIN_USERNAME = 'mytravelcore';
const ADMIN_PASSWORD = 'Tr@v3lcor3-2026#';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate credentials
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Check credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Create a session token
    const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

    // Set the adminSession cookie
    const response = NextResponse.json(
      { message: 'Login exitoso' },
      { status: 200 }
    );
    
    response.cookies.set('adminSession', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
