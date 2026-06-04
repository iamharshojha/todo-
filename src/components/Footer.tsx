import Link from 'next/link'
import { CheckCircle2, MessageCircle, GitFork, Briefcase } from 'lucide-react'
export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white font-medium mb-4">
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
              <span>Antigravity Tasks</span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-6">
              Plan less. Achieve more. The intelligent task manager for high-performance teams and individuals.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <GitFork className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Antigravity Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-600 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-600 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
