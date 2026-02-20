/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 画像最適化設定
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 環境変数の型安全性チェック
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // experimental features
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
