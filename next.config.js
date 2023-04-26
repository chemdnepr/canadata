/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 240,
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    PROTOCOL: "http",
    HOST: "localhost",
    PORT: "3000",
    DATABASE_URL: "mysql://chemdnepr:@bagirA2022@localhost:3306/canadata?schema=public",
    AUTH0_SECRET: "9541183104bdb916cb20518d0d7d6a1da31267159877688c548f6dc530092767",
    AUTH0_BASE_URL: "https://pretest.me",
    AUTH0_ISSUER_BASE_URL: "https://canadata.us.auth0.com",
    AUTH0_CLIENT_ID: "HIlFzKwATvpla9yTF3DHXGHFqcwABPFX",
    AUTH0_CLIENT_SECRET: "lySN07Q6Q0KameHdE_-my0TPBekyprI-GPh6P7fRptsVt1YipWi1dAtmPSUZsRME",
    AUTH0_HOOK_SECRET: "f7816b7827299c7404cd253b297cb6d843899974fdba7eae433beede4d758f6d"
  },
  i18n: {
    /**
     * Provide the locales you want to support in your application
     */
    locales: ["en", "ua"],
    /**
     * This is the default locale you want to be used when visiting
     * a non-locale prefixed path.
     */
    defaultLocale: "en",    
    localeDetection: false,
  }
}

module.exports = nextConfig
