export const GEMINI_CLIENT_ID = process.env.NEXT_PUBLIC_GEMINI_CLIENT_ID;
export const COINBASE_CLIENT_ID = process.env.NEXT_PUBLIC_COINBASE_CLIENT_ID;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const { SLACK_WEBHOOK_URL } = process.env;

// Gotcha, some tools call mainnet 'ethereum', others call it 'mainnet'
// rexpects mainnet, sepolia, etc
export type NetworkNames = 'mainnet' | 'sepolia' | 'base';
export const NETWORK: NetworkNames =
  (process.env.NEXT_PUBLIC_NETWORK as NetworkNames) || 'sepolia';
export const INFURA_APIKEY = process.env.NEXT_PUBLIC_INFURA_APIKEY || '';
export const THIRDWEB_CLIENTID =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID || '';
export const ZERODEV_PROJECT_ID =
  process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || '';
export const PAYMENT_BUFFER = process.env.NEXT_PUBLIC_PAYMENT_BUFFER || 5;

// Gotcha, some tools call mainnet 'ethereum', others call it 'mainnet'
// returns ethereum, sepolia, etc
type BlockchainNames = 'ethereum' | 'sepolia' | 'base';
export const BLOCKCHAIN: BlockchainNames =
  NETWORK === 'mainnet' ? 'ethereum' : NETWORK;

let demoMode = false;
let sessionFlag = false;
if (typeof window !== 'undefined') {
  if (sessionStorage?.getItem('IS_DEMO_MODE') === 'true') {
    sessionFlag = true;
  } else {
    const params = new URLSearchParams(window.location.search);
    demoMode = !!params.get('demo_mode');
    if (demoMode) {
      sessionStorage.setItem('IS_DEMO_MODE', 'true');
      // eslint-disable-next-line no-console
      console.log('DEMO MODE ENABLED');
    }
  }
}
export const IS_DEMO_MODE =
  process.env.NEXT_PUBLIC_IS_DEMO_MODE === 'false' || demoMode || sessionFlag;

export const DYNAMIC_PROJECT_ID = process.env.NEXT_PUBLIC_DYNAMIC_PROJECT_ID;
