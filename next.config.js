/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Account deletion moved out of the dashboard so it works without signing in
      // (App Store review). Redirects run before middleware, so old app links skip the login check.
      {
        source: '/dashboard/settings/delete-account',
        destination: '/delete-account',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.magicpatterns.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '4000',
      },
      {
        protocol: 'https',
        hostname: 'l360images.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'lesson360-general-images.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
};

module.exports = nextConfig;