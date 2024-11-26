import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // End of the stream
  return stream;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = bufferToStream(buffer);

    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id', // Only return the file ID
    });

    // Make the file publicly accessible (optional)
    await drive.permissions.create({
      fileId: response.data.id as string,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
   // https://drive.google.com/thumbnail?id=0B6wwyazyzml-OGQ3VUo0Z2thdmc&sz=w1000
    const fileUrl = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=w1000`;
    console.log(response.data.id);

    return NextResponse.json({
      success: true,
      fileId: response.data.id,
      fileUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}