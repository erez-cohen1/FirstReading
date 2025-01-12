// import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      "https://redash.hasadna.org.il/api/queries/1438/results.json",
      {
        headers: {
          Authorization: `Key aqCG3UXPNo8kPtSu3xMV5dIolTyNb28IyuP9bFwv`, // Ensure you have the correct API key in your .env.local
        },
      }
    );
    console.log("Data fetched from Redash:", NextResponse.json(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Redash:", error);
    return NextResponse.json({ error: "Failed to fetch data from Redash" });
  }
}

// GET(); // Call the function to fetch data from Redash

export async function GETcheck() {
  try {
    const response = await fetch(
      "https://redash.hasadna.org.il/api/queries/1438/results.json?api_key=aqCG3UXPNo8kPtSu3xMV5dIolTyNb28IyuP9bFwv"
      // {
      //   headers: {
      //     Authorization: `Key aqCG3UXPNo8kPtSu3xMV5dIolTyNb28IyuP9bFwv`, // Ensure you have the correct API key in your .env.local
      //   },
      // }
    );
    console.log("Data fetched from Redash:", await response.json());
    // return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Redash:", error);
    // return NextResponse.json({ error: "Failed to fetch data from Redash" });
  }
}

// GETcheck(); // Call the function to fetch data from Redash
