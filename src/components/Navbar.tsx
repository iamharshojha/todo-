import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-medium">
          <CheckCircle2 className="w-5 h-5 text-purple-500" />
          <span>Antigravity Tasks</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#stats" className="hover:text-white transition-colors">Stats</Link>
          <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
