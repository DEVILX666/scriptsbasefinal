"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { GameScript } from "@/lib/scripts-data"
import Image from "next/image"
import { useState } from "react"
import { OfferOverlay } from "./offer-overlay"

interface GameCardProps {
  game: GameScript
}

export function GameCard({ game }: GameCardProps) {
  const [showOfferOverlay, setShowOfferOverlay] = useState(false)

  const handleCardClick = () => {
    setShowOfferOverlay(true)
  }

  const handleOfferClose = () => {
    setShowOfferOverlay(false)
  }

  const handleOfferComplete = () => {
    setShowOfferOverlay(false)
  }

  return (
    <>
      <style jsx>{`
        @keyframes greenGlow {
          0%, 100% {
            color: #00ff88;
            text-shadow: 0 0 8px #00ff88, 0 0 16px rgba(0, 255, 136, 0.6);
          }
          50% {
            color: #33ffaa;
            text-shadow: 0 0 16px #00ff88, 0 0 32px rgba(0, 255, 136, 0.8);
          }
        }
        
        @keyframes goldGlow {
          0%, 100% {
            color: #ffcc00;
            text-shadow: 0 0 8px #ffcc00, 0 0 16px rgba(255, 204, 0, 0.6);
          }
          50% {
            color: #fff4c2;
            text-shadow: 0 0 16px #ffcc00, 0 0 32px rgba(255, 215, 0, 0.8);
          }
        }
        
        .green-glow {
          animation: greenGlow 2s ease-in-out infinite;
        }
        
        .gold-glow {
          animation: goldGlow 2s ease-in-out infinite;
        }
        
        @keyframes preparing {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .preparing-animation {
          animation: preparing 1s ease-in-out infinite;
        }
      `}</style>

      <Card
        className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300" />

        <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors flex-shrink-0">
              <Image src={game.logoUrl || "/placeholder.svg"} alt={game.name} fill className="object-cover" />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {game.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">{game.description}</p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-sm sm:text-base font-bold tracking-wide">
              <span className="green-glow font-black text-lg sm:text-xl">20+</span>
              <span className="ml-2 gold-glow font-semibold">Premium Scripts</span>
              <span className="ml-2 text-muted-foreground font-medium">Included</span>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 text-sm sm:text-base py-5 sm:py-6 font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Get Scripts
          </Button>
        </div>
      </Card>

      <OfferOverlay
        isOpen={showOfferOverlay}
        onClose={handleOfferClose}
        gameName={game.name}
        gameLogo={game.logoUrl}
        onOfferComplete={handleOfferComplete}
      />
    </>
  )
}
