// next.config.js using ES6 syntax
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Stub out fs module to prevent errors in the browser
      config.resolve.fallback = {
        fs: false, // Ignore the fs module in client-side code,
        net: false,
      };
    }

    return config;
  },
};

export default nextConfig;
