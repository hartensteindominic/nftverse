/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProduction ? "/nftverse" : "",
  assetPrefix: isProduction ? "/nftverse/" : undefined,
  distDir: process.env.BUILD_DIST_DIR || "dist",
  images: { unoptimized: true },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    const ignore = [
      "@x402/evm", "@x402/fetch", "@coinbase/cdp-sdk", "@base-org/account",
      "@gemini-wallet/core", "porto", "@safe-global/safe-apps-sdk",
      "@safe-global/safe-apps-provider", "@metamask/sdk",
    ];
    for (const mod of ignore) config.resolve.alias[mod] = false;
    return config;
  },
};

export default nextConfig;
