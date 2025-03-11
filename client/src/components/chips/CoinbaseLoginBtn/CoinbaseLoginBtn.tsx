import { COINBASE_CLIENT_ID, BACKEND_URL } from '@/constants/env';
import generateCSRFCode from '@/utility/generateCSRFCode';

const COINBASE_REDIRECT_URI = `${BACKEND_URL}/cb-callback`;
const COINBASE_SCOPES = [
  'wallet:user:read',
  'wallet:accounts:read',
  'wallet:addresses:read',
  'wallet:transactions:send',
  // 'wallet:transactions:send:bypass-2fa'
].join(',');

const CURRENCY_SELECT: string | string[] = [
  'WBTC',
  'ETH',
  'UNI',
  'COMP',
  'USDC',
].join(',');

const SPEND_LIMIT_AMOUNT = '1'; // need to get app aproved to be more than 1

export default function CoinbaseLoginBtn({
  setConnect,
  setOpenModalFor,
}: {
  setConnect: any;
  setOpenModalFor: any;
}) {
  const handleLogin = async () => {
    if (COINBASE_CLIENT_ID) {
      const csrfToken = await generateCSRFCode();
      sessionStorage.setItem('stateToken', csrfToken);

      const params = new URLSearchParams();
      params.append('state', csrfToken);
      params.append('response_type', 'code');
      params.append('client_id', COINBASE_CLIENT_ID);
      params.append('redirect_uri', COINBASE_REDIRECT_URI);
      params.append('scope', COINBASE_SCOPES);
      if (typeof CURRENCY_SELECT === 'string') {
        params.append('account_currency', CURRENCY_SELECT);
      } else {
        CURRENCY_SELECT.forEach((currency) => {
          params.append('account_currency', currency);
        });
      }
      params.append('meta[send_limit_amount]', SPEND_LIMIT_AMOUNT);

      const authUrl = `https://www.coinbase.com/oauth/authorize?${params.toString()}`;

      if (typeof window !== 'undefined')
        window.open(
          authUrl,
          'Coinbase Oauth',
          'height=600,width=800,left=10,top=10,titlebar=no,toolbar=no,menubar=no,location=no,directories=no,status=no',
        );
      setOpenModalFor && setOpenModalFor('');
      setConnect && setConnect(false);
    }
  };

  return (
    <button
      className="py-[10px] px-6 bg-[#2C3B8D] rounded-full text-sm font-semibold text-white"
      onClick={handleLogin}
    >
      Continue
    </button>
  );
}
