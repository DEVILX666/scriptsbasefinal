/**
 * Server-side geolocation utilities
 * Lookup order: ipapi.co → ip-api.com → ipwho.is (cache on success)
 */

import { getCachedGeo, setCachedGeo } from "./geo-cache"

export interface GeoLocation {
  country: string
  countryCode: string
  isUSA: boolean
}

const FETCH_HEADERS = { "User-Agent": "NextJS-App/1.0" }
const TIMEOUT_MS = 8000

/** Vercel / CloudFront / Cloudflare pass country without IP APIs */
export function getCountryCodeFromEdgeHeaders(headers: Headers): string | null {
  const raw =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("cloudfront-viewer-country")
  if (!raw) return null
  const u = raw.trim().slice(0, 2).toUpperCase()
  if (!/^[A-Z]{2}$/.test(u) || u === "XX" || u === "T1") return null
  return u
}

export function geoLocationFromCountryCode(countryCode: string, countryName?: string): GeoLocation {
  const cc = countryCode.toUpperCase()
  return {
    country: countryName || cc,
    countryCode: cc,
    isUSA: cc === "US",
  }
}

async function lookupViaIpApiCo(ip: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return null
    const data = await response.json()
    if (data?.error) return null
    const raw = data.country_code ?? data.country
    if (!raw || String(raw).length !== 2) return null
    const countryCode = String(raw).toUpperCase()
    return {
      country: data.country_name || data.country || "Unknown",
      countryCode,
      isUSA: countryCode === "US",
    }
  } catch {
    return null
  }
}

async function lookupViaIpApi(ip: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return null
    const data = await response.json()
    if (data.status !== "success") return null
    const countryCode = data.countryCode || "UNKNOWN"
    return {
      country: data.country || "Unknown",
      countryCode,
      isUSA: countryCode === "US",
    }
  } catch {
    return null
  }
}

async function lookupViaIpWho(ip: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return null
    const data = await response.json()
    if (data?.success === false) return null
    const raw = data.country_code ?? data.countryCode
    if (!raw || String(raw).length !== 2) return null
    const countryCode = String(raw).toUpperCase()
    return {
      country: data.country || "Unknown",
      countryCode,
      isUSA: countryCode === "US",
    }
  } catch {
    return null
  }
}

function isLoopbackClient(ip: string): boolean {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip === "::ffff:127.0.0.1" ||
    ip === "localhost"
  )
}

/**
 * Detects user's country from their IP address (ipapi.co → ip-api → ipwho, then cache)
 */
export async function getUserCountry(ip?: string, bypassCache: boolean = false): Promise<GeoLocation> {
  try {
    if (!ip || isLoopbackClient(ip)) {
      return { country: "USA", countryCode: "US", isUSA: true }
    }
    if (ip === "0.0.0.0") {
      return process.env.NODE_ENV === "development"
        ? { country: "USA", countryCode: "US", isUSA: true }
        : { country: "Unknown", countryCode: "UNKNOWN", isUSA: false }
    }

    const effectiveIp = ip
    if (!bypassCache) {
      const cachedResult = getCachedGeo(effectiveIp)
      if (cachedResult) {
        console.debug("[Geo] Cache hit for IP:", effectiveIp)
        return cachedResult
      }
    } else {
      console.log("[Geo] Bypassing cache for IP:", effectiveIp)
    }

    let result =
      (await lookupViaIpApiCo(effectiveIp)) ||
      (await lookupViaIpApi(effectiveIp)) ||
      (await lookupViaIpWho(effectiveIp))

    if (!result) {
      console.error("[Geo] All geolocation lookups failed for IP:", effectiveIp)
      return { country: "Unknown", countryCode: "UNKNOWN", isUSA: false }
    }

    setCachedGeo(effectiveIp, result)
    return result
  } catch (error) {
    console.error("[Geo] Unexpected error detecting country:", error)
    return { country: "Unknown", countryCode: "UNKNOWN", isUSA: false }
  }
}

/**
 * Extract client IP from request headers (CDN / reverse-proxy aware)
 */
export function getClientIP(headers: Headers): string {
  const entries: [string, boolean][] = [
    ["cf-connecting-ip", false],
    ["true-client-ip", false],
    ["x-real-ip", false],
    ["x-forwarded-for", true],
    ["x-vercel-forwarded-for", true],
    ["fly-client-ip", false],
    ["fastly-client-ip", false],
  ]

  for (const [name, splitComma] of entries) {
    const v = headers.get(name)
    if (!v) continue
    const ip = splitComma ? v.split(",")[0].trim() : v.trim()
    if (ip) return ip
  }

  return "0.0.0.0"
}
