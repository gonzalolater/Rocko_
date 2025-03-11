//
//
//
//
//
// DEPRECATED !!!!!!!!!!!!!!!!!!
//
// This hook is deprecated and should not be used.
//
// Use the `useRockoWalletProvider` hook instead.

import { useRockoWalletProvider } from '@/app/RockoWalletProvider';

// eslint-disable-next-line import/prefer-default-export
export const useRockoWallet = () => {
  const {
    publicClient,
    rockoWalletClient,
    setKernelClientZeroDev,
    rockoWalletAddress,
    bundlerClient,
    eoaWallet,
  } = useRockoWalletProvider();

  return {
    publicClient,
    rockoWalletClient,
    setKernelClientZeroDev,
    rockoWalletAddress,
    bundlerClient,
    eoaWallet,
  };
};
