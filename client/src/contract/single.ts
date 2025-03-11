import { NETWORK } from '@/constants/env';
import { useProtocolConfig } from '@/protocols';
import { ProtocolConfig } from '@/protocols/types';

// eslint-disable-next-line import/prefer-default-export
export const useSingleLoan = () => {
  const {
    getBorrowAPR,
    getETHPrice,
    getLTV,
    getThreshold,
    getPenalty,
    getBorrowBalanceOf,
    getCollateralBalanceOf,
    getRewardRate,
    getRewardAmount,
    tx: {
      addCollateral,
      addLoan,
      approveUSDC,
      approveWETH,
      borrowLoan,
      borrowCollateral,
      claimReward,
      deposit,
      depositZerodevAccount,
      getMinCollateral,
      getLiquidationPrice,
      getBuffer,
      wethToETH,
    },
  } = useProtocolConfig().find((c: ProtocolConfig) => c.chain === NETWORK)!;

  return {
    approveWETH,
    approveUSDC,
    deposit,
    wethToETH,
    addCollateral,
    addLoan,
    borrowLoan,
    borrowCollateral,
    getETHPrice,
    getBorrowAPR,
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
    claimReward,
    depositZerodevAccount,
  };
};
