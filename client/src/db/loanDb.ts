/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';
import axiosInterceptor from '@/utility/axiosInterceptor';
import { BACKEND_URL, NETWORK } from '@/constants/env';
import logger from '@/utility/logger';

const assetDecimals: any = {
  ETH: 18,
};

export const useLoanDB = () => {
  const finalizeLoan = async (
    user: string,
    transactionHash: string,
    lendingProtocol: string,
    loanActive: boolean,
    loanAsset: string,
    outstandingBalance: number,
    collateral: number,
    exist: boolean,
  ) => {
    try {
      // TODO update ui execution code and math to use wei, until displayed to user
      const collateralWei = ethers.utils.parseEther(collateral.toString());
      // console.log({
      //   deci: assetDecimals?.[loanAsset] || 0,
      //   loanAsset,
      //   assetDecimals,
      // });
      const loanObject = {
        user,
        transaction_hash: transactionHash,
        lending_protocol: lendingProtocol,
        protocol_chain: NETWORK,
        loan_active: Number(loanActive),
        loan_asset: loanAsset,
        outstanding_balance: outstandingBalance,
        collateral: collateralWei.toString(),
        collateral_decimals: assetDecimals?.[loanAsset] || 0,
        exist,
      };

      const response = await axiosInterceptor.post(
        `${BACKEND_URL}/add`,
        loanObject,
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      logger(JSON.stringify(error, null, 2), 'error');
      return null;
    }
  };

  const updateLoan = (
    updateType: string,
    id: number,
    loan: number,
    active: boolean,
    collateral: number,
    interest: number,
    txHash: string,
  ) => {
    // TODO update ui execution code and math to use wei, until displayed to user
    const collateralWei = ethers.utils.parseEther(collateral.toString());

    const updateObject =
      updateType === 'repay'
        ? {
            updateType,
            id,
            loan_active: Number(active),
            outstanding_balance: loan,
            interest,
            transaction_hash: txHash,
          }
        : {
            updateType,
            id,
            collateral: collateralWei.toString(),
            transaction_hash: txHash,
          };
    axiosInterceptor.post(`${BACKEND_URL}/update`, updateObject);
  };

  const getLoanData = async (user: string) => {
    if (user) {
      try {
        const response = await axiosInterceptor.get(
          // TODO use request body for user id
          `${BACKEND_URL}/loans?user=${user}`,
        );

        // TODO update ui execution code and math to use wei, until displayed to user
        const loanDataWithEthValues = response.data.map((loan: any) => ({
          ...loan,
          principal_balance: Number(loan?.principal_balance),
          outstanding_balance: Number(loan?.outstanding_balance),
          interest: Number(loan?.interest),
          collateral: ethers.utils.formatEther(loan?.collateral),
        }));
        return loanDataWithEthValues;
      } catch (error) {
        logger(JSON.stringify(error, null, 2), 'error');
        return null;
      }
    }
  };

  const getAverageAPR = async (openDate: Date, chain: string = NETWORK) => {
    try {
      const response = await axiosInterceptor.get(
        `${BACKEND_URL}/average_apr?openDate=${openDate}&network=${chain}`,
      );
      return response.data?.average_apr;
    } catch (error) {
      logger(JSON.stringify(error, null, 2), 'error');
      return null;
    }
  };

  const getMonthAverageAPR = async (chain: string = NETWORK) => {
    try {
      const response = await axiosInterceptor.get(
        `${BACKEND_URL}/average_apr?openDate=month&network=${chain}`,
      );
      return response.data?.average_apr;
    } catch (error) {
      logger(JSON.stringify(error, null, 2), 'error');
      return null;
    }
  };

  const getThreeMonthAverageAPR = async (chain: string = NETWORK) => {
    try {
      const response = await axiosInterceptor.get(
        `${BACKEND_URL}/average_apr?openDate=threemonth&network=${chain}`,
      );
      return response.data?.average_apr;
    } catch (error) {
      logger(JSON.stringify(error, null, 2), 'error');
      return null;
    }
  };

  const getYearAverageAPR = async (chain: string = NETWORK) => {
    try {
      const response = await axiosInterceptor.get(
        `${BACKEND_URL}/average_apr?openDate=year&network=${chain}`,
      );
      return response.data?.average_apr;
    } catch (error) {
      logger(JSON.stringify(error, null, 2), 'error');
      return null;
    }
  };

  const getYearAvgRewardRate = async (chain: string = NETWORK) => {
    try {
      const response = await axiosInterceptor.get(
        `${BACKEND_URL}/average_reward_rate?openDate=year&network=${chain}`,
      );
      return response.data.length > 0
        ? response.data[0].average_reward_rate
        : null;
    } catch (error) {
      logger(JSON.stringify(error, null, 2), 'error');
      return null;
    }
  };

  const getRewardRate = async (chain: string = NETWORK) => {
    try {
      const response = await axiosInterceptor.get(
        `${BACKEND_URL}/reward_rate?network=${chain}`,
      );
      // TODO this is wrong ==> Current Rate 6,088.57%
      // console.log({ response });
      return response.data?.borrow_reward_rate;
    } catch (error) {
      logger(JSON.stringify(error, null, 2), 'error');
      return null;
    }
  };

  return {
    finalizeLoan,
    updateLoan,
    getLoanData,
    getAverageAPR,
    getMonthAverageAPR,
    getThreeMonthAverageAPR,
    getYearAverageAPR,
    getYearAvgRewardRate,
    getRewardRate,
  };
};
