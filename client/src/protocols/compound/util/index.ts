import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import logger from '@/utility/logger';
import { parseBalance } from '@/utility/utils';
import {
  CometContract,
  CometRewardContract,
  USDCContract,
  WETHContract,
} from '@/constants';
import { networkChainId } from './data';

const WETHABI = require('../../../constants/weth.json');
const COMETABI = require('../../../constants/comet.json');
const USDCABI = require('../../../constants/usdc.json');
const REWARDABI = require('../../../constants/reward.json');

const approveWETH = async ({
  signer,
  chain,
}: {
  signer: any;
  chain: string;
}) => {
  if (!signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const uintMax =
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

  const contract = await sdk.getContract(
    WETHContract[networkChainId(chain)],
    WETHABI,
  );
  try {
    const tx = await contract.call('approve', [
      CometContract[networkChainId(chain)],
      uintMax,
    ]);
    return tx;
  } catch {
    return null;
  }
};

const approveUSDC = async ({
  signer,
  chain,
}: {
  signer: any;
  chain: string;
}) => {
  if (!signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const uintMax =
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

  const contract = await sdk.getContract(
    USDCContract[networkChainId(chain)],
    USDCABI,
  );
  try {
    const tx = await contract.call('approve', [
      CometContract[networkChainId(chain)],
      uintMax,
    ]);
    return tx;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

const depositZeroDevAccount = async ({
  zerodevDepositAccount,
  amount,
  currency,
  chain,
  signer,
}: {
  zerodevDepositAccount: string;
  amount: number | string;
  currency: string;
  chain: string;
  signer: any;
}) => {
  if (!signer || !zerodevDepositAccount || Number(amount) <= 0) return null;

  const sdk = ThirdwebSDK.fromSigner(signer);
  try {
    if (currency === 'ETH') {
      const txResult = await sdk.wallet.transfer(zerodevDepositAccount, amount);
      return txResult;
    }
    const txResult = await sdk.wallet.transfer(
      zerodevDepositAccount,
      amount,
      USDCContract[networkChainId(chain)],
    );
    return txResult;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

const deposit = async ({
  amount,
  signer,
  chain,
}: {
  amount: number | string;
  signer: any;
  chain: string;
}) => {
  if (!signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const contract = await sdk.getContract(
    WETHContract[networkChainId(chain)],
    WETHABI,
  );

  try {
    const tx = await contract.call('deposit', [], {
      value: ethers.utils.parseEther(amount.toString()),
    });
    return tx;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

const wethToETH = async ({
  amount,
  signer,
  chain,
}: {
  amount: number | string;
  signer: any;
  chain: string;
}) => {
  if (!signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const contract = await sdk.getContract(
    WETHContract[networkChainId(chain)],
    WETHABI,
  );

  try {
    const tx = await contract.call('withdraw', [
      ethers.utils.parseEther(amount.toString()),
    ]);
    return tx;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

const addCollateral = async ({
  amount,
  signer,
  chain,
}: {
  amount: number | string;
  signer: any;
  chain: string;
}) => {
  if (!signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );

  try {
    const tx = await contract.call('supply', [
      WETHContract[networkChainId(chain)],
      parseBalance(amount.toString()),
    ]);
    return tx;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

const addLoan = async ({
  amount,
  signer,
  chain,
}: {
  amount: number | string;
  signer: any;
  chain: string;
}) => {
  if (!signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );

  try {
    const tx = await contract.call('supply', [
      USDCContract[networkChainId(chain)],
      parseBalance(amount.toString(), 6),
    ]);
    return tx;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

const borrowLoan = async ({
  amount,
  signer,
  chain,
}: {
  amount: number | string;
  signer: any;
  chain: string;
}) => {
  if (!signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );

  try {
    const tx = await contract.call('withdraw', [
      USDCContract[networkChainId(chain)],
      parseBalance(amount.toString(), 6),
    ]);
    return tx;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

const borrowCollateral = async ({
  amount,
  signer,
  chain,
}: {
  amount: number | string;
  signer: any;
  chain: string;
}) => {
  if (!signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const contract = await sdk.getContract(
    CometContract[networkChainId(chain)],
    COMETABI,
  );

  try {
    const tx = await contract.call('withdraw', [
      WETHContract[networkChainId(chain)],
      parseBalance(amount.toString()),
    ]);
    return tx;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

const claimReward = async ({
  address,
  signer,
  chain,
}: {
  address: string;
  signer: any;
  chain: string;
}) => {
  if (!address || !signer) return;

  const sdk = ThirdwebSDK.fromSigner(signer);
  const contract = await sdk.getContract(
    CometRewardContract[networkChainId(chain)],
    REWARDABI,
  );

  try {
    const tx = await contract.call('claim', [
      CometContract[networkChainId(chain)],
      address,
      true,
    ]);
    return tx;
  } catch (e) {
    logger(JSON.stringify(e, null, 2), 'error');
    return null;
  }
};

export {
  approveWETH,
  approveUSDC,
  deposit,
  wethToETH,
  addCollateral,
  addLoan,
  borrowLoan,
  borrowCollateral,
  claimReward,
  depositZeroDevAccount,
};
