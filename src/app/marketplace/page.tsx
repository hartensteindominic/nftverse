"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, ExternalLink } from "lucide-react";
import { useMintStore } from "@/stores/nft-store";
import { formatAddress } from "@/lib/utils";
import { EXPLORERS } from "@/lib/web3-config";

export default function MarketplacePage() {
  const { mints } = useMintStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(mints.map((m) => m.category)))];

  const filtered = mints.filter((m) => {
    const q = query.toLowerCase();
    const matchQ =
      m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    const matchC = category === "all" || m.category === category;
    return matchQ && matchC;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            NFT <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-white/40">3D NFTs you mint with this app appear here</p>
        </motion.div>

        <div className="glass rounded-xl p-4 mb-8 border border-white/5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search your minted NFTs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide items-center">
              <SlidersHorizontal className="w-4 h-4 text-white/30 shrink-0" />
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-all ${
                    category === c
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "bg-white/5 text-white/50 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((m, i) => (
              <motion.div
                key={m.txHash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all group"
              >
                <div className="aspect-square bg-gradient-to-br from-violet-900/30 via-fuchsia-900/20 to-cyan-900/30 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-violet-400/60 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">{m.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {m.category}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mb-3 line-clamp-2">{m.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>{formatAddress(m.owner)}</span>
                    <a
                      href={`${EXPLORERS[m.chainId] ?? "https://etherscan.io"}/tx/${m.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300"
                    >
                      Tx <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-2xl border border-dashed border-white/10">
            <Sparkles className="w-12 h-12 text-violet-400/50 mx-auto mb-4" />
            <p className="text-white/50 text-lg mb-2">
              {mints.length === 0 ? "No NFTs minted yet" : "Nothing matches your search"}
            </p>
            <p className="text-white/30 text-sm mb-6">
              {mints.length === 0
                ? "Be the first — build a 3D scene and mint it on-chain."
                : "Try a different keyword or category."}
            </p>
            {mints.length === 0 && (
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Create &amp; Mint
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
