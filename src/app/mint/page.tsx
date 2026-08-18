"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Sparkles, Tag, FileText, DollarSign, Image as ImageIcon, Layers, ExternalLink, AlertTriangle } from "lucide-react";
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

  const handleMint = () => {
    if (!isConnected || !address) {
      addToast("Please connect your wallet first", "warning");
      return;
    }
    if (!name.trim() || !description.trim()) {
      addToast("Please fill in name and description", "warning");
      return;
    }
    if (!contractAddress) {
      addToast("No NFTVerse contract deployed on this network yet. Switch networks or deploy the contract.", "error");
      return;
    }
    // Encode the 3D scene into the token metadata payload.
    const metadataURI =
      "data:application/json," +
      encodeURIComponent(
        JSON.stringify({
          name,
          description,
          category,
          price,
          scene,
          createdWith: "NFTVerse Creator Studio",
        })
      );
    writeContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: "mint",
      args: [address, metadataURI],
      value: BigInt(MINT_FEE_WEI),
    });
  };

  useEffect(() => {
    if (isSuccess && hash && address && chainId) {
      addMint({
        tokenId: "",
        txHash: hash,
        name,
        description,
        category,
        price,
        chainId,
        owner: address,
        createdAt: new Date().toISOString(),
      });
      addToast("NFT minted successfully!", "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const explorer = chainId ? EXPLORERS[chainId] : undefined;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Mint Your <span className="gradient-text">3D NFT</span>
          </h1>
          <p className="text-white/40">Deploy your creation to the blockchain</p>
        </motion.div>

        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-white/5 flex items-center justify-center">
            <div className="text-center">
              <Layers className="w-12 h-12 text-violet-400 mx-auto mb-2" />
              <p className="text-white/40 text-sm">{scene.shapes.length} 3D shapes ready</p>
            </div>
          </div>

          {!isConnected && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Connect your wallet (top right) to enable minting.
            </div>
          )}
          {isConnected && !contractAddress && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              No contract is deployed on the current network. Deploy src/contracts/NFTVerse.sol and add its
              address in src/lib/web3-config.ts, or switch to a configured network.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <Tag className="w-4 h-4" /> NFT Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cosmic Crystal #001"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <FileText className="w-4 h-4" /> Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your 3D masterpiece..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                  <DollarSign className="w-4 h-4" /> Price (ETH)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.001"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                  <ImageIcon className="w-4 h-4" /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-white/30">
              Mint fee: {Number(MINT_FEE_WEI) / 1e18} ETH + gas
            </p>
          </div>

          <button
            onClick={handleMint}
            disabled={isPending || isConfirming}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
          >
            <Sparkles className="w-5 h-5" />
            {isPending ? "Check wallet..." : isConfirming ? "Confirming..." : "Mint NFT"}
          </button>

          {hash && explorer && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/40 text-sm mb-1">Transaction Hash:</p>
              <a
                href={`${explorer}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 text-sm font-mono break-all hover:underline inline-flex items-center gap-1"
              >
                {hash} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center"
            >
              NFT minted successfully — it now appears in your Marketplace.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
