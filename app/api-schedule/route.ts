import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = "https://production.oknesset.org/pipelines/data/committees/kns_committeesession/kns_committeesession.csv";

  // Adding a cache-busting parameter (timestamp or random number)
  // const url = `https://redash.hasadna.org.il/api/queries/1433/results.json?cacheBuster=${Date.now()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Key diojnr7RjG9TW0OZMNWWRxR2YrdxREUxq29OOISK`, // Ensure you have the correct API key in your .env.local
    },
  });

  const nextResponse = NextResponse.json(response.data);

  // Disable caching explicitly
  nextResponse.headers.set("Cache-Control", "no-store, max-age=0");
  nextResponse.headers.set("Pragma", "no-cache");
  nextResponse.headers.set("Expires", "0");

  // Use Vercel's revalidate feature to ensure fresh data
  nextResponse.headers.set("x-vercel-revalidate", "1");

  return nextResponse;
}
