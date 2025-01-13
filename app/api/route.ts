import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://redash.hasadna.org.il/api/queries/1433/results.json', {
      headers: {
        'Authorization': `Key ${process.env.REDASH_API_KEY}`, // Ensure you have the correct API key in your .env.local
      },
    });

    // Return response with cache control headers to prevent caching
    const nextResponse = NextResponse.json(response.data);
    nextResponse.headers.set('Cache-Control', 'no-store, max-age=0'); // Prevent caching
    nextResponse.headers.set('Pragma', 'no-cache'); // Older HTTP/1.0 cache control
    nextResponse.headers.set('Expires', '0'); // Forces no caching

    return nextResponse;
  } catch (error) {
    console.error('Error fetching data from Redash:', error);
    const nextResponse = NextResponse.json({ error: 'Failed to fetch data from Redash' });
    nextResponse.headers.set('Cache-Control', 'no-store, max-age=0'); // Prevent caching on error response
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');

    return nextResponse;
  }
}
