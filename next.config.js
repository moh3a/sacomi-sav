/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ROOT: __dirname,
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  publicRuntimeConfig: {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
  },
};

module.exports = nextConfig;
