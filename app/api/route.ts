import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://redash.hasadna.org.il/api/queries/1433/results.json', {
      headers: {
        'Authorization': `Key ${process.env.REDASH_API_KEY}`, // Ensure you have the correct API key in your .env.local
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Redash:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Redash' });
  }
}
