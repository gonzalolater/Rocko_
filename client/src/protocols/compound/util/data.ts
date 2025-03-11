import * as chains from 'wagmi/chains';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { BigNumber, ethers } from 'ethers';
import { formatBalance } from '@/utility/utils';
import {
  CometContract,
  ChainlinkEthPriceFeed,
  WETHContract,
} from '@/constants';

const COMETABI = require('../../../constants/comet.json');
const BASIC_COMETABI = require('../../../constants/basic_comet.json');

type BlockchainNames = 'ethereum' | 'sepolia' | 'base';

const networkChainId = (chain: string) =>
  (chains as { [key: string]: any })[chain]?.id;

const collateralAssetId = (chain: string) =>
  chain === chains.base.name.toLowerCase() ? 1 : 2;

const getBorrowAPR = async (chain: string): Promise<number> => {
  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);

  const sdk = new ThirdwebSDK(BLOCKCHAIN);

  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );
  const utilization = await contract.call('getUtilization');
  const borrowRate = await contract.call('getBorrowRate', [utilization]);
  const formattedRate = Number(ethers.utils.formatEther(borrowRate));
  const borrowAPR = formattedRate * 60 * 60 * 24 * 365 * 100;

  return borrowAPR;
};

const getETHPrice = async (chain: string): Promise<number> => {
  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);

  const sdk = new ThirdwebSDK(BLOCKCHAIN);

  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );
  const price = await contract.call('getPrice', [
    ChainlinkEthPriceFeed[networkChainId(chain)],
  ]);

  const formattedValue = Number(ethers.utils.formatEther(price)) * 10 ** 10;
  return formattedValue;
};

const getLTV = async (chain: string): Promise<number> => {
  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);

  const sdk = new ThirdwebSDK(BLOCKCHAIN);

  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );

  const assetInfo = await contract.call('getAssetInfo', [
    collateralAssetId(chain),
  ]);

  const LTV = assetInfo.borrowCollateralFactor;
  const formattedValue = Number(ethers.utils.formatEther(LTV));

  return formattedValue;
};

const getThreshold = async (chain: string): Promise<number> => {
  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);

  const sdk = new ThirdwebSDK(BLOCKCHAIN);

  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );
  const assetInfo = await contract.call('getAssetInfo', [
    collateralAssetId(chain),
  ]);
  const threshold = assetInfo.liquidateCollateralFactor;

  const formattedValue = Number(ethers.utils.formatEther(threshold));
  return formattedValue;
};

const getPenalty = async (chain: string): Promise<number> => {
  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);

  const sdk = new ThirdwebSDK(BLOCKCHAIN);

  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );
  const assetInfo = await contract.call('getAssetInfo', [
    collateralAssetId(chain),
  ]);
  const penalty = assetInfo.liquidationFactor;

  const formattedValue = 1 - Number(ethers.utils.formatEther(penalty));
  return formattedValue;
};

// TODO update all remainging functions to use this return type.
// value = is smallest currency unit
// formatted = current formatted return value
export type Balance = {
  value: BigNumber;
  formatted: number;
};

const getBorrowBalanceOf = async ({
  chain,
  rockoWalletAddress,
}: {
  chain: string;
  rockoWalletAddress: any;
}): Promise<Balance> => {
  // console.log('getBorrowBalanceOf', { rockoWalletAddress, chain });
  if (!rockoWalletAddress)
    return {
      value: ethers.BigNumber.from(0),
      formatted: 0,
    };

  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);
  // console.log({ BLOCKCHAIN, chain });
  const sdk = new ThirdwebSDK(BLOCKCHAIN);
  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );

  const value = await contract.call('borrowBalanceOf', [rockoWalletAddress]);
  // console.log('borrowBalanceOf', { value });
  const formattedValue = formatBalance(value, 6, 6);
  console.log('borrowBalanceOf', {
    value,
    valueString: value.toString(),
    formattedValue,
  });
  return {
    value,
    formatted: Number(formattedValue),
  };
};

const getCollateralBalanceOf = async ({
  chain,
  rockoWalletAddress,
}: {
  chain: string;
  rockoWalletAddress: any;
}): Promise<Balance> => {
  if (!rockoWalletAddress)
    return {
      value: ethers.BigNumber.from(0),
      formatted: 0,
    };

  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);

  const sdk = new ThirdwebSDK(BLOCKCHAIN);
  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    BASIC_COMETABI,
  );

  const value = await contract.call('collateralBalanceOf', [
    rockoWalletAddress,
    WETHContract[networkChainId(chain)],
  ]);

  const formattedValue = Number(ethers.utils.formatEther(value));
  return {
    value,
    formatted: Number(formattedValue),
  };
};

const getRewardRate = async (chain: string): Promise<number> => {
  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);

  const sdk = new ThirdwebSDK(BLOCKCHAIN);
  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );
  const value = await contract.call('baseTrackingBorrowSpeed');

  const formattedValue =
    Number(ethers.utils.formatEther(value)) * 365 * 60 * 60 * 24;
  return formattedValue;
};

const getRewardAmount = async ({
  chain,
  rockoWalletAddress,
}: {
  chain: string;
  rockoWalletAddress: any;
}): Promise<number> => {
  if (!rockoWalletAddress) return 0;

  const BLOCKCHAIN: BlockchainNames =
    chain === 'mainnet' ? 'ethereum' : (chain as BlockchainNames);

  const sdk = new ThirdwebSDK(BLOCKCHAIN);

  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );
  const value = await contract.call('userBasic', [rockoWalletAddress]);

  const formattedValue =
    Number(ethers.utils.formatEther(value.baseTrackingAccrued)) * 10 ** 12;
  return formattedValue;
};

const getMinCollateral = async ({
  loan,
  chain,
}: {
  loan: string | number;
  chain: string;
}): Promise<number | string> => {
  if (typeof loan === 'undefined' || Number(loan) === 0) return 'N/A';

  const loanToValue = await getLTV(chain);
  const collateralPrice = await getETHPrice(chain);
  const minCollateral = Number(loan) / loanToValue / collateralPrice;

  return minCollateral;
};

const getLiquidationPrice = async ({
  loan,
  collateral,
  chain,
}: {
  loan: string | number;
  collateral: string | number;
  chain: string;
}): Promise<number | string> => {
  if (
    typeof loan === 'undefined' ||
    Number(loan) === 0 ||
    Number(collateral) === 0
  )
    return 'N/A';

  const threshold = await getThreshold(chain);
  const value = Number(loan) / threshold / Number(collateral);

  return value;
};

const getBuffer = async ({
  loan,
  collateral,
  chain,
}: {
  loan: string | number;
  collateral: string | number;
  chain: string;
}): Promise<number | string> => {
  if (
    typeof loan === 'undefined' ||
    Number(loan) === 0 ||
    Number(collateral) === 0
  )
    return 'N/A';

  const loanToValue = await getLTV(chain);
  const collateralPrice = await getETHPrice(chain);
  const minCollateral = Number(loan) / loanToValue / collateralPrice;
  const newBuffer = (Number(collateral) - minCollateral) / minCollateral;

  return newBuffer;
};

export {
  getBorrowAPR,
  getETHPrice,
  getLTV,
  getThreshold,
  getPenalty,
  getCollateralBalanceOf,
  getBorrowBalanceOf,
  getRewardAmount,
  getRewardRate,
  getLiquidationPrice,
  getBuffer,
  getMinCollateral,
  networkChainId,
};
