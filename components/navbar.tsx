import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image src="https://i.imgur.com/TxBcnpt.png" alt="ScriptsZone Logo" fill className="object-contain" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-wide">
              SCRIPTSBASE
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
