"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Box, Coins, Layers3, Sparkles, ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/ui/HeroSection";
import { FeaturesSection } from "@/components/ui/FeaturesSection";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { CTASection } from "@/components/ui/CTASection";

const CreatorCanvas = dynamic(
  () => import("@/components/3d/CreatorCanvas").then((m) => m.CreatorCanvas),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <HeroSection />

      <section className="relative py-20 sm:py-28 border-y border-white/5 bg-[#030308]">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-cyan-300/80">
                <Sparkles className="w-4 h-4" /> Spatial Creation Network
              </div>
              <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
                Build the NFT before you <span className="gradient-text">mint it.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-white/45 leading-relaxed">
                This is the real Creator Studio, not a gallery of fake examples. Add geometry,
                shape your scene, choose materials, then take that scene into the mint flow.
              </p>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Open Creator Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-4">
            <div className="h-[520px] sm:h-[620px] rounded-3xl border border-cyan-300/10 overflow-hidden shadow-2xl shadow-violet-950/30">
              <CreatorCanvas />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 flex flex-col gap-4">
              <div className="text-xs text-white/30 font-mono tracking-widest">NFTVERSE // CORE</div>
              {[
                [Box, "3D Native", "Nine procedural primitives with real Three.js geometry."],
                [Layers3, "Scene State", "Your creator scene persists locally while you work."],
                [Coins, "On-Chain", "Connect your wallet and mint through the deployed Sepolia contract."],
              ].map(([Icon, title, text]) => {
                const I = Icon as typeof Box;
                return (
                  <motion.div
                    key={title as string}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-white/5 bg-black/20 p-4"
                  >
                    <I className="w-5 h-5 text-cyan-300 mb-3" />
                    <h3 className="font-semibold text-white">{title as string}</h3>
                    <p className="mt-1 text-sm text-white/40 leading-relaxed">{text as string}</p>
                  </motion.div>
                );
              })}
              <div className="mt-auto rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4">
                <div className="text-[10px] font-mono tracking-widest text-emerald-300/70">SEPOLIA CONTRACT</div>
                <div className="mt-2 text-[11px] font-mono text-emerald-200 break-all">
                  0x02f93c7547309ca50EEAB446DaEBE8ce8E694cBb
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
