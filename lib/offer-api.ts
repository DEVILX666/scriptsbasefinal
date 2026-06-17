export interface Offer {
  id: string
  title: string
  description: string
  difficulty: "VERY EASY" | "EASY" | "MEDIUM" | "HARD"
  reward: string
  url: string
  icon?: string
  category?: string
  offerNumber?: number
}

export interface OfferApiResponse {
  success: boolean
  offers: Offer[]
  error?: string
}

const USER_ID = "623569"
const API_KEY = "5d6dca1d960a1bb3eb0590e3e3a6afca"
const API_BASE_URL = "https://de6jvomfbm0af.cloudfront.net/public/offers/feed.php"

export async function fetchOffers(
  userIP?: string,
  userAgent?: string,
  maxOffers = 1,
  startIndex = 0
): Promise<OfferApiResponse> {
  try {
    const params = new URLSearchParams({
      user_id: USER_ID,
      api_key: API_KEY,
      s1: "",
      s2: "",
    })

    if (userIP) {
      params.append("ip", userIP)
    }
    if (userAgent) {
      params.append("user_agent", userAgent)
    }

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    const offersArray = Array.isArray(data) ? data : []

    if (!Array.isArray(offersArray) || offersArray.length === 0) {
      return {
        success: false,
        offers: [],
        error: "No offers available",
      }
    }

    const selectedOffers = offersArray.slice(startIndex, startIndex + maxOffers)

    if (selectedOffers.length === 0) {
      return {
        success: false,
        offers: [],
        error: "No offers available",
      }
    }

    const offers: Offer[] = selectedOffers.map((offer: any, index: number) => {
      const apiIndex = startIndex + index
      return {
        id: offer.offer_id?.toString() || `offer-${apiIndex}`,
        title: offer.anchor || "Complete Offer",
        description: offer.conversion || "Complete this offer to unlock premium scripts",
        difficulty: getDifficultyFromOffer(offer, index),
        reward: "Premium Scripts Access",
        url: offer.url || "#",
        icon: undefined,
        category: "General",
        offerNumber: index + 1,
      }
    })

    return {
      success: true,
      offers: offers,
    }
  } catch (error) {
    console.error("[v0] Error fetching offers:", error)
    return {
      success: false,
      offers: [],
      error: error instanceof Error ? error.message : "Failed to fetch offers",
    }
  }
}

function getDifficultyFromOffer(offer: any, index: number): Offer["difficulty"] {
  if (index === 0) {
    return "VERY EASY"
  }
  if (index === 1) {
    return "EASY"
  }
  return "MEDIUM"
}

export async function getUserIP(): Promise<string> {
  if (typeof window === "undefined") {
    return "127.0.0.1"
  }

  const timeout = 5000

  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(timeout),
    })
    if (response.ok) {
      const data = await response.json()
      if (data?.ip) return data.ip as string
    }
  } catch {
    // try next
  }

  try {
    const response = await fetch("https://api64.ipify.org?format=json", {
      signal: AbortSignal.timeout(timeout),
    })
    if (response.ok) {
      const data = await response.json()
      if (data?.ip) return data.ip as string
    }
  } catch {
    // try next
  }

  try {
    const response = await fetch("https://ifconfig.me/ip", {
      signal: AbortSignal.timeout(timeout),
    })
    if (response.ok) {
      const text = (await response.text()).trim()
      if (text) return text
    }
  } catch {
    // fall through
  }

  return "127.0.0.1"
}
