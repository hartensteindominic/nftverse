"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, Boxes, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { icon: Wallet, step: "01", title: "Connect Wallet", desc: "Link MetaMask, WalletConnect or Coinbase Wallet in one click." },
  { icon: Boxes, step: "02", title: "Build in 3D", desc: "Compose your scene in the Creator Studio with shapes, materials and colors." },
  { icon: Sparkles, step: "03", title: "Mint On-Chain", desc: "Sign one transaction and your creation becomes a real ERC-721 NFT." },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          Mint in <span className="gradient-text">three steps</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative glass rounded-2xl p-8 border border-white/5"
            >
              <span className="absolute top-6 right-6 text-5xl font-black text-white/5">{s.step}</span>
              <s.icon className="w-8 h-8 text-violet-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 text-violet-300 hover:text-violet-200 font-medium"
          >
            Open the Creator Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
