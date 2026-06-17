"use client"

import { GameCard } from "./game-card"
import { gameScripts } from "@/lib/scripts-data"

export function ScriptsGrid() {
  return (
    <section id="scripts" className="relative py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          {/* Section header - optimized for mobile */}
          <div className="text-center space-y-2 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Premium Scripts
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Choose from our collection of premium scripts for the most popular Roblox games
            </p>
          </div>

          {/* Scripts grid - optimized for mobile with better spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {gameScripts.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
