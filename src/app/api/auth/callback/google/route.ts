
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URI
  ) {
    return NextResponse.json(
      { error: 'Google credentials are not set in the environment variables.' },
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
    
    // In a real app, you would encrypt and store these tokens securely,
    // likely associated with the logged-in user's ID in your database.
    // For this demo, we'll store them in a secure, HTTP-only cookie.
    if (tokens.access_token) {
        cookies().set('google_access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: tokens.expiry_date ? (tokens.expiry_date - Date.now()) / 1000 : 3600,
        });
    }
     if (tokens.refresh_token) {
        cookies().set('google_refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });
    }


    // Redirect user back to the submit page with a success indicator
    return NextResponse.redirect(new URL('/submit-paper?authed=true', req.nextUrl.origin));

  } catch (error) {
    console.error('Error exchanging authorization code for tokens', error);
    return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 500 });
  }
}
