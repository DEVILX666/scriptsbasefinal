import { NextResponse } from "next/server"
import { getUserCountry, getClientIP } from "@/lib/geo"

export const dynamic = "force-dynamic"

/**
 * Same-origin geo lookup for the client (offer UI language).
 * Browser calls to third-party IP APIs often return 403; this uses the server ip-api path + cache.
 */
export async function GET(request: Request) {
  const ip = getClientIP(request.headers)
  const geo = await getUserCountry(ip)
  return NextResponse.json({
    countryCode: geo.countryCode,
    country: geo.country,
  })
}
