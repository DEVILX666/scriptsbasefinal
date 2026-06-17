import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-16 pb-8 sm:pt-20 sm:pb-12 min-h-[60vh] sm:min-h-[70vh]">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              Premium scripts = no ban, fully undetectable, not patched, 100% FREE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight px-2">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              All Roblox Scripts
            </span>
            <br />
            <span className="text-foreground">In One Place</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Unlock All premium scripts for every Roblox game. All in one place, completely free.
          </p>

          {/* Stats - optimized for mobile */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto pt-6 sm:pt-8">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">100+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Scripts</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Free</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Updated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
