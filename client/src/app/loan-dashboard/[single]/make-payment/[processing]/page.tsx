/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getBalance, waitForTransactionReceipt } from 'wagmi/actions';
import { useAddress } from '@thirdweb-dev/react';
import { encodeFunctionData } from 'viem';
import LoanComplete from '@/components/chips/LoanComplete/LoanComplete';
import CircleProgressBar from '@/components/chips/CircleProgressBar/CircleProgressBar';
import ModalContainer from '@/components/chips/ModalContainer/ModalContainer';
import StatusSuccess from '@/assets/StatusSuccess.png';
import { PAYMENT_BUFFER } from '@/constants/env';
import { useSingleLoan } from '@/contract/single';
import { useLoanDB } from '@/db/loanDb';
import { useUserDB } from '@/db/userDb';
import {
  CometContract,
  CometRewardContract,
  USDCContract,
  networkChainId,
} from '@/constants';
import { useUserInfo } from '@/hooks/useUserInfo';
import { etherscanLink, parseBalance } from '@/utility/utils';
import { useCompPrice } from '@/hooks/usePrice';
import logger from '@/utility/logger';
import transactionComp from '@/utility/transactionComp';
// import { useProtocolConfig } from '@/protocols';
// import { ProtocolConfig } from '@/protocols/types';
import { useRepayFull, useRepaySome } from '@/protocols/compound/util/batch';
import { useRockoBalance } from '@/hooks/useRockoBalance';
import { wagmiConfig } from '@/app/WagmiWrapper';
import { useRockoWallet } from '@/hooks/useRockoWallet';
import { Balance } from '@/protocols/compound/util/data';
import { ethers } from 'ethers';
// import { useRockoNetwork } from '@/hooks/useRockoNetwork';

const USDCABI = require('../../../../../constants/usdc.json');

interface DoneTracker {
  step: string;
}

