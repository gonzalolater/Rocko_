import { BigNumber, ethers } from 'ethers';
import { encodeFunctionData } from 'viem';
import {
  USDCContract,
  CometContract,
  WETHContract,
  networkChainId,
} from '@/constants';
import { Transaction } from '@/protocols/types';

const WETHABI = require('@/constants/weth.json');
const COMETABI = require('@/constants/comet.json');

const uintMax256 = ethers.constants.MaxUint256;

// Helper functions to build transactions
function createDepositApproveWETH(bigintCollateral: BigNumber): Transaction[] {
  return [
    {
      to: WETHContract[networkChainId],
      value: bigintCollateral,
      data: encodeFunctionData({
        abi: WETHABI,
        functionName: 'deposit',
        args: [],
      }),
    },
    {
      to: WETHContract[networkChainId],
      value: BigNumber.from(0),
      data: encodeFunctionData({
        abi: WETHABI,
        functionName: 'approve',
        args: [CometContract[networkChainId], uintMax256],
      }),
    },
  ];
}

function createSupplyWithdrawalToComp(
  bigintCollateral: BigNumber,
  bigIntLoanAmount: BigNumber,
  address: string,
): Transaction[] {
  return [
    {
      to: CometContract[networkChainId],
      value: BigNumber.from(0),
      data: encodeFunctionData({
        abi: COMETABI,
        functionName: 'supply',
        args: [WETHContract[networkChainId], bigintCollateral],
      }),
    },
    {
      to: CometContract[networkChainId],
      value: BigNumber.from(0),
      data: encodeFunctionData({
        abi: COMETABI,
        functionName: 'withdrawTo',
        args: [address, USDCContract[networkChainId], bigIntLoanAmount],
      }),
    },
  ];
}

function createBorrowMore(
  bigIntLoanAmount: BigNumber,
  address: string,
): Transaction[] {
  return [
    {
      to: CometContract[networkChainId],
      value: BigNumber.from(0),
      data: encodeFunctionData({
        abi: COMETABI,
        functionName: 'withdrawTo',
        args: [address, USDCContract[networkChainId], bigIntLoanAmount],
      }),
    },
  ];
}

export {
  createDepositApproveWETH,
  createSupplyWithdrawalToComp,
  createBorrowMore,
};
