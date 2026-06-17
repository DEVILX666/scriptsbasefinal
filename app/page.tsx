import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ScriptsGrid } from "@/components/scripts-grid"
import { Footer } from "@/components/footer"
import { Starfield } from "@/components/starfield"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Animated starfield background */}
      <Starfield />

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ScriptsGrid />
        <Footer />
      </div>
    </main>
  )
}
