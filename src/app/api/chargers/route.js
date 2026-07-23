import { NextResponse } from "next/server";

const OPENCHARGEMAP_API_KEY = process.env.OPENCHARGEMAP_API_KEY;

export async function GET(request) {
  if (!OPENCHARGEMAP_API_KEY) {
    return NextResponse.json({ error: "Missing OpenChargeMap API key." }, { status: 500 });
  }

  const url = new URL(request.url);

  const latitude = url.searchParams.get("latitude")
  const longitude = url.searchParams.get("longitude")

  const params = new URLSearchParams({
    output: "json",
    maxresults: "12",
    distance: "50",
    distanceunit: "KM",
    compact: "true",
    verbose: "false",
    latitude,
    longitude,
    key: OPENCHARGEMAP_API_KEY,
  });

  const response = await fetch(`https://api.openchargemap.io/v3/poi/?${params.toString()}`);

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to load charger data." }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
