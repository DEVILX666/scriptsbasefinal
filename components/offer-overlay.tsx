"use client"

import { useState, useEffect, ReactElement } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, ExternalLink, Star, Zap, Shield, Lock } from "lucide-react"
import { fetchOffers, getUserIP, type Offer } from "@/lib/offer-api"
import { detectCountryAndGetLanguage, getTranslation } from "@/lib/country-translator"

interface OfferOverlayProps {
  isOpen: boolean
  onClose: () => void
  gameName: string
  gameLogo: string
  onOfferComplete: () => void
}

const difficultyConfig = {
  "VERY EASY": {
    color: "rgba(77, 255, 77, 0.3)",
    borderColor: "#4dff4d",
    textColor: "#4dff4d",
    icon: Star,
  },
  EASY: {
    color: "rgba(255, 204, 0, 0.3)",
    borderColor: "#ffcc00",
    textColor: "#ffcc00",
    icon: Zap,
  },
  MEDIUM: {
    color: "rgba(255, 165, 0, 0.3)",
    borderColor: "#ffa500",
    textColor: "#ffa500",
    icon: Shield,
  },
  HARD: {
    color: "rgba(255, 77, 77, 0.3)",
    borderColor: "#ff4d4d",
    textColor: "#ff4d4d",
    icon: Shield,
  },
}

const customOffers: Record<string, { title: string; logo: string; subtitle?: string }> = {
  "Swagbucks": {
    title: "Swagbucks",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_97878.png",
    subtitle: "Install Swagbucks and Play 3 Games for 5 Mins Each",
  },
  "Cash Giraffe": {
    title: "Cash Giraffe",
    logo: "https://cdn.affise.com/affise-media-service-prod/offers/959/25331/2399346535.200x200.png",
  },
  "Reco Social": {
    title: "Reco Social",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_107725.png",
  },
  "SoFi": {
    title: "SoFi: Credit Insights",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_101022.png",
  },
  "MONEY CASH": {
    title: "MONEY CASH",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_103478.jpg",
  },
  "Brandbee": {
    title: "Brandbee",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_105800.webp",
  },
  "Just Play": {
    title: "JustPlay",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_102115.png",
  },
  "JustPlay": {
    title: "JustPlay",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_102115.png",
  },
  "Prograd": {
    title: "Prograd",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_103437.png",
  },
  "PlayMAX": {
    title: "PlayMAX",
    logo: "https://banners.hangmyads.com/files/uploads/Off_A_105805.jpg",
  },
  "Mistplay": {
    title: "Mistplay",
    logo: "https://cdn.affise.com/affise-media-service-prod/offers/959/26538/648176406.200x200.png",
  },
}

const getCustomOffer = (offerTitle: string): { title: string; logo: string; subtitle?: string } | null => {
  for (const [key, custom] of Object.entries(customOffers)) {
    if (offerTitle.includes(key)) {
      return custom
    }
  }
  return null
}

const translateDifficulty = (difficulty: string, language: string): string => {
  const key = difficulty.toLowerCase().replace(" ", "_")
  return getTranslation(language, key)
}

