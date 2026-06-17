import { NextResponse } from "next/server"
import { clearGeoCache, getCacheStats } from "@/lib/geo-cache"

export async function POST() {
  try {
    const stats = getCacheStats()
    const cleared = clearGeoCache()

    return NextResponse.json(
      {
        success: true,
        message: "Geo cache cleared",
        cacheStatsBefore: stats,
        entriesCleared: stats.totalEntries,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to clear cache",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = getCacheStats()
    return NextResponse.json(
      {
        success: true,
        cache: stats,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get cache stats",
      },
      { status: 500 }
    )
  }
}
