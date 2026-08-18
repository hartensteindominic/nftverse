# NFTVerse Product Build Specification

## Product vision

NFTVerse is a **3D-native NFT creation platform**, not a generic NFT template. A user should be able to open the site, enter a futuristic 3D workspace, create an original scene, connect a crypto wallet, mint the creation as an NFT, and later discover the real NFTs minted through the platform.

## 1. Landing experience
- Futuristic dark/glass visual language.
- Interactive 3D hero with floating geometry and stars.
- Clear primary CTA: Create 3D NFT.
- Secondary CTA: Explore Marketplace.
- Explain the product in plain language: create, customize, mint, own, showcase.
- Never populate the marketplace with invented NFT sales or fake owners.

## 2. 3D Creator Studio
- Real React Three Fiber / Three.js canvas.
- At least nine primitives: cube, sphere, cylinder, cone, torus, icosahedron, octahedron, dodecahedron, torus knot.
- Materials: standard, physical, glass, metal, neon.
- Color controls.
- Select an object.
- Move/rotate/scale selected objects.
- Delete selected object.
- Clear scene.
- Orbit camera controls.
- Responsive controls suitable for desktop, mobile, and Meta Quest browser.
- Persist the working scene locally so navigation does not destroy the creation.
- Make it obvious how many objects are in the scene.
- Prevent minting an empty scene.

## 3. NFT preparation
- Name.
- Description.
- Category.
- Creator wallet.
- Scene JSON describing the 3D composition.
- Preview information.
- Metadata version.
- Future production path for `.glb` / `.gltf` asset files.
- Durable metadata and assets should eventually use IPFS/Arweave rather than GitHub Pages.

## 4. Wallet
- RainbowKit + wagmi + viem.
- Support the wallet providers supplied by RainbowKit.
- Show connected address and current network.
- Make Sepolia the first fully tested chain.
- Never request or store seed phrases/private keys.

## 5. Existing NFTVerse contract
- Use the existing Sepolia deployment:
  `0x02f93c7547309ca50EEAB446DaEBE8ce8E694cBb`
- Do not instruct the user to deploy another contract for Sepolia.
- Mint through the existing ERC-721 contract.
- Pass the generated metadata URI to `mint(to, uri)`.
- Send the contract's required mint fee.
- Wait for transaction confirmation.
- Show the transaction hash and Sepolia explorer link.
- Store the successful mint in the local creator experience until a blockchain indexer is added.

## 6. Marketplace
- No fake/demo NFT cards.
- Empty state when there are no real NFTs available.
- Search and category filters.
- Show creator/owner and chain.
- Link to the real transaction/token explorer.
- Render real 3D previews when durable model assets are available.
- Next architecture step: index `NFTMinted` events and hydrate metadata from the token URI so marketplace content is blockchain-derived rather than localStorage-only.

## 7. NFT detail pages
- 3D viewer.
- Name, description, category.
- Creator and owner wallet.
- Token ID.
- Contract address.
- Network.
- Mint transaction.
- Explorer link.
- Metadata.
- Future: listing/offer/transfer history.

## 8. 3D asset pipeline

Target production pipeline:

`Creator Studio scene -> GLB/GLTF export -> durable storage -> metadata JSON -> token URI -> ERC-721 mint -> indexed marketplace`

The current scene-metadata mint is an interim testnet implementation. Do not claim that a data URI is permanent decentralized 3D storage.

## 9. GitHub Pages
- Static Next.js export.
- Correct `/nftverse` base path.
- Unoptimized Next image configuration.
- GitHub Actions builds `dist/` and deploys Pages.
- Every route must work when loaded directly under `/nftverse/`.
- No server-only code in static pages.

## 10. Quality bar
- No white placeholder deployment.
- No broken routes.
- No fake blockchain success messages.
- No request to redeploy an already-deployed Sepolia contract.
- No fake marketplace inventory.
- Wallet errors must be understandable.
- Transaction failures must be recoverable.
- 3D canvas must fail gracefully if WebGL is unavailable.
- Mobile and Quest controls must remain usable.

## 11. Roadmap

### Phase A: Working foundation
1. GitHub Pages deployment.
2. Landing page.
3. Creator Studio.
4. Wallet connection.
5. Existing Sepolia mint.

### Phase B: Real NFT media
1. GLB export.
2. IPFS/Arweave upload.
3. Metadata upload.
4. Token URI points to durable metadata.
5. 3D marketplace previews.

### Phase C: Real marketplace
1. Index mint events.
2. Token detail pages.
3. Collections.
4. Creator profiles.
5. Search/discovery.
6. Listings and sales only after the marketplace contract supports them.

### Phase D: Scale
1. Additional audited contracts/deployments.
2. Additional chains.
3. Production monitoring.
4. Mainnet only after testnet validation.
