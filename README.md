# NFTVerse — 3D NFT Marketplace

Create, mint and showcase **3D NFTs** with real crypto-wallet integration. Built with Next.js, React Three Fiber, wagmi, RainbowKit and an ERC-721 smart contract.

## Features

| Feature | Tech |
| --- | --- |
| 3D hero & viewer | React Three Fiber + drei — floating shapes, stars, orbit controls |
| 3D Creator Studio | 9 primitives, 5 materials (standard / physical / glass / metal / neon), color picker, drag-to-move transform controls |
| Crypto wallet | RainbowKit + wagmi + viem — MetaMask, WalletConnect, Coinbase Wallet, 300+ wallets |
| Multi-chain | Ethereum, Polygon, Arbitrum, Base, Optimism + Sepolia / Amoy / Base Sepolia testnets |
| Real minting | ERC-721 contract with mint fee, enumerable, URI storage, creator tracking |
| Marketplace | Shows NFTs you minted, with search, category filters and explorer links |
| Design | Glassmorphism, gradients, Framer Motion animations |

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your WalletConnect project ID
npm run dev                  # http://localhost:3000
```

Get a free WalletConnect project ID at https://cloud.walletconnect.com

## Deploying the contract

1. Open `src/contracts/NFTVerse.sol` in [Remix](https://remix.ethereum.org) (OpenZeppelin imports resolve automatically).
2. Compile with Solidity 0.8.20+, deploy with constructor args e.g. `"NFTVerse", "NVT"`.
3. Add the deployed address to `CONTRACT_ADDRESSES` in `src/lib/web3-config.ts` for that chain.

Until a contract address is configured for the connected network, the Mint page shows a clear notice instead of failing.

## Build

```bash
npm run build   # static export to dist/
```

The site is fully static (`next export`) — host `dist/` anywhere (GitHub Pages, Vercel, Netlify, IPFS).

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · three.js / React Three Fiber · wagmi v2 · RainbowKit v2 · zustand · Framer Motion · lucide-react
