module.exports = {
  // Configuração básica do Next.js
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurações específicas para a Vercel
  experimental: {
    // Desativando serverActions para compatibilidade com Next.js 14.1.0
    serverActions: false,
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
