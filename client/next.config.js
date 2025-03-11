/** @type {import('next').NextConfig} */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const NETWORK = process.env.NEXT_PUBLIC_NETWORK;

const connectSrc = [
  BACKEND_URL,
  `https://${NETWORK}.infura.io`,

  // Thirdweb RPC
  `https://${NETWORK === 'mainnet' ? 'ethereum' : NETWORK}.rpc.thirdweb.com`,
  'https://ethereum.rpc.thirdweb.com',
  'https://base.rpc.thirdweb.com',
  'https://sepolia.rpc.thirdweb.com',
  'https://polygon.rpc.thirdweb.com/',

  'https://1.rpc.thirdweb.com',
  'https://11155111.rpc.thirdweb.com',
  'https://8453.rpc.thirdweb.com',

  'bafybeiey4zgbdt7vuydftwmgjrk2jp3o56zznasrivs7zepzaqz3yfglvm.ipfs.cf-ipfs.com',

  'https://ipv6.icanhazip.com',
  'https://ipv4.icanhazip.com',
  'https://api.ipify.org',
  'https://api6.ipify.org',
  'https://backend-vikp.onrender.com',
  'https://broadcast-server.tor.us',
  'wss://broadcast-server.tor.us',

  // This only appears to be called in dev on Seploia
  'https://fittest-ultra-aura.ethereum-sepolia.quiknode.pro',
  'https://meta-aa-provider.onrender.com',
  'https://v0-6-meta-bundler.onrender.com',
  'https://api.coinbase.com',

  // Dynamic
  `https://rpc.${NETWORK}.org`,
  'https://app.dynamicauth.com',
  'https://dynamic-static-assets.com',
  'wss://relay.walletconnect.com',
  // 'https://verify.walletconnect.com',
  'https://rpc.ankr.com',
  'https://api.turnkey.com',
  'https://cloudflare-eth.com',

  // Zero Dev
  'https://rpc.zerodev.app',

  // Coinbase Wallet
  'wss://www.walletlink.org',
];

const frameSrc = [
  'https://verify.walletconnect.org',
  'https://verify.walletconnect.com',
  'https://auth.turnkey.com',
];

const imgSrc = [
  'https://dynamic-static-assets.com',
  'https://demo.dynamic.xyz',
  'https://app.dynamic.xyz',
  'https://iconic.dynamic-static-assets.com',
  'https://lh3.googleusercontent.com',
];

const fontSrc = ['https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'];

const styleSrc = ['https://fonts.googleapis.com'];

const cspHeader = `
    default-src 'self';
    frame-src 'self' ${frameSrc.join(' ')};
    frame-ancestors 'none';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' ${styleSrc.join(' ')};
    img-src 'self' blob: data: ${imgSrc.join(' ')};
    connect-src 'self' ${connectSrc.join(' ')};
    font-src 'self' ${fontSrc.join(' ')};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          // TODO experiment with this to see if weird Download prompt goes away
          // https://linear.app/rocko/issue/ROC-342
          //   {
          //     key: 'Content-Type',
          //     value: 'application/javascript',
          //   },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'app.rocko.co',
          },
        ],
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value:
              'https://app.rocko.co, https://*.testnet.rocko.co, http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
