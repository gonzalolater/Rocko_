import { useBalance } from 'wagmi';
import { networkChainId } from '@/constants';
// import { formatEther } from 'viem';
// import { useRockoWallet } from './useRockoWallet';

// type FetchBalanceResult = {
//   decimals: number; // currency decimals, eg 6 or 18
//   formatted: string; // whole unit eg ETH or USDC
//   symbol: string; // ticker
//   value: bigint; // balance in smallest unit
// };

// eslint-disable-next-line import/prefer-default-export
export const useRockoBalance = ({
  address, // wallet address for eth balance
  token = undefined, // include token contract address for token balance
}: {
  address: `0x${string}`;
  token?: `0x${string}` | undefined;
}) => {
  // const { publicClient } = useRockoWallet();

  const { data } = useBalance({
    address,
    token,
    chainId: networkChainId,
    query: {
      // Refetch balance automatically every 30 seconds
      refetchIntervalInBackground: true,
      refetchInterval: 30000,
    },
  });

  return { data };
  // if (token) {
  //   return { data };
  // }
  // const balance = await publicClient.getBalance({
  //   address,
  // });
  // return {
  //   data: {
  //     decimals: 18,
  //     formatted: formatEther(balance),
  //     symbol: 'ETH',
  //     value: balance,
  //   },
  // };

  // const { data } = useBalance({ address, token });
  // console.log('balance', { data });
  // return {
  //   // todo error handling if data is undefined
  //   data: {
  //     decimals: data?.decimals,
  //     formatted: data?.formatted,
  //     symbol: data?.symbol,
  //     value: data?.value,
  //   },
  // };
};
