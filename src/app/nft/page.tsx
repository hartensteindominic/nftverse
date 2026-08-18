"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Eye, Share2, ExternalLink, User, Sparkles } from "lucide-react";
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
  const mint = mints.find((m) => m.txHash === tx);

  if (!mint) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-xl">NFT not found</p>
        <Link href="/marketplace" className="text-violet-400 hover:text-violet-300">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const explorer = EXPLORERS[mint.chainId];

  const share = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => addToast("Link copied to clipboard", "success"))
      .catch(() => addToast("Could not copy link", "error"));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-violet-900/10 to-fuchsia-900/10"
        >
          <Scene3D variant="nft">
            <NFTModel type="crystal" color="#8b5cf6" secondaryColor="#ec4899" scale={1.5} />
          </Scene3D>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-medium border border-violet-500/20 mb-2">
              {mint.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{mint.name}</h1>
            <p className="text-white/40 leading-relaxed">{mint.description}</p>
          </div>

          <div className="glass rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/40">Owner</p>
                <p className="text-sm font-medium text-white">{formatAddress(mint.owner)}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/5">
            <p className="text-white/40 text-sm mb-1">Listed Price</p>
            <p className="text-3xl font-bold gradient-text mb-6">{mint.price} ETH</p>
            <div className="flex gap-3">
              <button
                onClick={share}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl glass border border-white/10 hover:bg-white/10 transition-colors text-white/80 font-medium"
              >
                <Share2 className="w-5 h-5" /> Share
              </button>
              {explorer && (
                <a
                  href={`${explorer}/tx/${mint.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                >
                  <ExternalLink className="w-5 h-5" /> View on Explorer
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/30 text-sm">
            <Eye className="w-4 h-4" />
            Minted {new Date(mint.createdAt).toLocaleDateString()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function NFTPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
        </div>
      }
    >
      <NFTDetail />
    </Suspense>
  );
}
