"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles, Store, Wallet } from "lucide-react";
import { useAccount } from "wagmi";

const Scene3D = dynamic(() => import("@/components/3d/Scene3D").then((m) => m.Scene3D), { ssr: false });
const NFTModel = dynamic(() => import("@/components/3d/NFTModel").then((m) => m.NFTModel), { ssr: false });

export function HeroSection() {
  const { isConnected } = useAccount();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-[#050508]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-violet-500/30 text-violet-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            3D-native NFT platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Create &amp; Mint{" "}
            <span className="gradient-text">3D NFTs</span>{" "}
            On-Chain
          </h1>
          <p className="text-white/50 text-lg mb-8 max-w-lg leading-relaxed">
            Build interactive 3D scenes in the Creator Studio, connect your crypto
            wallet, and mint real ERC-721 tokens across Ethereum, Polygon, Base and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass border border-white/10 text-white/80 font-semibold hover:bg-white/10 transition-all"
            >
              <Store className="w-5 h-5" />
              Explore Market
            </Link>
          </div>
          {!isConnected && (
            <p className="mt-6 text-sm text-white/30 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Connect your wallet to mint and trade
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[420px] lg:h-[540px]"
        >
          <Scene3D variant="hero">
            <NFTModel type="crystal" color="#8b5cf6" secondaryColor="#ec4899" scale={1.6} />
          </Scene3D>
        </motion.div>
      </div>
    </section>
  );
}
