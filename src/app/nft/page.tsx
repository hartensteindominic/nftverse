"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Heart,
  Info,
  Maximize2,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import { useMintStore } from "@/stores/nft-store";
import { formatAddress } from "@/lib/utils";
import { EXPLORERS } from "@/lib/web3-config";
import { useToast } from "@/components/ui/Toaster";

const Scene3D = dynamic(() => import("@/components/3d/Scene3D").then((m) => m.Scene3D), { ssr: false });
const NFTModel = dynamic(() => import("@/components/3d/NFTModel").then((m) => m.NFTModel), { ssr: false });

function NFTDetail() {
  const params = useSearchParams();
  const tx = params.get("tx");
  const { mints } = useMintStore();
  const { addToast } = useToast();
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const mint = mints.find((m) => m.txHash === tx);

  const rarity = useMemo(() => {
    const value = mint?.name?.length ?? 0;
    if (value % 7 === 0) return "Legendary";
    if (value % 5 === 0) return "Epic";
    if (value % 3 === 0) return "Rare";
    return "Uncommon";
  }, [mint?.name]);

  if (!mint) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Sparkles className="w-10 h-10 text-violet-400" />
        <p className="text-white/50 text-xl">NFT not found</p>
        <Link href="/marketplace" className="text-violet-400 hover:text-violet-300">Back to marketplace</Link>
      </div>
    );
  }

  const explorer = EXPLORERS[mint.chainId];
  const explorerUrl = explorer ? `${explorer}/tx/${mint.txHash}` : null;

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: mint.name, text: `Check out ${mint.name} on NFTVerse`, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
      addToast("Collectible link ready to share", "success");
    } catch {
      addToast("Share cancelled", "info");
    }
  };

  const copyTx = async () => {
    try {
      await navigator.clipboard.writeText(mint.txHash);
      setCopied(true);
      addToast("Transaction hash copied", "success");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      addToast("Could not copy transaction hash", "error");
    }
  };

  const collect = () => {
    addToast("Connect your wallet to collect this piece", "info");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,.18),transparent_48%),linear-gradient(145deg,#0b0714,#07070b)] shadow-2xl ${fullscreen ? "fixed inset-4 z-50 lg:inset-8" : "aspect-square"}`}
          >
            <Scene3D variant="nft">
              <NFTModel type="crystal" color="#8b5cf6" secondaryColor="#ec4899" scale={1.5} />
            </Scene3D>
            <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 backdrop-blur-md px-3 py-2 text-xs text-white/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" /> 3D VIEWER
              </div>
              <button onClick={() => setFullscreen((v) => !v)} className="pointer-events-auto w-10 h-10 rounded-full border border-white/10 bg-black/35 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/55 transition-colors" aria-label="Toggle fullscreen viewer">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between pointer-events-none bg-gradient-to-t from-black/55 to-transparent">
              <span className="text-xs text-white/45">Drag to orbit • Scroll to zoom</span>
              <span className="text-xs text-white/45">Interactive 3D</span>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/20">
                <Sparkles className="w-3.5 h-3.5" /> {mint.category}
              </span>
              <button onClick={() => setLiked((v) => !v)} className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-colors ${liked ? "bg-pink-500/15 text-pink-400" : "bg-white/[.03] text-white/45 hover:text-white"}`} aria-label="Like NFT">
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              </button>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">{mint.name}</h1>
              <p className="text-white/45 leading-7">{mint.description || "A unique digital collectible created in the NFTVerse 3D studio."}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><p className="text-[11px] uppercase tracking-wider text-white/30">Rarity</p><p className="mt-1 font-semibold text-violet-300">{rarity}</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><p className="text-[11px] uppercase tracking-wider text-white/30">Network</p><p className="mt-1 font-semibold text-white/80">Chain {mint.chainId}</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><p className="text-[11px] uppercase tracking-wider text-white/30">Token</p><p className="mt-1 font-semibold text-white/80">#{mint.tokenId ?? "—"}</p></div>
            </div>

            <div className="glass rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
                <div className="min-w-0 flex-1"><p className="text-xs text-white/35">Owner</p><p className="text-sm font-medium text-white truncate">{formatAddress(mint.owner)}</p></div>
                <span className="text-xs text-emerald-400">Verified receipt</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10">
              <p className="text-xs uppercase tracking-wider text-white/35 mb-2">Current asking price</p>
              <div className="flex items-end justify-between gap-4 mb-6">
                <p className="text-4xl font-black gradient-text">{mint.price} ETH</p>
                <p className="text-xs text-white/30">Creator-set price</p>
              </div>
              <button onClick={collect} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 transition-all shadow-lg shadow-violet-950/30">
                <Sparkles className="w-5 h-5" /> Collect this 3D NFT
              </button>
              <div className="mt-3 flex justify-center"><ConnectButton showBalance={false} chainStatus="icon" /></div>
            </div>

            <div className="flex gap-3">
              <button onClick={share} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[.03] hover:bg-white/[.07] transition-colors text-white/75 font-medium"><Share2 className="w-4 h-4" /> Share</button>
              <button onClick={copyTx} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[.03] hover:bg-white/[.07] transition-colors text-white/75 font-medium">{copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Tx hash"}</button>
              {explorerUrl && <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[.03] hover:bg-white/[.07] transition-colors text-white/75 font-medium"><ExternalLink className="w-4 h-4" /> Explorer</a>}
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[.015] p-4 flex gap-3 text-sm text-white/35">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-violet-400/70" />
              <p>Ownership and pricing become on-chain when the connected marketplace contract is configured. This page never pretends a local mint receipt is a completed sale.</p>
            </div>

            <div className="flex items-center gap-2 text-white/25 text-xs"><Eye className="w-4 h-4" /> Minted {new Date(mint.createdAt).toLocaleDateString()}</div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default function NFTPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><Sparkles className="w-8 h-8 text-violet-400 animate-pulse" /></div>}>
      <NFTDetail />
    </Suspense>
  );
}
