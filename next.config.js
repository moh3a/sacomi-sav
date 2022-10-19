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
    WORK_ENV: process.env.WORK_ENV,
  },
};

module.exports = nextConfig;
