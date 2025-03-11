import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRockoWallet } from './useRockoWallet';

// eslint-disable-next-line import/prefer-default-export
export const useRockoAccount = () => {
  const { user } = useDynamicContext();
  const { rockoWalletAddress } = useRockoWallet();
  const address = rockoWalletAddress;
  const isConnected = !!address && !!user;
  // console.log('we only use. isConnected: boolean means we are logged in', {
  //   address: rockoWalletAddress, // rocko wallet address
  //   isConnected, // is logged in boolean
  // });
  return { user, address, isConnected };
};
