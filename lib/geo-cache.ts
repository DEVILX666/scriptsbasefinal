/**
 * In-memory geo-location cache with TTL
 * Reduces API calls and improves response times
 */

interface CacheEntry {
  data: {
    country: string
    countryCode: string
    isUSA: boolean
  }
  timestamp: number
}

// Simple in-memory cache
const geoCache = new Map<string, CacheEntry>()

// Cache TTL in milliseconds (default: 5 minutes for testing, set to 1 hour in production)
const CACHE_TTL = 5 * 60 * 1000

/**
 * Get cached geolocation data if available and not expired
 */
export function getCachedGeo(ip: string) {
  const entry = geoCache.get(ip)

  if (!entry) return null

  // Check if cache entry has expired
  const isExpired = Date.now() - entry.timestamp > CACHE_TTL

  if (isExpired) {
    geoCache.delete(ip)
    return null
  }

  return entry.data
}

/**
 * Store geolocation data in cache
 */
export function setCachedGeo(
  ip: string,
  data: {
    country: string
    countryCode: string
    isUSA: boolean
  }
) {
  geoCache.set(ip, {
    data,
    timestamp: Date.now(),
  })
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats() {
  const now = Date.now()
  let validEntries = 0
  let expiredEntries = 0

  geoCache.forEach((entry) => {
    if (now - entry.timestamp > CACHE_TTL) {
      expiredEntries++
    } else {
      validEntries++
    }
  })

  return {
    totalEntries: geoCache.size,
    validEntries,
    expiredEntries,
    cacheSize: `~${Math.round((geoCache.size * 200) / 1024)}KB`, // Rough estimate
  }
}

/**
 * Clear all cache
 */
export function clearGeoCache() {
  geoCache.clear()
}

/**
 * Clear expired cache entries
 */
export function cleanupExpiredCache() {
  const now = Date.now()
  let cleaned = 0

  geoCache.forEach((entry, ip) => {
    if (now - entry.timestamp > CACHE_TTL) {
      geoCache.delete(ip)
      cleaned++
    }
  })

  return cleaned
}
