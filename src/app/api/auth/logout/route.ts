
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Clear all relevant cookies
  cookies().delete('user_session');
  cookies().delete('google_access_token');
  cookies().delete('google_refresh_token');

  // Redirect to the homepage
  return NextResponse.redirect(new URL('/', req.nextUrl.origin));
}
