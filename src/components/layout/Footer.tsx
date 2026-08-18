"use client";

import Link from "next/link";
import { Boxes, Github, MessageCircle, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">
              NFT<span className="gradient-text">Verse</span>
            </span>
          </div>
          <p className="text-white/40 text-sm max-w-sm">
            The 3D-first NFT marketplace. Build scenes in the Creator Studio,
            connect your wallet, and mint real ERC-721 tokens on your favorite chain.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-white/40">
            <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
            <li><Link href="/create" className="hover:text-white transition-colors">Creator Studio</Link></li>
            <li><Link href="/mint" className="hover:text-white transition-colors">Mint</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Community</h4>
          <ul className="space-y-2 text-sm text-white/40">
            <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Twitter / X</li>
            <li className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</li>
            <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> Discord</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 text-center text-xs text-white/30">
        © {new Date().getFullYear()} NFTVerse. Built for creators.
      </div>
    </footer>
  );
}
