// This file uses server-side code.
'use server';

import { google } from 'googleapis';
import { Readable } from 'stream';

/**
 * NOTE: This service is a placeholder for a real Google Drive integration.
 * It requires you to set up OAuth 2.0 credentials in your Google Cloud Console
 * and add them to your .env file. The full user authentication flow is NOT
 * implemented here and needs to be added.
 */

async function getAuthenticatedClient() {
  // This is a placeholder. In a real app, you would implement the full OAuth 2.0 flow
  // to get the user's consent and an access token.
  // For server-to-server interaction (e.g., uploading to a single service account drive),
  // you would use a service account key file.
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn("Google Drive credentials are not set in .env file. Using placeholder logic.");
      return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI // e.g., http://localhost:9002/api/auth/callback/google
  );
  
  // In a real flow, you would redirect the user to an authUrl:
  // const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: ['https://www.googleapis.com/auth/drive.file'] });
  // After user grants permission, Google redirects to your REDIRECT_URI with a code.
  // You would then exchange the code for tokens:
  // const { tokens } = await oauth2Cient.getToken(code);
  // oauth2Client.setCredentials(tokens);

  // For this placeholder, we can't get user tokens, so we'll return the configured client.
  return oauth2Client;
}


/**
 * Uploads a file to Google Drive.
 * THIS IS A PLACEHOLDER and does not actually upload to Google Drive without a full auth flow.
 * @param file The file to upload.
 * @returns A mock public URL for the file.
 */
export async function uploadFile(file: File): Promise<string> {
  console.log(`[Drive Service] Attempting to upload file: ${file.name}`);
  const auth = await getAuthenticatedClient();

  if (!auth) {
    console.log("[Drive Service] No auth, using mock upload.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // This is a sample PDF URL.
    return 'https://www.africau.edu/images/default/sample.pdf';
  }
  
  // The rest of this function will only execute if credentials are set, but it
  // will still fail without a user's access token from a real OAuth flow.
  try {
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: file.name,
      // To upload to a specific folder, add its ID here:
      // parents: ['YOUR_FOLDER_ID'] 
    };
    
    const media = {
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
    
    // Make the file publicly readable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Return a direct download link if possible, or the view link
    return `https://docs.google.com/uc?id=${fileId}&export=download`;

  } catch (error) {
    console.error('Failed to upload file to Google Drive. Check authentication flow.', error);
    // Fallback to a mock URL on failure
    return 'https://www.africau.edu/images/default/sample.pdf';
  }
}
