
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const redirectUri = state ? decodeURIComponent(state) : '/dashboard';


  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URI
  ) {
    console.error('Google credentials are not set in the environment variables.');
    return NextResponse.json(
      { error: 'Google credentials are not set.' },
      { status: 500 }
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    if (tokens.id_token) {
      const decoded: { name: string; email: string; picture: string } = jwtDecode(tokens.id_token);
      const user = { name: decoded.name, email: decoded.email, picture: decoded.picture };
      cookies().set('user_session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
    }

    if (tokens.access_token) {
        cookies().set('google_access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: tokens.expiry_date ? (tokens.expiry_date - Date.now()) / 1000 : 3600,
            path: '/',
        });
    }
     if (tokens.refresh_token) {
        cookies().set('google_refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });
    }

    const finalRedirectUrl = new URL(redirectUri, req.nextUrl.origin);
    // Add a query param to indicate successful authentication for the toast message
    if (redirectUri.includes('submit-paper')) {
        finalRedirectUrl.searchParams.set('authed', 'true');
    }

    return NextResponse.redirect(finalRedirectUrl);

  } catch (error) {
    console.error('Error exchanging authorization code for tokens', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', req.nextUrl.origin));
  }
}

    
