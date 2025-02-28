import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the authorization code from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('Error during Dropbox OAuth:', error);
      return new Response(
        `Authorization failed: ${error}. Please check the console for more details.`,
        { status: 400 }
      );
    }

    if (!code) {
      return new Response('No authorization code received', { status: 400 });
    }

    // Display the code to the user
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dropbox Authorization Success</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 2rem auto;
              padding: 0 1rem;
              line-height: 1.5;
            }
            code {
              background: #f0f0f0;
              padding: 0.2rem 0.4rem;
              border-radius: 4px;
            }
            .warning {
              color: #d63939;
              padding: 1rem;
              border: 1px solid currentColor;
              border-radius: 4px;
              margin: 1rem 0;
            }
          </style>
        </head>
        <body>
          <h1>Authorization Successful!</h1>
          <p>Your authorization code is:</p>
          <code>${code}</code>
          <div class="warning">
            <strong>Important:</strong>
            <p>Use this code to get your refresh token by making a POST request to the token endpoint as described in the README.</p>
            <p>This code can only be used once and will expire soon.</p>
          </div>
          <p>For security reasons, please close this window after copying the code.</p>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error in Dropbox callback:', error);
    return NextResponse.json(
      { error: 'Failed to process authorization' },
      { status: 500 }
    );
  }
}