const premiumScriptsPhrases: Record<string, string[]> = {
  en: ["premium scripts"],
  es: ["scripts premium"],
  fr: ["scripts premium"],
  de: ["Premium-Skripte"],
  pt: ["scripts premium"],
  it: ["script premium"],
  ru: ["премиум-скрипты"],
  ja: ["プレミアムスクリプト"],
  zh: ["高级脚本"],
  ar: ["البرامج النصية المميزة"],
  ko: ["프리미엄 스크립트"],
  th: ["สคริปต์พรีเมียม"],
  vi: ["tập lệnh premium"],
  id: ["skrip premium"],
  pl: ["skrypty premium"],
  tr: ["premium komut dosyaları"],
  nl: ["premium scripts"],
  sv: ["premium-skript"],
  da: ["premium-scripts"],
  no: ["premium-skript"],
  fi: ["premium-skriptit"],
  cs: ["prémiové skripty"],
  hu: ["premium szkriptek"],
  ro: ["scripturile premium"],
  el: ["premium scripts"],
  he: ["סקריפטים פרימיום"],
  hi: ["प्रीमियम स्क्रिप्ट"],
  uk: ["преміум-скрипти"],
  sk: ["prémiové skripty"],
  sl: ["premium skripte"],
  hr: ["premium skripte"],
  sr: ["премијум скрипте"],
  bg: ["премиум скриптове"],
  mk: ["премиум скрипти"],
  sq: ["skriptat premium"],
  et: ["premium skriptid"],
  lv: ["premium skriptus"],
  lt: ["premium scenarijus"],
  ga: ["scripteanna premium"],
  cy: ["sgriptiau premium"],
  mt: ["skripts premium"],
  is: ["premium-handrit"],
  af: ["premium-skrifte"],
  sw: ["hati za premium"],
  zu: ["izinhlelo zokusebenza zepremiyamu"],
  xh: ["izinhlelo zokusebenza zepremiyamu"],
  ny: ["zolembedza zapremiyamu"],
  mg: ["script premium"],
  ti: ["ፕሪሚየም ስክሪፕቶች"],
  or: ["ପ୍ରିମିୟମ ସ୍କ୍ରିପ୍ଟ"],
  pa: ["ਪ੍ਰੀਮੀਅਮ ਸਕ੍ਰਿਪਟ"],
  bn: ["প্রিমিয়াম স্ক্রিপ্ট"],
  ta: ["பிரீமியம் ஸ்கிரிப்ட்கள்"],
  te: ["ప్రీమియం స్క్రిప్ట్‌లు"],
  ml: ["പ്രിമിയം സ്ക്രിപ്റ്റുകൾ"],
  kn: ["ಪ್ರೀಮಿಯಂ ಸ್ಕ್ರಿಪ್ಟ್‌ಗಳು"],
  gu: ["પ્રીમિયમ સ્ક્રિપ્ટ્સ"],
  mr: ["प्रीमियम स्क्रिप्ट्स"],
  si: ["ප්‍රිමියම් ස්ක්‍රිප්ට්"],
  my: ["ပရီမီယံ စာသားများ"],
  km: ["ស្គ្រីប ប្រិមីយ៉ូម"],
  lo: ["ສະຄິບ ພຣີມຽມ"],
}

