/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';
import { encodeFunctionData } from 'viem';
import {
  CompTokenContract,
  USDCContract,
  WETHContract,
  networkChainId,
} from '@/constants';
import { parseBalance } from '@/utility/utils';
import { useRockoWallet } from './useRockoWallet';

const WETHABI = require('../constants/weth.json');
const USDCABI = require('../constants/usdc.json');

export const useRockoWalletTransaction = ({
  destination,
  ethBalance,
  wethBalance,
  usdcBalance,
  compBalance,
  setTxHash,
  setConfirmed,
}: any) => {
  const { rockoWalletAddress, rockoWalletClient } = useRockoWallet();

  // const withdrawTokens [
  //   {
  //     to: WETHContract[networkChainId],
  //     value: bigintCollateral,
  //     data: encodeFunctionData({
  //       abi: WETHABI,
  //       functionName: 'deposit',
  //       args: [],
  //     }),
  //   },
  //   {
  //     to: WETHContract[networkChainId],
  //     value: 0,
  //     data: encodeFunctionData({
  //       abi: WETHABI,
  //       functionName: 'approve',
  //       args: [CometContract[networkChainId], uintMax],
  //     }),
  //   },
  // ];

  const withdrawTokens =
    rockoWalletAddress && ethers.utils.isAddress(destination)
      ? [
          {
            to: destination as `0x${string}`,
            data: '0x',
            value: ethBalance,
          },
          {
            to: WETHContract[networkChainId],
            value: 0,
            data: encodeFunctionData({
              abi: WETHABI,
              functionName: 'transfer',
              args: [destination, parseBalance(wethBalance)],
            }),
          },
          {
            to: USDCContract[networkChainId],
            value: 0,
            data: encodeFunctionData({
              abi: USDCABI,
              functionName: 'transfer',
              args: [destination, parseBalance(usdcBalance, 6)],
            }),
          },
          {
            to: CompTokenContract[networkChainId],
            value: 0,
            data: encodeFunctionData({
              abi: WETHABI,
              functionName: 'transfer',
              args: [destination, parseBalance(compBalance)],
            }),
          },
        ]
      : [];
  const batchWithdraw = async () => {
    try {
      console.log('start');
      const txCompleteHash = await rockoWalletClient.sendTransactions({
        transactions: withdrawTokens,
      });

      setTxHash(txCompleteHash);
      setConfirmed(true);
      return txCompleteHash;
    } catch (e) {
      console.log(e);
      setConfirmed(false);
      return null;
    }
  };

  return {
    batchWithdraw,
  };
};
