import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet, polygon, arbitrum, base, optimism,
  sepolia, polygonAmoy, baseSepolia,
} from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "NFTVerse",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "nftverse-dev-project",
  chains: [mainnet, polygon, arbitrum, base, optimism, sepolia, polygonAmoy, baseSepolia],
  ssr: false,
});

// Deployed NFTVerse contract addresses per chain (fill in after deployment)
export const CONTRACT_ADDRESSES: Record<number, `0x${string}` | undefined> = {
  [sepolia.id]: undefined,
  [polygonAmoy.id]: undefined,
  [baseSepolia.id]: undefined,
  [mainnet.id]: undefined,
  [polygon.id]: undefined,
  [base.id]: undefined,
};

export const MINT_FEE_WEI = "10000000000000000"; // 0.01 ETH

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "uri", type: "string" },
    ],
    name: "mint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "string", name: "uri", type: "string" },
    ],
    name: "NFTMinted",
    type: "event",
  },
] as const;

export const EXPLORERS: Record<number, string> = {
  [mainnet.id]: "https://etherscan.io",
  [polygon.id]: "https://polygonscan.com",
  [arbitrum.id]: "https://arbiscan.io",
  [base.id]: "https://basescan.org",
  [optimism.id]: "https://optimistic.etherscan.io",
  [sepolia.id]: "https://sepolia.etherscan.io",
  [polygonAmoy.id]: "https://amoy.polygonscan.com",
  [baseSepolia.id]: "https://sepolia.basescan.org",
};
