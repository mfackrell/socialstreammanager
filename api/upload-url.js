const { handleUpload } = require('@vercel/blob/client');

module.exports = async function handler(request, response) {
  const allowedOrigin = process.env.CORS_ORIGIN || request.headers.origin || '*';
  response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  response.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Vary', 'Origin');

  if (request.method === 'OPTIONS') {
    return response.status(204).end();
  }

  // FIX: Handle body parsing for standard Node environments
  // If it's a string, parse it. If it's already an object, use it.
  const body = typeof request.body === 'string' 
    ? JSON.parse(request.body) 
    : request.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN, // Explicitly pass the token
      onBeforeGenerateToken: async (pathname) => {
        return {
          tokenPayload: JSON.stringify({
            // optional payload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob uploaded', blob.url);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Upload Error:", error);
    return response.status(400).json({ error: error.message });
  }
}
