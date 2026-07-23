import { NextResponse } from "next/server";

const OPENCHARGEMAP_API_KEY = process.env.OPENCHARGEMAP_API_KEY;

export async function GET() {
  if (!OPENCHARGEMAP_API_KEY) {
    return NextResponse.json({ error: "Missing OpenChargeMap API key." }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.openchargemap.io/v3/referencedata/?key=${OPENCHARGEMAP_API_KEY}`
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to load reference data." }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reference data." }, { status: 500 });
  }
}
