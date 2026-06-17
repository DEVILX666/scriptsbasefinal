/**
 * Geolocation Configuration
 * Centralized settings for geo-restriction system
 */

export const GEO_CONFIG = {
  /**
   * Allowed country codes for access
   * Change this to allow multiple countries
   * Example: ['US', 'CA', 'MX']
   */
  allowedCountries: [
    "US", // United States
    "FR", // France
    "DE", // Germany
    "GB", // United Kingdom
    "CH", // Switzerland
    "ES", // Spain
    "IT", // Italy
    "LU", // Luxembourg
    "SI", // Slovenia
    "AU", // Australia
    "CA", // Canada
    "PL", // Poland
    "GR", // Greece
    "BA", // Bosnia and Herzegovina
    "ME", // Montenegro
    "AE", // United Arab Emirates
    "BG", // Bulgaria
    "QA", // Qatar
    "SA", // Saudi Arabia
  ],

  /**
   * Offer-overlay UI language (keys in lib/country-translator) per allowed country.
   * Lowercase ISO 3166-1 alpha-2. Keeps copy aligned to GEO_CONFIG.allowedCountries only
   * (no worldwide / catch-all map here).
   */
  allowedCountryToLanguage: {
    us: "en",
    fr: "fr",
    de: "de",
    gb: "en",
    ch: "de",
    es: "es",
    it: "it",
    lu: "fr",
    si: "sl",
    au: "en",
    ca: "en",
    pl: "pl",
    gr: "el",
    ba: "sr",
    me: "sr",
    ae: "ar",
    bg: "bg",
    qa: "ar",
    sa: "ar",
  } as Record<string, string>,

  /**
   * Geolocation API settings
   */
  api: {
    // Server chain in lib/geo.ts: ipapi.co/{ip}/json → ip-api → ipwho.is
    url: "https://ipapi.co/",
    timeout: 5000, // milliseconds
    userAgent: "NextJS-App/1.0",
  },

  /**
   * Cache settings
   */
  cache: {
    // Time to live for cache entries (default: 1 hour)
    ttl: 60 * 60 * 1000,
    // Maximum entries to store in memory
    maxEntries: 10000,
  },

  /**
   * Redirect paths
   */
  redirects: {
    // Non-allowed countries (see allowedCountries) — full URL so middleware can send users off-site
    blocked: "https://scriptsbase2.vercel.app/",
    // Where to send allowed users (optional)
    allowed: "/",
  },

  /**
   * Debug/Monitoring
   */
  debug: {
    // Enable debug logging
    verbose: process.env.NODE_ENV === "development",
    // Enable debug endpoint
    enableDebugEndpoint: process.env.NODE_ENV === "development",
  },

  /**
   * Fallback behavior
   */
  fallback: {
    // When false, middleware redirects to blocked URL if geo logic throws
    allowOnError: false,
    // Log fallback events
    logFallbacks: true,
  },

  /**
   * IP detection settings
   */
  ipDetection: {
    // Headers to check for real IP (in priority order)
    headerPriority: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
    // Local IPs to skip geolocation check
    skipLocalIPs: ["127.0.0.1", "::1", "localhost"],
  },

  /**
   * Production settings
   * Override these based on environment
   */
  production: {
    // Use premium geolocation API
    usePremiumAPI: false,
    // Cache geolocation results
    enableCache: true,
    // Log all geo blocks
    logBlocks: true,
  },
}

/**
 * Check if a country code is allowed
 */
export function isCountryAllowed(countryCode: string): boolean {
  return GEO_CONFIG.allowedCountries.includes(countryCode)
}

/**
 * Get redirect URL based on access
 */
export function getRedirectUrl(isAllowed: boolean): string {
  return isAllowed ? GEO_CONFIG.redirects.allowed : GEO_CONFIG.redirects.blocked
}

/**
 * Update allowed countries at runtime
 * Use with caution in production
 */
export function updateAllowedCountries(countries: string[]): void {
  GEO_CONFIG.allowedCountries = countries
  console.log("[Geo] Allowed countries updated:", countries)
}
