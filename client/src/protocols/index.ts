// import { aaveConfig } from './aave';
/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';
import { useSigner } from '@thirdweb-dev/react';
import * as chains from 'wagmi/chains';
import { NETWORK } from '@/constants/env';
import { FLAG_MULTI_CHAIN } from '@/constants/featureFlags';
import { useRockoAccount } from '@/hooks/useRockoAccount';
import { compoundConfig } from './compound';
import { ProtocolConfig } from './types';

export const useProtocolConfig = (): ProtocolConfig[] => {
  const { address: rockoWalletAddress } = useRockoAccount();
  const signer: ethers.Signer | undefined = useSigner();

  // console.log({ rockoWalletAddress });

  const compoundConfigMainnet = compoundConfig({
    contract: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
    chain: 'mainnet',
    chainId: chains.mainnet.id,
    rockoWalletAddress,
    signer,
  });

  const compoundConfigBase = compoundConfig({
    contract: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
    chain: 'base',
    chainId: chains.base.id,
    rockoWalletAddress,
    signer,
  });

  const compoundConfigSepolia = compoundConfig({
    contract: '0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e',
    chain: 'sepolia',
    chainId: chains.sepolia.id,
    rockoWalletAddress,
    signer,
  });

  // eslint-disable-next-line no-nested-ternary
  return NETWORK === 'mainnet'
    ? [compoundConfigMainnet]
    : FLAG_MULTI_CHAIN
      ? [compoundConfigBase, compoundConfigSepolia]
      : [compoundConfigSepolia];
};
