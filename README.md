# NFTVerse — 3D NFT Creation & Marketplace

NFTVerse is a **3D-first NFT platform** for creating, viewing, minting, and showcasing original 3D assets with a crypto wallet. The goal is a real spatial creation experience, not a page full of placeholder NFTs.

## What NFTVerse is

**Create → preview → connect wallet → mint → own → showcase.**

The experience is built around a real-time 3D Creator Studio using React Three Fiber, with an ERC-721 minting path for the existing NFTVerse Sepolia deployment.

## Core experience

- **3D Creator Studio:** cube, sphere, cylinder, cone, torus, torus knot and additional procedural primitives.
- **Materials:** standard, physical, glass, metal and neon-style looks.
- **Spatial editing:** select objects, move/transform them, change scale/rotation, and edit color.
- **Real-time 3D preview:** orbit around the scene and inspect the work before minting.
- **Wallets:** RainbowKit + wagmi + viem for MetaMask, WalletConnect, Coinbase Wallet and other supported wallets.
- **Real minting:** ERC-721 minting through the already-deployed NFTVerse contract on Sepolia.
- **NFT metadata:** creator scene data is converted into NFT metadata for the mint flow.
- **Marketplace:** designed around NFTs actually minted through NFTVerse, with no fake demo collection.
- **Explorer links:** transactions and tokens can be traced on the relevant blockchain explorer.
- **Quest/mobile friendly:** large controls, responsive layouts, and a 3D-first interface.
- **Visual direction:** futuristic dark UI, glass panels, gradients, spatial lighting and subtle motion.

## Existing Sepolia contract

**NFTVerse / NVT**

`0x02f93c7547309ca50EEAB446DaEBE8ce8E694cBb`

This is the existing deployment used by the project. **Do not deploy another contract just to run the Sepolia version of NFTVerse.**

The address is configured in `src/lib/web3-config.ts`.

## Important storage note

The 3D scene and NFT metadata must ultimately live at a durable URL. The current creator flow can produce metadata for the on-chain mint path, while the production roadmap is to move large `.glb` / `.gltf` assets and metadata to decentralized storage such as IPFS or Arweave. The blockchain token should reference that durable metadata rather than relying on a GitHub Pages build forever.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` if you want to provide a WalletConnect project ID:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## GitHub Pages

NFTVerse is configured as a static Next.js export for GitHub Pages under `/nftverse`.

```bash
npm run build
```

The GitHub Actions workflow in `.github/workflows/pages.yml` builds `dist/` and deploys it to GitHub Pages.

## Roadmap

1. Make the GitHub Pages build and 3D UI rock-solid.
2. Test the existing Sepolia contract end-to-end.
3. Store real 3D assets and metadata on IPFS/Arweave.
4. Index minted tokens for the marketplace.
5. Add collections, creator profiles and richer discovery.
6. Add additional chain deployments only when they are actually deployed and tested.
7. Move to mainnet only after the full testnet flow is reliable.

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Three.js · React Three Fiber · drei · wagmi v2 · RainbowKit v2 · viem · Zustand · Framer Motion · lucide-react
