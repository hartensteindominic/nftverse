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

export const CONTRACT_ADDRESSES: Record<number, `0x${string}` | undefined> = {
  [sepolia.id]: "0x02f93c7547309ca50EEAB446DaEBE8ce8E694cBb",
  [polygonAmoy.id]: undefined,
  [baseSepolia.id]: undefined,
  [mainnet.id]: undefined,
  [polygon.id]: undefined,
  [base.id]: undefined,
};

// Populated only after the upgraded marketplace contract is deployed.
export const MARKETPLACE_ADDRESSES: Record<number, `0x${string}` | undefined> = {
  [sepolia.id]: undefined,
  [polygonAmoy.id]: undefined,
  [baseSepolia.id]: undefined,
  [mainnet.id]: undefined,
  [polygon.id]: undefined,
  [base.id]: undefined,
};

export const MINT_FEE_WEI = "10000000000000000";

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

export const MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "address payable", name: "recipient", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "list",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getListing",
    outputs: [
      { internalType: "address", name: "seller", type: "address" },
      { internalType: "uint128", name: "price", type: "uint128" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawProceeds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "pendingWithdrawals",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFeeBps",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "creatorRoyaltyBps",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "seller", type: "address" },
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "platformFee", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "creatorRoyalty", type: "uint256" },
    ],
    name: "Sold",
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