const highlightPremiumScripts = (text: string, language: string): ReactElement => {
  const phrases = premiumScriptsPhrases[language] || premiumScriptsPhrases.en
  let result: (string | ReactElement)[] = [text]

  for (const phrase of phrases) {
    const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedPhrase})`, "gi")
    const newParts: (string | ReactElement)[] = []
    let keyIndex = 0

    result.forEach((part) => {
      if (typeof part === "string") {
        const matches = [...part.matchAll(regex)]
        if (matches.length === 0) {
          newParts.push(part)
        } else {
          let lastIndex = 0
          matches.forEach((match) => {
            if (match.index !== undefined) {
              if (match.index > lastIndex) {
                newParts.push(part.substring(lastIndex, match.index))
              }
              newParts.push(
                <span
                  key={`highlight-${keyIndex++}`}
                  style={{
                    color: "#ffcc00",
                    textShadow: "0 0 6px #ffcc00, 0 0 12px rgba(255,204,0,0.7)",
                    animation: "goldBlink 1.2s infinite",
                  }}
                >
                  {match[0]}
                </span>
              )
              lastIndex = match.index + match[0].length
            }
          })
          if (lastIndex < part.length) {
            newParts.push(part.substring(lastIndex))
          }
        }
      } else {
        newParts.push(part)
      }
    })

    result = newParts
  }

  return <>{result}</>
}

function OfferCard({
  offer,
  index,
  language,
  onOfferComplete,
}: {
  offer: Offer
  index: number
  language: string
  onOfferComplete: () => void
}) {
  const config = difficultyConfig[offer.difficulty]
  const customOffer = getCustomOffer(offer.title)

  const handleClick = () => {
    window.open(offer.url, "_blank", "noopener,noreferrer")
    onOfferComplete()
  }

  return (
    <Card
      className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] animate-in slide-in-from-bottom-4 duration-700"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Difficulty Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div
          style={{
            background: config.color,
            color: config.textColor,
            borderColor: config.borderColor,
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: "8px",
            border: `1px solid ${config.borderColor}`,
            whiteSpace: "nowrap",
            fontWeight: "bold",
          }}
        >
          {translateDifficulty(offer.difficulty, language)}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Offer Header */}
        <div className="flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/50 flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            {customOffer?.logo ? (
              <img src={customOffer.logo} alt={customOffer.title} className="w-full h-full object-cover" />
            ) : (
              <span
                className="text-xl font-black"
                style={{
                  color: "#ffcc00",
                  textShadow: "0 0 8px #ffcc00, 0 0 16px rgba(255,204,0,0.6)",
                }}
              >
                {offer.offerNumber}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {customOffer?.title || offer.title}
            </h4>
            <p
              className="text-sm font-semibold mt-1"
              style={{
                color: "#ff3333",
                textShadow: "0 0 8px #ff3333, 0 0 16px rgba(255,51,51,0.6)",
              }}
            >
              {customOffer?.subtitle ?? offer.title}
            </p>
          </div>
        </div>

        {/* Reward Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>
            {getTranslation(language, "reward")} {offer.reward}
          </span>
        </div>

        {/* Button */}
        <Button
          onClick={handleClick}
          className="w-full transition-all duration-300 shadow-lg"
          size="lg"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            cursor: "pointer",
            opacity: 1,
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {getTranslation(language, "start_task")}
        </Button>
      </div>
    </Card>
  )
}

export function OfferOverlay({ isOpen, onClose, gameName, gameLogo, onOfferComplete }: OfferOverlayProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<string>("en")

  const loadOffers = async (lang: string) => {
    setLoading(true)
    setError(null)
    try {
      const userIP = await getUserIP()
      const userAgent = typeof window !== "undefined" ? navigator.userAgent : "Mozilla/5.0"
      const response = await fetchOffers(userIP, userAgent, 1, 0)
      if (response && response.success) {
        setOffers(response.offers || [])
      } else {
        setError(getTranslation(lang, "failed_to_load"))
      }
    } catch (err) {
      setError(getTranslation(lang, "failed_to_load"))
      console.error("[v0] Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    ;(async () => {
      const detectedLanguage = await detectCountryAndGetLanguage()
      if (cancelled) return
      setLanguage(detectedLanguage)
      await loadOffers(detectedLanguage)
    })()

    return () => {
      cancelled = true
    }
  }, [isOpen])

  const requiredOffers = 1

  const handleOfferComplete = () => {
    // No state changes - keep overlay in initial state
    // User clicks do not change the displayed values
  }

  const totalOffers = requiredOffers
  const remaining = totalOffers

  return (
    <>
      <style jsx>{`
        @keyframes goldBlink {
          0%, 100% {
            color: #ffcc00;
            text-shadow: 0 0 6px #ffcc00, 0 0 12px rgba(255,204,0,0.7);
          }
          50% {
            color: #fff4c2;
            text-shadow: 0 0 12px #ffcc00, 0 0 28px rgba(255,215,0,1);
          }
        }
        @keyframes slideRight {
          0%   { transform: translateX(-150%); opacity: 0.5; }
          50%  { opacity: 1; }
          100% { transform: translateX(400%); opacity: 0.5; }
        }
        @keyframes spinArc {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes checkmarkPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
          80%  { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes completionPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
        }
        @keyframes fillGreen {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes redirectSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in-0 zoom-in-95 duration-300 relative sm:max-w-lg md:max-w-2xl lg:max-w-4xl !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !mt-8 p-0"
          showCloseButton={false}
        >
          <div className="px-4 md:px-6 py-5">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <span className="text-red-400 text-lg font-bold">×</span>
            </button>

            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {getTranslation(language, "unlock_premium")}
                </DialogTitle>
              </div>

              {/* Game Info Header */}
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border/50 animate-in slide-in-from-top-4 duration-500">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/20">
                  {gameLogo && (
                    <img src={gameLogo || "/placeholder.svg"} alt={gameName} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {highlightPremiumScripts(getTranslation(language, "unlock_offer_challenge"), language)}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* ── Progress Bar ── */}
            <div
              style={{
                marginTop: "16px",
                marginBottom: "8px",
                padding: "12px 16px 14px",
                borderRadius: "12px",
                background: "rgba(6,182,212,0.04)",
                border: "1px solid rgba(6,182,212,0.18)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                {/* Left: spinner + text */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(6,182,212,0.08)",
                      border: "1.5px solid rgba(6,182,212,0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      animation: "none",
                      transition: "all 0.5s ease",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ animation: "spinArc 1.1s linear infinite" }}
                    >
                      <circle cx="12" cy="12" r="9" stroke="rgba(6,182,212,0.15)" strokeWidth="2.5" />
                      <path
                        d="M12 3C7.03 3 3 7.03 3 12C3 14.76 4.18 17.24 6.1 18.97"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <p style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#e0f7ff",
                      letterSpacing: "0.01em",
                      transition: "color 0.3s ease",
                    }}>
                      {getTranslation(language, "offer_progress_checking")}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#22d3ee",
                      transition: "color 0.3s ease",
                    }}>
                      {remaining > 0
                        ? getTranslation(language, "offer_task_remaining")
                        : getTranslation(language, "offer_all_done")}
                    </p>
                  </div>
                </div>

                {/* Right: badge */}
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "rgba(6,182,212,0.07)",
                    border: "1.5px solid rgba(6,182,212,0.35)",
                    transition: "all 0.5s ease",
                  }}
                >
                  <Lock style={{ width: "13px", height: "13px", color: "#22d3ee" }} />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      color: "#22d3ee",
                      letterSpacing: "0.06em",
                      transition: "color 0.3s ease",
                    }}
                  >
                    0 / {totalOffers}
                  </span>
                </div>
              </div>

              {/* Sliding shimmer / fill bar */}
              <div
                style={{
                  height: "2px",
                  background: "rgba(6,182,212,0.10)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  position: "relative",
                  transition: "background 0.5s ease",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "35%",
                    background: "linear-gradient(90deg, transparent 0%, #22d3ee 45%, #67e8f9 55%, transparent 100%)",
                    borderRadius: "999px",
                    animation: "slideRight 1.8s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
            {/* ── End Progress Bar ── */}

            <div className="space-y-6 mt-4">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">{getTranslation(language, "loading_tasks")}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => loadOffers(language)} variant="outline">
                    {getTranslation(language, "try_again")}
                  </Button>
                </div>
              )}

              {!loading && !error && offers && offers.length > 0 && (
                <div style={{ position: "relative" }}>
                  {/* Offer cards */}
                  <div
                    className="grid gap-4"
                    style={{
                      filter: "none",
                      transition: "filter 0.6s ease",
                      pointerEvents: "auto",
                    }}
                  >
                    {offers.map((offer, index) => (
                      <OfferCard
                        key={offer.id}
                        offer={offer}
                        index={index}
                        language={language}
                        onOfferComplete={handleOfferComplete}
                      />
                    ))}
                  </div>


                </div>
              )}

              {!loading && !error && offers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">{getTranslation(language, "no_offers")}</p>
                  <Button onClick={() => loadOffers(language)} variant="outline">
                    {getTranslation(language, "refresh")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