function Processing() {
  const { single: loanIndex } = useParams(); //! by using this hook get the URL parameter
  const router = useSearchParams(); //! use the hooks for getting the URL parameters
  const paymentMethod = router.get('method') || '';
  const payment = parseFloat(router.get('payment') || '0'); //! get the URL parameter payment value
  let currentBalance = parseFloat(router.get('balance') || '0');
  currentBalance +=
    payment - currentBalance === Number(PAYMENT_BUFFER)
      ? Number(PAYMENT_BUFFER)
      : 0;

  // const {
  //   txBatch: { useRepayFull, useRepaySome },
  // } = useProtocolConfig().find((c: ProtocolConfig) => c.chain === NETWORK)!;

  // DB for getting loanBalance and collateral
  const { getLoanData, updateLoan } = useLoanDB();
  const [loanData, setLoanData] = useState<any>();
  const [collateral, setCollateral] = useState<Balance>({
    formatted: 0,
    value: ethers.BigNumber.from(0),
  });
  const [collateralPrice, setCollateralPrice] = useState<any>();
  const [outStandingBalance, setOutStandingBalance] = useState<number>(0);
  const [originalborrowBalance, setOriginalBorrowBalance] = useState<number>(0);
  const [rewardAmount, setRewardAmount] = useState<any>();

  const { compPrice } = useCompPrice();
  // Thirdweb for EOA
  const address = useAddress();
  const {
    depositZerodevAccount,
    getBorrowBalanceOf,
    getCollateralBalanceOf,
    getETHPrice,
    getRewardAmount,
  } = useSingleLoan();
  const { data } = useRockoBalance({
    address: address as `0x${string}`,
    token: USDCContract[networkChainId] as `0x${string}`,
  });
  // Wagmi for ZeroDev Smart wallet
  const { rockoWalletAddress, rockoWalletClient } = useRockoWallet();
  const { userInfo } = useUserInfo();
  const { getUserId } = useUserDB();

  // const { chain } = useRockoNetwork();
  const { executeBatchRepaySome, success, txHash } = useRepaySome(payment);
  const {
    executeBatchRepayFull,
    success: fullySuccess,
    txHash: fullyTxHash,
  } = useRepayFull(collateral);

  const [activeDoing, setActiveDoing] = useState(false); //! done btn will active and counter coverts to "Completed" when all loader completed.
  const [activeDone, setActiveDone] = useState(false); //! done btn will active and counter coverts to "Completed" when all loader completed.
  const [startA, setStartA] = useState(false); // true when depositLoan to rockoWalletAddress
  const [startB, setStartB] = useState(false); // true when start batchTransactions

  const [counter, setCounter] = useState(3); //! countdown
  const [progress, setProgress] = useState(0); //! showing the loader progress
  const [progressTracker, setProgressTracker] = useState(0); //! when progress will hit 100 then progressTracker is incremented by 1
  const [doneTracker, setDoneTracker] = useState<DoneTracker[]>([]); //! when progress will hit 100 and progressTracker is incremented by 1 then doneTracker is incremented by 1
  const [completeModal, setCompleteModal] = useState(false); //! after clicking done btn completeModal popup shows

  const initialize = async () => {
    if (userInfo) {
      const { formatted: borrowBalance } = await getBorrowBalanceOf();
      if (originalborrowBalance === 0) {
        setOriginalBorrowBalance(borrowBalance);
      }

      const collateralBalance = await getCollateralBalanceOf();
      setCollateral(collateralBalance);

      const user_id = await getUserId(userInfo?.email);
      const result = await getLoanData(user_id);
      if (result) {
        const active_loans = result.filter(
          (loan: any) => loan.loan_active === 1,
        );
        if (active_loans.length > 0) {
          setLoanData(active_loans[0]);
          setOutStandingBalance(active_loans[0]?.outstanding_balance);
        }
      }
    }
  };

  const start = async () => {
    if (!rockoWalletAddress || !address) return; // !rockoWalletAddress - logout, !address - no EOA
    // if (chain && chain.name.toUpperCase() !== BLOCKCHAIN.toUpperCase()) {
    //   toast.error('Invalid Network!');
    //   return;
    // }
    if (Number(data?.formatted) < payment) {
      toast.error('Insufficient USDC Balance!');
      return;
    }

    setStartA(true);
    const loanReceived = await receiveLoan();
    if (loanReceived) {
      setADone();

      // batch transactions
      if (currentBalance === payment) {
        executeBatchRepayFull();
      } else {
        executeBatchRepaySome();
      }
      // TODO move this above if to fix spinner?
      setStartB(true);
    } else {
      setAError();
    }
  };

  const receiveLoan = async () => {
    if (!rockoWalletAddress) return;
    const depositResult = await depositZerodevAccount(
      rockoWalletAddress,
      payment,
      'USDC',
    );
    return depositResult;
  };

  const setADone = () => {
    setStartA(false);
    setProgress(0);
    setDoneTracker([...doneTracker, { step: 'one' }]);
  };

  const setAError = () => {
    setStartA(false);
    setProgress(0);
    setCounter(3);
  };

  const setAllDone = async (txHash: string) => {
    updateLoan(
      'repay',
      loanData?.id,
      outStandingBalance - payment < 0 ? 0 : outStandingBalance - payment,
      currentBalance !== payment,
      collateral.formatted,
      originalborrowBalance - outStandingBalance,
      txHash,
    );

    setDoneTracker([...doneTracker, { step: 'two' }]);
    setStartB(false);
    setActiveDone(true);
    setCompleteModal(true);
  };

  const withdrawUSDC = async ({
    recipientAddress,
    smartWalletAddress,
  }: any) => {
    if (!recipientAddress || !rockoWalletClient) return;

    const balance = await getBalance(wagmiConfig, {
      address: smartWalletAddress as `0x${string}`,
      token: USDCContract[networkChainId] as `0x${string}`,
    });

    const hash = await rockoWalletClient.sendTransaction({
      to: USDCContract[networkChainId],
      value: 0,
      data: encodeFunctionData({
        abi: USDCABI,
        functionName: 'transfer',
        args: [address, parseBalance(balance?.formatted, 6)],
      }),
    });

    await waitForTransactionReceipt(wagmiConfig, { hash });

    // save batch transactions
    saveTxRepayFull();

    toast(() => (
      <div className="flex items-center underline gap-2">
        <Image className="w-6 h-6" src={StatusSuccess} alt="success" />
        <Link
          className="hover:text-green-700"
          href={etherscanLink(hash)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Loan successfully repaid!
        </Link>
      </div>
    ));

    setAllDone(hash);
  };

  const saveTxRepaySome = () => {
    const metadata = {
      loan_id: loanIndex,
      asset: 'usdc',
      asset_decimals: 6,
      amount: payment,
      usd_value: payment,
      recipient_address: CometContract[networkChainId],
      sender_address: rockoWalletAddress,
      transaction_type: 'payment',
      funding_source: paymentMethod,
    };

    transactionComp({
      transactionHash: txHash,
      metadata,
    });
  };

  const saveTxRepayFull = () => {
    const metadata_loan = {
      loan_id: loanIndex,
      asset: 'usdc',
      asset_decimals: 6,
      amount: payment,
      usd_value: payment,
      recipient_address: CometContract[networkChainId],
      sender_address: rockoWalletAddress,
      transaction_type: 'payment',
      funding_source: paymentMethod,
    };
    transactionComp({
      transactionHash: fullyTxHash,
      metadata: metadata_loan,
    });

    const metadata_collateral = {
      loan_id: loanIndex,
      asset: 'weth',
      asset_decimals: 18,
      amount: collateral.formatted,
      usd_value: collateral.formatted * Number(collateralPrice),
      recipient_address: rockoWalletAddress,
      sender_address: CometContract[networkChainId],
      transaction_type: 'payment',
      funding_source: paymentMethod,
    };
    transactionComp({
      transactionHash: fullyTxHash,
      metadata: metadata_collateral,
    });

    const metadata_reward = {
      loan_id: loanIndex,
      asset: 'comp',
      asset_decimals: 18,
      amount: rewardAmount,
      usd_value: rewardAmount * Number(compPrice),
      recipient_address: address,
      sender_address: CometRewardContract[networkChainId],
      transaction_type: 'rewards_withdrawal',
      funding_source: paymentMethod,
    };
    transactionComp({
      transactionHash: fullyTxHash,
      metadata: metadata_reward,
    });
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  useEffect(() => {
    getETHPrice()
      .then((_price) => setCollateralPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getRewardAmount()
      .then((_reward) => setRewardAmount(_reward))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));
  });

  useEffect(() => {
    if (
      rockoWalletAddress &&
      !activeDoing &&
      userInfo !== undefined &&
      loanData
    ) {
      start();
      setActiveDoing(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, loanData, rockoWalletAddress]);

  useEffect(() => {
    if (fullySuccess && rockoWalletAddress) {
      withdrawUSDC({
        recipientAddress: address,
        smartWalletAddress: rockoWalletAddress,
      });
    }

    if (success) {
      saveTxRepaySome();

      toast(() => (
        <div className="flex items-center underline gap-2">
          <Image className="w-6 h-6" src={StatusSuccess} alt="success" />
          <Link
            className="hover:text-green-700"
            href={etherscanLink(txHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Loan successfully repaid!
          </Link>
        </div>
      ));

      setAllDone(txHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullySuccess, success, fullyTxHash, txHash]);

  // for timer
  useEffect(() => {
    if (startA || startB) {
      const interval = setInterval(() => {
        if (counter === 0) {
          clearInterval(interval);
        } else {
          setCounter(counter - 1);
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [startA, startB, counter]);
  // for progressbar interface
  useEffect(() => {
    if (startA) {
      setProgressTracker(0);

      const interval = setInterval(() => {
        if (progress === 80) {
          clearInterval(interval);
        } else {
          setProgress((prevProg) => prevProg + 20);
        }
      }, 7000);

      return () => clearInterval(interval);
    }
    if (startB) {
      setProgressTracker(1);

      const interval = setInterval(() => {
        if (progress === 80) {
          clearInterval(interval);
        } else {
          setProgress((prevProg) => prevProg + 20);
        }
      }, 7000);

      return () => clearInterval(interval);
    }
  }, [startA, startB, progress]);

  return (
    <main className="container mx-auto px-[15px] py-4 sm:py-6 lg:py-10">
      <h1 className="text-[28px] lg:text-3xl font-medium text-center lg:text-left">
        {startB
          ? 'Transferring Payment'
          : activeDone
            ? 'Payment Complete'
            : 'Waiting for Payment'}
      </h1>
      <p className="text-black mt-1">
        Please do not close your browser until all of the steps below are
        completed.
      </p>
      <section className="my-6">
        <div className="lg:w-3/5 border-2 rounded-2xl p-3 lg:p-6">
          <p className="text-black">Estimated time remaining</p>
          <h1 className="text-2xl font-semibold mb-4">
            {' '}
            {`${activeDone ? 'Complete!' : `${counter} minutes`}`}{' '}
          </h1>
          <div className="px-4 py-6 rounded-lg bg-[#F9F9F9] flex justify-between items-center mb-3">
            <div
              className={`${
                progressTracker === 0 || doneTracker[0]?.step === 'one'
                  ? 'text-black'
                  : 'text-gray-400'
              } text-sm font-medium flex items-center gap-2`}
            >
              <p className="">Payment Received</p>
            </div>
            {doneTracker[0]?.step === 'one' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M18.3327 10.0003C18.3327 14.6027 14.6017 18.3337 9.99935 18.3337C5.39698 18.3337 1.66602 14.6027 1.66602 10.0003C1.66602 5.39795 5.39698 1.66699 9.99935 1.66699C14.6017 1.66699 18.3327 5.39795 18.3327 10.0003Z"
                  fill="#05944F"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.7566 8.08964L8.75071 14.0956L4.82812 10.173L6.00664 8.99447L8.75071 11.7385L13.5781 6.91113L14.7566 8.08964Z"
                  fill="white"
                />
              </svg>
            )}
            {progressTracker === 0 && !(doneTracker[0]?.step === 'one') && (
              <CircleProgressBar
                circleWidth={18}
                radius={7}
                percentage={progress}
                strokeWidth={2}
              />
            )}
          </div>
          <div className="px-4 py-6 rounded-lg bg-[#F9F9F9] flex justify-between items-center mb-3">
            <div
              className={`${
                progressTracker === 1 || doneTracker[1]?.step === 'two'
                  ? 'text-black'
                  : 'text-gray-400'
              } text-sm font-medium flex items-center gap-2`}
            >
              <p className="">Payment Made to Lending Protocol</p>
            </div>
            {doneTracker[1]?.step === 'two' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M18.3327 10.0003C18.3327 14.6027 14.6017 18.3337 9.99935 18.3337C5.39698 18.3337 1.66602 14.6027 1.66602 10.0003C1.66602 5.39795 5.39698 1.66699 9.99935 1.66699C14.6017 1.66699 18.3327 5.39795 18.3327 10.0003Z"
                  fill="#05944F"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.7566 8.08964L8.75071 14.0956L4.82812 10.173L6.00664 8.99447L8.75071 11.7385L13.5781 6.91113L14.7566 8.08964Z"
                  fill="white"
                />
              </svg>
            )}

            {progressTracker === 1 && !(doneTracker[1]?.step === 'two') && (
              <CircleProgressBar
                circleWidth={18}
                radius={7}
                percentage={progress}
                strokeWidth={2}
              />
            )}
          </div>

          {payment === currentBalance && (
            <div className="px-4 py-6 rounded-lg bg-[#F9F9F9] flex justify-between items-center mb-3">
              <p
                className={`${
                  progressTracker === 1 || doneTracker[1]?.step === 'two'
                    ? 'text-black'
                    : 'text-gray-400'
                }  text-sm font-medium`}
              >
                Collateral Withdrawn to Your Account
              </p>
              {doneTracker[1]?.step === 'two' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M18.3327 10.0003C18.3327 14.6027 14.6017 18.3337 9.99935 18.3337C5.39698 18.3337 1.66602 14.6027 1.66602 10.0003C1.66602 5.39795 5.39698 1.66699 9.99935 1.66699C14.6017 1.66699 18.3327 5.39795 18.3327 10.0003Z"
                    fill="#05944F"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.7566 8.08964L8.75071 14.0956L4.82812 10.173L6.00664 8.99447L8.75071 11.7385L13.5781 6.91113L14.7566 8.08964Z"
                    fill="white"
                  />
                </svg>
              )}

              {progressTracker === 1 && !(doneTracker[1]?.step === 'two') && (
                <CircleProgressBar
                  circleWidth={18}
                  radius={7}
                  percentage={progress}
                  strokeWidth={2}
                />
              )}
            </div>
          )}
        </div>
      </section>
      {completeModal ? (
        <ModalContainer>
          {payment === currentBalance ? (
            <LoanComplete
              title="Payment Complete"
              details="You have successfully repaid your loan. Your collateral and any earned rewards have been withdrawn to your account or wallet. "
              id={0}
              txHash=""
            />
          ) : (
            <LoanComplete
              title="Payment Complete"
              details="You have successfully made a payment"
              id={Number(loanIndex)}
              txHash=""
            />
          )}
        </ModalContainer>
      ) : null}

      {/* footer */}
      <div className="h-20 w-full" />
      <div className=" mt-24 fixed bottom-0 left-0 w-full bg-white ">
        <div className="bg-[#F7F7F7] h-1 w-full relative">
          <div
            /*  style={{
              width: `${(100 / loanSteps.length) * (currentStep + 1)}%`,
            }} */
            className="duration-500 bg-blue h-full absolute left-0 top-0 w-full"
          />
        </div>
        <div className="container mx-auto">
          <div className="p-4">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setCompleteModal(true); //! after clicking done btn completeModal popup shows
                }}
                className={`font-semibold  text-xs md:text-sm ${
                  activeDone ? 'bg-blue' : 'bg-blue/40'
                } py-[10px]  px-6 rounded-full text-white `}
                disabled={!activeDone}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Processing;
