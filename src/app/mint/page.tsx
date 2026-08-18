"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Sparkles, Tag, FileText, DollarSign, Image as ImageIcon, Layers, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CONTRACT_ABI, CONTRACT_ADDRESSES, EXPLORERS, MINT_FEE_WEI } from "@/lib/web3-config";
import { useCreatorStore, useMintStore } from "@/stores/nft-store";
import { useToast } from "@/components/ui/Toaster";

const CATEGORIES = ["3D Art", "Abstract", "Generative", "Characters", "Landscapes", "Architecture"];

export default function MintPage() {
  const { address, chainId, isConnected } = useAccount();
  const { scene } = useCreatorStore();
  const { addMint } = useMintStore();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.1");
  const [category, setCategory] = useState("3D Art");
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const contractAddress = chainId ? CONTRACT_ADDRESSES[chainId] : undefined;
  const isSepolia = chainId === 11155111;

  const handleMint = () => {
    if (!isConnected || !address) return addToast("Connect your wallet first.", "warning");
    if (!scene.shapes.length) return addToast("Your scene is empty. Go back to Creator Studio and add a 3D object.", "warning");
    if (!name.trim() || !description.trim()) return addToast("Add an NFT name and description.", "warning");
    if (!contractAddress) return addToast("Switch your wallet to Sepolia. NFTVerse already has its contract deployed there.", "error");
    const metadataURI = "data:application/json," + encodeURIComponent(JSON.stringify({ name, description, category, price, scene, createdWith: "NFTVerse Creator Studio", version: 1 }));
    writeContract({ address: contractAddress, abi: CONTRACT_ABI, functionName: "mint", args: [address, metadataURI], value: BigInt(MINT_FEE_WEI) });
  };

  useEffect(() => {
    if (isSuccess && hash && address && chainId) {
      addMint({ tokenId: "", txHash: hash, name, description, category, price, chainId, owner: address, createdAt: new Date().toISOString() });
      addToast("3D NFT minted successfully!", "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const explorer = chainId ? EXPLORERS[chainId] : undefined;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mint Your <span className="gradient-text">3D NFT</span></h1>
          <p className="text-white/40">Turn your Creator Studio scene into an on-chain NFT.</p>
        </motion.div>
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-violet-900/20 to-cyan-900/20 border border-white/5 flex items-center justify-center"><div className="text-center"><Layers className="w-12 h-12 text-violet-400 mx-auto mb-2" /><p className="text-white/40 text-sm">{scene.shapes.length} 3D shapes ready</p></div></div>
          {!isConnected && <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm"><AlertTriangle className="w-5 h-5 shrink-0" />Connect your wallet to mint.</div>}
          {isConnected && !isSepolia && <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm"><AlertTriangle className="w-5 h-5 shrink-0" />Switch your wallet to Sepolia. NFTVerse already has its contract deployed there. You do not need to deploy another contract.</div>}
          {isConnected && isSepolia && contractAddress && <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm"><CheckCircle2 className="w-5 h-5 shrink-0" />NFTVerse Sepolia contract is connected and ready.</div>}
          <div className="space-y-4">
            <div><label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2"><Tag className="w-4 h-4" />NFT Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cosmic Crystal #001" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50" /></div>
            <div><label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2"><FileText className="w-4 h-4" />Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your 3D creation..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 resize-none" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2"><DollarSign className="w-4 h-4" />Display Price (ETH)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} step="0.001" min="0" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50" /></div><div><label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2"><ImageIcon className="w-4 h-4" />Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50">{CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>)}</select></div></div>
            <p className="text-xs text-white/30">Network: Sepolia · Mint fee: 0.01 ETH + gas · Display price is metadata only until marketplace sales are implemented.</p>
          </div>
          <button onClick={handleMint} disabled={isPending || isConfirming || !scene.shapes.length || !isSepolia} className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"><Sparkles className="w-5 h-5" />{isPending ? "Check wallet..." : isConfirming ? "Confirming on Sepolia..." : "Mint 3D NFT"}</button>
          {hash && explorer && <div className="p-4 rounded-xl bg-white/5 border border-white/10"><p className="text-white/40 text-sm mb-1">Transaction</p><a href={`${explorer}/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-violet-400 text-sm font-mono break-all hover:underline inline-flex items-center gap-1">{hash}<ExternalLink className="w-3.5 h-3.5" /></a></div>}
          {isSuccess && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center">3D NFT minted successfully. View the transaction above or open Marketplace.</div>}
        </div>
      </div>
    </div>
  );
}
