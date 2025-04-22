module.exports = {
  // Configuração básica do Next.js
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurações específicas para a Vercel
  experimental: {
    serverActions: true,
  },
  
  // Configurações de imagens
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
