import createNextIntlPlugin from 'next-intl/plugin';

// Point this to your i18n file in src
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // If you had other config options, they go here
};

export default withNextIntl(nextConfig);