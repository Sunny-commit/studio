
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
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

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Generate the url that will be used for the consent dialog.
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'offline' gets a refresh token
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });

  return NextResponse.redirect(authUrl);
}
