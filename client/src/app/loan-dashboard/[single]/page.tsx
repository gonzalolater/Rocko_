'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import compound from '@/assets/coins/Compound (COMP).svg';
import eth from '@/assets/coins/Ether (ETH).svg';
import usdc from '@/assets/coins/USD Coin (USDC).svg';
import HoverTooltip from '@/components/chips/HoverTooltip/HoverTooltip';
import ModalContainer from '@/components/chips/ModalContainer/ModalContainer';
import MakePaymentModal from '@/components/chips/MakePaymentModal/MakePaymentModal';
import BorrowMoreModal from '@/components/chips/BorrowMoreModal/BorrowMoreModal';
import Alert from '@/components/pages/Dashboard/Alert/Alert';
import RangeInput from '@/components/chips/RangeInput/RangeInput';
import { useSingleLoan } from '@/contract/single';
import { useLoanDB } from '@/db/loanDb';
import { useUserDB } from '@/db/userDb';
import { useCompPrice } from '@/hooks/usePrice';
import { formatDate } from '@/utility/utils';
import { useUserInfo } from '@/hooks/useUserInfo';
import logger from '@/utility/logger';
import financial from '@/utility/currencyFormate';
import usePlatformStatus from '@/hooks/usePlatformStatus';
import { useRockoWallet } from '@/hooks/useRockoWallet';
import CollateralWarningBanner from '@/components/pages/Dashboard/Banners/collateralWarning';
import ModifyWallet from './modifyWallet/modifyWallet';

const TOOLTIPS = require('../../../locales/en_tooltips');

const headings = [
  {
    img: compound,
    text: 'Compound -',
  },

  {
    img: usdc,
    text: 'USDC  :',
  },
  {
    img: eth,
    text: 'ETH',
  },
];

const TxPaused = () => (
  <p>
    We are temporarily unable to process transactions, please check for{' '}
    <a
      className="underline text-red-500"
      target="_blank"
      rel="noopener noreferrer"
      href="https://twitter.com/rockodefi"
    >
      status updates on X
    </a>
    .
  </p>
);

