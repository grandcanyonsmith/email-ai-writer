import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Clear any server-side session if needed
  // For now, we'll just redirect to login since we're using localStorage for auth
  
  const response = NextResponse.redirect(new URL('/login', request.url));
  
  // Clear any cookies if they exist
  response.cookies.delete('token');
  response.cookies.delete('user');
  
  return response;
}

export async function GET(request: NextRequest) {
  // Handle GET requests to logout as well
  return POST(request);
} 