/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: process.env.BUILD_DIST_DIR || "dist",
  images: { unoptimized: true },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // wagmi/rainbowkit optional peer deps that we don't use
    const ignore = [
      "@x402/evm", "@x402/fetch", "@coinbase/cdp-sdk", "@base-org/account",
      "@gemini-wallet/core", "porto", "@safe-global/safe-apps-sdk",
      "@safe-global/safe-apps-provider", "@metamask/sdk",
    ];
    for (const mod of ignore) {
      config.resolve.alias[mod] = false;
    }
    return config;
  },
};
export default nextConfig;
