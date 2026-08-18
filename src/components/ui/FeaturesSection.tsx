"use client";

import { motion } from "framer-motion";
import { Boxes, Wallet, Sparkles, Shield, Globe, Zap } from "lucide-react";

const features = [
  { icon: Boxes, title: "3D Creator Studio", desc: "Compose scenes from 9 geometric primitives, 5 materials and full color control — no 3D experience needed." },
  { icon: Wallet, title: "Any Crypto Wallet", desc: "MetaMask, WalletConnect, Coinbase Wallet and 300+ more via RainbowKit." },
  { icon: Sparkles, title: "Real Minting", desc: "Mint ERC-721 tokens with metadata URI, mint fee and creator tracking baked into the contract." },
  { icon: Globe, title: "Multi-Chain", desc: "Ethereum, Polygon, Arbitrum, Base, Optimism plus Sepolia, Amoy and Base Sepolia testnets." },
  { icon: Shield, title: "Non-Custodial", desc: "Your keys, your NFTs. The app never touches your private keys." },
  { icon: Zap, title: "Interactive Viewers", desc: "Every NFT renders as a live, orbitable 3D scene — not a flat JPEG." },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Everything you need to <span className="gradient-text">go 3D</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            From first shape to on-chain mint — the full pipeline lives in one app.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-violet-300" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
