import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Adding a cache-busting parameter (timestamp or random number)
    const url = `https://redash.hasadna.org.il/api/queries/1433/results.json?cacheBuster=${Date.now()}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Key ${process.env.REDASH_API_KEY}`, // Ensure you have the correct API key in your .env.local
      },
    });

    const nextResponse = NextResponse.json(response.data);
    
    // Disable caching explicitly
    nextResponse.headers.set('Cache-Control', 'no-store, max-age=0');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');

    // Use Vercel's revalidate feature to ensure fresh data
    nextResponse.headers.set('x-vercel-revalidate', '1');

    return nextResponse;
  } catch (error) {
    console.error('Error fetching data from Redash:', error);
    const nextResponse = NextResponse.json({ error: 'Failed to fetch data from Redash' });
    
    nextResponse.headers.set('Cache-Control', 'no-store, max-age=0');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');

    return nextResponse;
  }
}