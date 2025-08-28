
// This file uses server-side code.
'use server';

import { google } from 'googleapis';
import { Readable } from 'stream';
import { cookies } from 'next/headers';
import type { drive_v3 } from 'googleapis';

async function getAuthenticatedClient() {
  const accessToken = cookies().get('google_access_token')?.value;
  const refreshToken = cookies().get('google_refresh_token')?.value;

  if (!accessToken || !refreshToken) {
    console.warn("Google Drive tokens not found in cookies. User needs to authenticate.");
    return null;
  }
  
  if (
    !process.env.GOOGLE_CLIENT_ID || 
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URI
    ) {
      console.error("Google Drive credentials are not set in .env file.");
      throw new Error("Server is not configured for Google Drive integration.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  oauth2Client.on('tokens', (tokens) => {
    if (tokens.access_token) {
       cookies().set('google_access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: tokens.expiry_date ? (tokens.expiry_date - Date.now()) / 1000 : 3600,
        });
    }
  });

  return oauth2Client;
}


/**
 * Uploads a file to Google Drive.
 * @param file The file to upload.
 * @returns The web link to view the file.
 */
export async function uploadFile(file: File): Promise<string> {
  console.log(`[Drive Service] Attempting to upload file: ${file.name}`);
  const auth = await getAuthenticatedClient();

  if (!auth) {
    throw new Error('User is not authenticated. Please connect to Google Drive first.');
  }
  
  try {
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata: drive_v3.Params$Resource$Files$Create['requestBody'] = {
      name: file.name,
      // You can specify a folder to upload to by its ID.
      // parents: ['YOUR_FOLDER_ID']
    };
    
    const media: drive_v3.Params$Resource$Files$Create['media'] = {
      mimeType: file.type,
      body: Readable.from(Buffer.from(await file.arrayBuffer())),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink', 
    });

    const fileId = response.data.id;
    if (!fileId || !response.data.webViewLink) {
        throw new Error('File upload succeeded but no ID or view link was returned.');
    }
    
    // Make the file publicly readable to anyone with the link
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    console.log(`[Drive Service] Successfully uploaded file. View link: ${response.data.webViewLink}`);
    // Returning the webViewLink is generally safer and more flexible than a direct download link.
    return response.data.webViewLink;

  } catch (error: any) {
    console.error('Failed to upload file to Google Drive.', error.message);
    throw new Error('Failed to upload to Google Drive. Please ensure you are authenticated and have permissions.');
  }
}
