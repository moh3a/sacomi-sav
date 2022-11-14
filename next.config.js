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
    WS_URL: process.env.WS_URL,
    APP_URL: `http://${
      process.env.HOST ?? "localhost" + ":" + process.env.PORT ?? "3000"
    }`,
  },
};

module.exports = nextConfig;
