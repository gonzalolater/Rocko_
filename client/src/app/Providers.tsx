'use client';

import React from 'react';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Base, Ethereum, Sepolia } from '@thirdweb-dev/chains';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
// import { SdkViewSectionType, SdkViewType } from '@dynamic-labs/sdk-api';
import {
  BLOCKCHAIN,
  DYNAMIC_PROJECT_ID,
  THIRDWEB_CLIENTID,
} from '@/constants/env';
import WagmiWrapper from './WagmiWrapper';
import { RockoWalletProvider } from './RockoWalletProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_PROJECT_ID || '',
        walletConnectors: [EthereumWalletConnectors],
        // hideEmbeddedWalletTransactionUIs: true,
        // overrides: {
        //   views: [
        //     {
        //       type: SdkViewType.Login,
        //       sections: [
        //         {
        //           type: SdkViewSectionType.Email,
        //         },
        //         {
        //           type: SdkViewSectionType.Separator,
        //           label: 'Or',
        //         },
        //         {
        //           type: SdkViewSectionType.Social,
        //           defaultItem: 'google',
        //         },
        //       ],
        //     },
        //   ],
        // },
      }}
    >
      <ThirdwebProvider
        activeChain={BLOCKCHAIN}
        supportedChains={[Ethereum, Sepolia, Base]}
        clientId={THIRDWEB_CLIENTID}
      >
        <RockoWalletProvider>
          <WagmiWrapper>{children}</WagmiWrapper>
        </RockoWalletProvider>
      </ThirdwebProvider>
    </DynamicContextProvider>
  );
}
