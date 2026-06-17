import { NextRequest, NextResponse } from "next/server"
import { getUserCountry, getClientIP } from "@/lib/geo"
import { getCacheStats, cleanupExpiredCache } from "@/lib/geo-cache"

/**
 * Debug endpoint to test geolocation functionality
 * Remove in production or add authentication
 */
export async function GET(request: NextRequest) {
  // Get the client IP
  const clientIP = getClientIP(request.headers)

  // Test geolocation
  const geoLocation = await getUserCountry(clientIP)

  // Get cache stats
  const cacheStats = getCacheStats()

  // Get any query parameter IP for testing
  const testIP = request.nextUrl.searchParams.get("ip")
  let testGeo = null

  if (testIP) {
    try {
      testGeo = await getUserCountry(testIP)
    } catch (error) {
      console.error("Error testing IP:", error)
    }
  }

  // Cleanup expired entries
  const cleaned = cleanupExpiredCache()

  return NextResponse.json(
    {
      success: true,
      timestamp: new Date().toISOString(),
      client: {
        ip: clientIP,
        country: geoLocation.country,
        countryCode: geoLocation.countryCode,
        isUSA: geoLocation.isUSA,
      },
      ...(testIP && {
        testIP: {
          ip: testIP,
          country: testGeo?.country,
          countryCode: testGeo?.countryCode,
          isUSA: testGeo?.isUSA,
        },
      }),
      cache: {
        ...cacheStats,
        cleanedEntries: cleaned,
      },
      info: {
        message:
          "This is a debug endpoint. Remove or add authentication in production.",
        usage:
          "GET /api/debug/geo?ip=1.1.1.1 to test a specific IP address",
      },
    },
    { status: 200 }
  )
}