function SinglePage() {
  const { rockoWalletAddress } = useRockoWallet();
  const { transactionsPaused } = usePlatformStatus();
  const searchParams = useSearchParams();
  const isActive = searchParams.get('active');
  const isBorrowMore = searchParams.get('borrow-more');
  const { userInfo } = useUserInfo();
  const { getUserId } = useUserDB();

  const [openModalFor, setOpenModalFor] = useState('');

  const { getLoanData, getAverageAPR, getRewardRate } = useLoanDB();
  const { compPrice } = useCompPrice();

  const [loanData, setLoanData] = useState<any>();
  const [collateralPrice, setCollateralPrice] = useState<any>();
  const [apr, setAPR] = useState<any>();
  const [LTV, setLTV] = useState<any>();
  const [threshold, setThreshold] = useState<any>();
  const [penalty, setPenalty] = useState<any>();
  const [rewardAmount, setRewardAmount] = useState<any>();
  const [rewardRate, setRewardRate] = useState<any>();
  const [liquidationPrice, setLiquidationPrice] = useState<any>();
  const [buffer, setBuffer] = useState<any>();
  const [averageAPR, setAverageAPR] = useState<any>(0);
  const [borrowBalanceOf, setBorrowBalanceOf] = useState<any>(0);
  const [collateralBalanceOf, setCollateralBalanceOf] = useState<any>(0);
  const [minCollateral, setMinCollateral] = useState<any>(0);

  const {
    getETHPrice,
    getBorrowAPR,
    getLTV,
    getPenalty,
    getThreshold,
    getRewardAmount,
    getLiquidationPrice,
    getBuffer,
    getMinCollateral,
    getBorrowBalanceOf,
    getCollateralBalanceOf,
  } = useSingleLoan();

  const initialize = async () => {
    if (userInfo) {
      const user_id = await getUserId(userInfo?.email);
      const result = await getLoanData(user_id);
      if (result) {
        const active_loans = result.filter(
          (loan: any) => loan.loan_active === (isActive ? 1 : 0),
        );
        if (active_loans.length > 0) {
          setLoanData(active_loans[0]);

          const avg_val = await getAverageAPR(active_loans[0].create_time);

          if (avg_val) setAverageAPR(avg_val);
        }

        if (isBorrowMore) setOpenModalFor('Borrow More');
      }
    }
  };

  const onClickBorrowMore = () => {
    if (sessionStorage.getItem('isReadOnly') === 'true') {
      toast.error(
        'Your account is currently under review. You may manage existing loans but cannot create new loans. Please contact support@rocko.co if you need further assistance.',
      );
    } else {
      setOpenModalFor('Borrow More');
    }
  };

  useEffect(() => {
    if (rockoWalletAddress) {
      initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, rockoWalletAddress]);

  useEffect(() => {
    getETHPrice()
      .then((_price) => setCollateralPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getBorrowAPR()
      .then((_apr) => setAPR(_apr))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getLTV()
      .then((_ltv) => setLTV(_ltv))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getThreshold()
      .then((_threshold) => setThreshold(_threshold))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getPenalty()
      .then((_penalty) => setPenalty(_penalty))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getRewardAmount()
      .then((_reward) => setRewardAmount(_reward))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getRewardRate()
      .then((_rate) => setRewardRate(_rate))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getLiquidationPrice(loanData?.outstanding_balance, collateralBalanceOf)
      .then((_price) => setLiquidationPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getBuffer(loanData?.outstanding_balance, collateralBalanceOf)
      .then((_buffer) => setBuffer(_buffer))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getBorrowBalanceOf()
      .then((_balance) => setBorrowBalanceOf(_balance.formatted))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getCollateralBalanceOf()
      .then((_balance) => setCollateralBalanceOf(_balance.formatted))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getMinCollateral(loanData?.outstanding_balance)
      .then((_collateral) => setMinCollateral(_collateral))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));
  });

  return (
    <main className="container mx-auto px-4 py-6 pt-20 lg:py-10 lg:pt-24 ">
      <p className="text-center md:text-left font-medium">
        Loan with {loanData?.lending_protocol}
      </p>
      <div className="flex gap-x-2 items-center justify-center md:justify-start mt-5">
        {headings.map((heading, i) => (
          <div className="flex gap-x-1 md:gap-x-2 items-center" key={i}>
            <Image
              width={24}
              height={24}
              src={heading.img}
              alt=""
              className="w-6 h-6 md:w-8 md:h-8"
            />
            <h1 className="text-xl md:text-[28px] font-medium text-center lg:text-left">
              {heading.text}
            </h1>
          </div>
        ))}
      </div>
      <CollateralWarningBanner buffer={buffer} />
      <section className="my-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-7">
        {/* ------------left-top grid---------------- */}
        <div className="border-2 rounded-2xl p-3 md:p-5 lg:p-6">
          <h1 className="text-xl mb-4 font-medium">Current Balance</h1>
          <div className="divide-y-2 space-y-4">
            <div className="flex justify-between flex-wrap gap-1 md:gap-0 pt-4">
              <div className="w-[30%]">
                <p className="text-2xl  font-medium">
                  {financial(borrowBalanceOf, 2)} <small>USDC</small>
                  <span className="block text-sm text-[#545454]">
                    ${financial(borrowBalanceOf, 2)}
                  </span>
                </p>
              </div>
              <div className="w-[30%]">
                <p className=""> Available to Borrow </p>
                <span className="block text-xl  font-medium">
                  {financial(
                    collateralPrice * collateralBalanceOf * LTV -
                      borrowBalanceOf,
                    2,
                  )}{' '}
                  <small>USDC</small>
                </span>
              </div>
              <div className="w-[30%]">
                <div className="flex items-center gap-2 ">
                  <p className=""> Current LTV </p>
                  <HoverTooltip text={TOOLTIPS.AVERAGE_APR} />
                </div>
                <span className="block text-xl  font-medium">
                  {financial(
                    (borrowBalanceOf /
                      (collateralPrice * collateralBalanceOf)) *
                      100,
                  )}
                  <small>%</small>
                </span>
              </div>
              {/* <Image
                  width={24}
                  height={24}
                  src={usdc}
                  alt=""
                  className="w-6 h-6"
                /> */}
            </div>
            <div className="flex justify-between flex-wrap gap-1 md:gap-0 pt-4">
              <div className="w-[30%]">
                <p className=""> Interest Accrued </p>
                <span className="block text-xl  font-medium">
                  {financial(
                    borrowBalanceOf - loanData?.outstanding_balance,
                    2,
                  )}{' '}
                  <small>USDC</small>
                </span>
              </div>

              <div className="w-[30%]">
                <p className=""> Current APR</p>{' '}
                <div className="block text-xl  font-medium">
                  {financial(apr, 2)}
                  <span className="text-base">%</span>
                </div>
              </div>

              <div className="w-[30%]">
                <div className="flex items-center gap-2 ">
                  <p className=""> Average APR</p>{' '}
                  <HoverTooltip text={TOOLTIPS.AVERAGE_APR} />
                </div>

                <div className="block text-xl  font-medium">
                  {financial(averageAPR * 100, 2)}
                  <span className="text-base">%</span>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-xl font-medium">
                <small className="block font-normal">Date Opened</small>
                {loanData?.create_time &&
                  formatDate(new Date(loanData?.create_time))}
              </p>
              {/* //! Alert start  */}
              <Alert
                title="APR Alerts"
                loanId={loanData?.id}
                alertFor="APR"
                description="Set up alerts to be notified if your interest rate spikes or drops. "
              />
              {/* //! Alert end */}
              <div className="mt-5 md:mt-8 grid grid-cols-1 md:grid-cols-[1fr_3fr] min-[1535px]:grid-cols-[1fr_4fr]  items-center min-[1024px]:gap-x-3 min-[1280px]:gap-x-0 gap-y-2">
                <button
                  type="button"
                  disabled={transactionsPaused}
                  onClick={() => setOpenModalFor('Make Payment')}
                  className="text-sm font-semibold bg-[#2C3B8D] text-white rounded-3xl px-7 py-3 w-max mx-auto md:m-0"
                >
                  Make a Payment
                </button>
                <div className="flex md:flex-row flex-col just-between items-center gap-6">
                  <button
                    type="button"
                    disabled={transactionsPaused}
                    onClick={() => onClickBorrowMore()}
                    className="text-sm font-semibold bg-[#EEE] text-[#2C3B8D] rounded-3xl px-7 py-3 w-max mx-auto md:m-0 min-w-[167px]"
                  >
                    Borrow More
                  </button>
                  {transactionsPaused ? (
                    <TxPaused />
                  ) : (
                    <p className="text-sm text-center md:text-left text-[#545454] font-normal">
                      There is no payment due date for this loan. You can repay
                      it in part or in full at anytime.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ------------right-top grid---------------- */}
        <aside className="border-2 rounded-2xl p-3 md:p-5 lg:p-6">
          <h1 className="text-xl font-medium">Collateral Parameters</h1>
          <div className="divide-y-2 space-y-[15px]">
            <div className="pt-4">
              <div className="flex items-center gap-2 ">
                <p className="font-normal">Loan-to-Value Ratio</p>{' '}
                <HoverTooltip text={TOOLTIPS.MAX_LTV} />
              </div>
              <p className="block text-xl font-medium mt-2">
                {LTV * 100}
                <span className="text-base">%</span>
              </p>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-2 ">
                <p className="font-normal">Liquidation Threshold</p>{' '}
                <HoverTooltip text={TOOLTIPS.LIQUIDATION_THRESHOLD} />
              </div>
              <p className="block text-xl font-medium mt-2">
                {threshold * 100}
                <span className="text-base">%</span>
              </p>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-2 ">
                <p className="font-normal">Liquidation Penalty</p>{' '}
                <HoverTooltip text={TOOLTIPS.LIQUIDATION_PENALTY} />
              </div>
              <p className="block text-xl font-medium mt-2">
                {financial(penalty * 100)}
                <span className="text-base">%</span>
              </p>
            </div>
          </div>
        </aside>
        {/* ------------left-bottom grid---------------- */}
        <div className="border-2 rounded-2xl p-3 md:p-5 lg:p-6">
          <h1 className="text-xl mb-4  font-medium">Collateral</h1>
          {/* --------------green bar-------------- */}
          <RangeInput
            buffer={buffer === 'N/A' ? 0 : Number(financial(buffer * 100))}
            minCollateral={minCollateral}
            collateralValue={financial(
              collateralPrice * collateralBalanceOf,
              2,
            )}
          />
          <div className="divide-y-2 space-y-3">
            <div />
            <div className="flex pt-3 gap-x-2">
              <p className="w-1/2 font-medium">Collateral Posted</p>
              <p>
                {financial(collateralBalanceOf, 18)} ETH
                <span className="block text-sm text-[#545454]">
                  ${financial(collateralPrice * collateralBalanceOf, 2)}
                </span>
              </p>
            </div>
            <div className="flex pt-3 gap-x-2">
              <p className="w-1/2 font-medium">Liquidation Price</p>
              <p>
                {liquidationPrice === 'N/A'
                  ? 'N/A'
                  : `$${financial(liquidationPrice, 2)}`}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-x-2 py-5 relative">
                <p className="w-1/2 font-medium">Collateral Buffer</p>
                <p>
                  {buffer === 'N/A' ? 'N/A' : `${financial(buffer * 100)}%`}
                </p>
              </div>
              {/* //!alert start */}
              <Alert
                title=" Collateral Buffer Alerts"
                loanId={loanData?.id}
                alertFor="collateralBuffer"
                description="Set up alerts to be notified when your collateral buffer is low. liquidation can occur once it becomes negative."
              />
              {/* //!alert end */}
            </div>
            <div className="pt-6 grid grid-cols-1 md:grid-cols-[1fr_3fr] min-[1535px]:grid-cols-[1fr_4fr]  items-center min-[1024px]:gap-x-3 min-[1280px]:gap-x-0 gap-y-2">
              <button
                type="button"
                disabled={transactionsPaused}
                onClick={() => setOpenModalFor('Modify Collateral')}
                className="text-sm bg-[#EEE] text-[#2C3B8D] rounded-full px-7 py-3 w-max mx-auto md:m-0 font-semibold"
              >
                Modify Collateral
              </button>
              {transactionsPaused ? (
                <TxPaused />
              ) : (
                <p className="text-sm text-center md:text-left text-[#545454]">
                  You can post additional collateral for this loan at anytime.
                  Doing so will decrease the possibility of liquidation.
                </p>
              )}
            </div>
          </div>
        </div>
        {/* ------------right-bottom grid---------------- */}
        <aside className="border-2 rounded-2xl p-3 md:p-5 lg:p-6">
          <h1 className="text-xl mb-2 font-medium">Rewards</h1>
          <p>Rewards Earned</p>
          <div className="divide-y-2 space-y-3">
            <div className="flex justify-between mt-1">
              <p className="text-xl font-medium">
                {financial(rewardAmount, 6)} COMP{' '}
                <span className="block text-sm text-[#545454] font-normal">
                  ~${financial(Number(compPrice) * rewardAmount, 2)}
                </span>
              </p>
              <Image
                width={24}
                height={24}
                src={compound}
                alt=""
                className="w-6 h-6"
              />
            </div>
            <div className="pt-3">
              <p>Rewards Rate</p>
              <h4 className="text-xl font-medium mt-1 md:mt-3">
                {financial(rewardRate * 100, 2)}
                <span className="text-base">%</span>
              </h4>
              <p className="p-6 bg-[#F9F9F9] rounded-2xl text-sm mt-12 lg:mt-[88px] text-[#545454]">
                Compound protocol offers rewards in its Comp token for usage of
                the protocol. Your Rocko wallet will automatically claim your
                rewards for you when your loan is repaid.
              </p>
            </div>
          </div>
        </aside>
      </section>
      {/* ---------------------- when choose Coinbase or Gemini Account start ------------------------ */}
      {openModalFor && openModalFor === 'Make Payment' && (
        <ModalContainer>
          <MakePaymentModal
            loanId={loanData?.id}
            setOpenModalFor={setOpenModalFor}
            currentBalance={financial(borrowBalanceOf, 6)}
            collateral={collateralBalanceOf}
          />
        </ModalContainer>
      )}
      {openModalFor && openModalFor === 'Modify Collateral' && (
        <ModalContainer>
          <ModifyWallet
            setOpenModalFor={setOpenModalFor}
            currentBalance={financial(borrowBalanceOf, 6)}
            collateral={collateralBalanceOf}
          />
        </ModalContainer>
      )}
      {openModalFor && openModalFor === 'Borrow More' && (
        <ModalContainer>
          <BorrowMoreModal
            setOpenModalFor={setOpenModalFor}
            currentBalance={financial(borrowBalanceOf, 6)}
            collateral={collateralBalanceOf}
          />
        </ModalContainer>
      )}
      {/* ---------------------- when choose Coinbase or Gemini Account End ------------------------ */}
    </main>
  );
}

export default SinglePage;
