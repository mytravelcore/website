import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logout exitoso' },
    { status: 200 }
  );

  // Clear the admin session cookie
  response.cookies.set('adminSession', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
  });

  return response;
}
