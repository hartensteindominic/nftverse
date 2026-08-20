"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, ExternalLink, Cuboid, ShieldCheck } from "lucide-react";
import { useMintStore } from "@/stores/nft-store";
import { formatAddress } from "@/lib/utils";
import { EXPLORERS, MARKETPLACE_ADDRESSES } from "@/lib/web3-config";
import { Scene3D } from "@/components/3d/Scene3D";
import { NFTModel } from "@/components/3d/NFTModel";

const MODEL_TYPES = ["crystal", "cube", "sphere", "helix"] as const;
const COLORS = [
  ["#8b5cf6", "#ec4899"],
  ["#22d3ee", "#6366f1"],
  ["#f59e0b", "#ef4444"],
  ["#34d399", "#8b5cf6"],
];

type ModelType = (typeof MODEL_TYPES)[number];

function Preview3D({ index, category }: { index: number; category?: string }) {
  const typeFromCategory = category?.toLowerCase().includes("crystal")
    ? "crystal"
    : category?.toLowerCase().includes("cube")
      ? "cube"
      : category?.toLowerCase().includes("helix")
        ? "helix"
        : category?.toLowerCase().includes("sphere")
          ? "sphere"
          : MODEL_TYPES[index % MODEL_TYPES.length];
  const [color, secondaryColor] = COLORS[index % COLORS.length];

  return (
    <div className="absolute inset-0">
      <Scene3D variant="nft" autoRotate>
        <NFTModel type={typeFromCategory as ModelType} color={color} secondaryColor={secondaryColor} scale={1.05} />
      </Scene3D>
    </div>
  );
}

export default function MarketplacePage() {
  const { mints } = useMintStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(mints.map((m) => m.category).filter(Boolean)))],
    [mints]
  );

  const filtered = mints.filter((m) => {
    const q = query.toLowerCase();
    const matchQ = m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    const matchC = category === "all" || m.category === category;
    return matchQ && matchC;
  });

  const marketplaceLive = Object.values(MARKETPLACE_ADDRESSES).some(Boolean);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-4">
                <Cuboid className="w-3.5 h-3.5" />
                3D NFT GALLERY
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
                NFT <span className="gradient-text">Marketplace</span>
              </h1>
              <p className="text-white/40">Every collectible gets a living 3D preview. Spin it. Inspect it. Own it.</p>
            </div>
            <div className="glass rounded-xl px-4 py-3 border border-white/5 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {marketplaceLive ? "On-chain trading enabled" : "Trading engine ready for deployment"}
              </div>
            </div>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((m, i) => (
              <motion.article
                key={m.txHash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/40 transition-all group shadow-2xl shadow-violet-950/10"
              >
                <div className="relative aspect-square bg-gradient-to-br from-violet-950/70 via-fuchsia-950/30 to-cyan-950/50 overflow-hidden">
                  <Preview3D index={i} category={m.category} />
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur text-[10px] font-bold tracking-wider text-white border border-white/10">
                      3D
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-violet-500/20 backdrop-blur text-[10px] font-bold tracking-wider text-violet-200 border border-violet-400/20">
                      {m.category || "COLLECTIBLE"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-[10px] text-white/60 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      DRAG TO ROTATE
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-semibold truncate">{m.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5 shrink-0">
                      #{i + 1}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mb-4 line-clamp-2 min-h-8">{m.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>{formatAddress(m.owner)}</span>
                    <a
                      href={`${EXPLORERS[m.chainId] ?? "https://etherscan.io"}/tx/${m.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300"
                    >
                      On-chain <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-2xl border border-dashed border-white/10">
            <div className="w-28 h-28 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-violet-400/70" />
            </div>
            <p className="text-white/70 text-lg font-semibold mb-2">
              {mints.length === 0 ? "Your 3D gallery is waiting" : "Nothing matches your search"}
            </p>
            <p className="text-white/30 text-sm mb-6 max-w-md mx-auto">
              {mints.length === 0
                ? "Build a fun 3D object in the Creator Studio and mint it on-chain. It will automatically appear here."
                : "Try a different keyword or category."}
            </p>
            {mints.length === 0 && (
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all"
              >
                <Cuboid className="w-5 h-5" />
                Create 3D NFT
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
