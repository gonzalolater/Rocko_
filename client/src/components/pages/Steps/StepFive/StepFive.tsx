import React, { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ConnectWallet,
  useNetworkMismatch,
  useSwitchChain,
  useAddress,
  useChain,
} from '@thirdweb-dev/react';
import correct from '@/assets/correct.svg';
import StatusWarning from '@/assets/StatusWarning.svg';
import HoverTooltip from '@/components/chips/HoverTooltip/HoverTooltip';
import ModalContainer from '@/components/chips/ModalContainer/ModalContainer';
import ChooseWallet from '@/components/chips/ChooseWallet/ChooseWallet';
import LoanFinalized from '@/components/chips/LoanFinalized/LoanFinalized';
import useLoanData from '@/hooks/useLoanData';
import financial from '@/utility/currencyFormate';
import {
  FLAG_COINBASE_FUNDING,
  FLAG_OTHER_EXCHANGE_FUNDING,
} from '@/constants/featureFlags';
import { networkChainId } from '@/constants';
import addressValidator from '@/utility/addressValidator';
import { useRockoAccount } from '@/hooks/useRockoAccount';
import { useRockoDisconnect } from '@/hooks/useRockoDisconnect';

const TOOLTIPS = require('../../../../locales/en_tooltips');

interface Term {
  rule: JSX.Element;
}

const terms: Term[] = [
  {
    rule: (
      <li className="mb-1 ml-3 text-slate-600 text-sm lg:text-base">
        By finalizing your loan request, you will receive a non-custodial Rocko
        wallet that will help facilitate your loan. You must transfer the Amount
        Required (shown above) to your Rocko wallet in order for your loan to be
        fulfilled.
      </li>
    ),
  },
  {
    rule: (
      <li className="mb-1 ml-3 text-slate-600 text-sm lg:text-base">
        Additionally, you authorize your Rocko wallet to pay the service fee
        (shown above). The fee will be automatically transferred to Rocko from
        the initial amount sent to your Rocko wallet. More info on Rocko&apos;s
        fee can be found{' '}
        <Link
          href="https://rocko.co/faq/"
          className="underline"
          target="_blank"
        >
          here
        </Link>
        .
      </li>
    ),
  },
];

const StepFive: React.FC = () => {
  const { loanData, setLoanData } = useLoanData();
  const { address: zerodevAccount } = useRockoAccount();
  const { disconnect } = useRockoDisconnect();

  // for auto-switch network
  const address = useAddress();
  const chain = useChain();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();
  // console.log({ loanData });
  const invoice = [
    {
      description: 'Lending Protocol',
      details: <span className="underline">{loanData.protocol}</span>,
      symbol: '/icons/Compound (COMP).svg',
    },
    {
      description: 'Blockchain Network',
      details: <span>{loanData.chain}</span>,
    },
    {
      description: 'Loan Amount',
      details: `~$${financial(loanData?.borrowing)} USDC`,
      subDetails: `~$${financial(loanData?.borrowing)}`,
    },
    {
      description: 'Interest Rate Type',
      details: (
        <div className="flex items-center gap-2 text-blackPrimary">
          Floating
          <HoverTooltip text={TOOLTIPS.FLOATING} />
        </div>
      ),
    },
    {
      description: 'Current APR',
      details: `${financial(loanData?.currentAPR, 2)}%`,
    },
    {
      description: 'Amount Required for Loan',
      details: `${financial(loanData?.collateralNeeded, 3)} ETH`,
      subDetails: `$${financial(
        loanData?.collateralNeeded * loanData?.collateralPrice,
        2,
      )}`,
      subDescription: [
        {
          description: 'Collateral',
          details: `${financial(loanData?.collateralNeeded, 3)} ETH`,
          subDetails: `$${financial(
            loanData?.collateralNeeded * loanData?.collateralPrice,
            2,
          )}`,
        },
        {
          description: 'Rocko Service Fee',
          details: `${0} ETH`,
          subDetails: `$0.00`,
        },
      ],
    },
    {
      description: 'Collateral Buffer',
      details: `${loanData?.buffer}%`,
    },
    {
      description: 'Liquidation Price',
      details: `$${financial(loanData?.liquidationPrice, 2)}`,
    },
    {
      description: 'Estimated Time to Receive Loan',
      details: '<15 Minutes*',
    },
    {
      description: 'Collateral Parameters & Loan Terms',
      subDescription: [
        {
          description: (
            <div className="flex items-center lg:gap-x-1">
              <span className="mr-1 lg:mr-0">Max Loan-to-Value </span>{' '}
              <HoverTooltip text={TOOLTIPS.MAX_LTV} />
            </div>
          ),
          details: `${loanData?.loanToValue * 100}%`,
        },
        {
          description: (
            <div className="flex items-center lg:gap-x-1 w-max">
              <span className="mr-1 lg:mr-0">Liquidation Threshold </span>{' '}
              <HoverTooltip text={TOOLTIPS.LIQUIDATION_THRESDHOLD} />
            </div>
          ),
          details: `${loanData?.liquidationThreshold * 100}%`,
        },
        {
          description: (
            <div className="flex items-center lg:gap-x-1">
              <span className="mr-1 lg:mr-0">Liquidation Penalty </span>{' '}
              <HoverTooltip text={TOOLTIPS.LIQUIDATION_PENALTY} />
            </div>
          ),
          details: `${financial(loanData?.liquidationPenalty * 100)}%`,
        },
        {
          description: (
            <div className="flex items-center lg:gap-x-1">
              <span className="mr-1 lg:mr-0">Loan Term </span>{' '}
              <HoverTooltip text={TOOLTIPS.LOAN_TERM} />
            </div>
          ),
          details: `Open Ended`,
        },
        {
          description: (
            <div className="flex items-center lg:gap-x-1 w-max">
              <span className="mr-1 lg:mr-0">Minimum Monthly Payment </span>{' '}
              <HoverTooltip text={TOOLTIPS.MINIMUM_MONTHLY_PAYMENT} />
            </div>
          ),
          details: `None`,
        },
        {
          description: (
            <div className="flex items-center lg:gap-x-1">
              <span className="mr-1 lg:mr-0">Protocol Rewards </span>{' '}
              <HoverTooltip text={TOOLTIPS.PROTOCOL_REWARDS} />
            </div>
          ),
          details: `${financial(loanData?.rewardRate * 100, 2)}%`,
        },
      ],
    },
  ];

  const [paymentMethod, setPaymentMethod] = useState('');
  const [openModalFor, setOpenModalFor] = useState('');
  const [modalStep, setModalStep] = useState(0);
  const [connect, setConnect] = useState<boolean>(true); //! after choosing wallet on chooseWallet popup/modal then it'll show connected on the page

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;
    setPaymentMethod(inputValue);

    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        paymentMethod: inputValue || '',
      }));
    }
  };

  const OnSignIn = () => {
    setOpenModalFor('Coinbase or Gemini');
    setPaymentMethod('default');

    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        paymentMethod: 'default',
      }));
    }

    const { sessionStorage } = window;
    sessionStorage.setItem(
      'coinbasePayment',
      JSON.stringify({
        currency: 'ETH',
        amount: loanData?.collateralNeeded,
        account: zerodevAccount?.toString(),
      }),
    );
  };

  const handleOtherWalletBlur = async (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    const otherWallet = event.target.value;

    await addressValidator(otherWallet, disconnect);

    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        otherAddress: otherWallet,
      }));
    }
  };

  const handleTermsCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = event.target.checked;

    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        termsChecked: isChecked,
      }));
    }
  };

  useEffect(() => {
    if (isMismatched) {
      switchChain(networkChainId);
    }
  }, [address, chain]);

  useEffect(() => {
    if (address) {
      addressValidator(address, disconnect);
    }
  }, [address, disconnect]);

  return (
    <main className="container mx-auto px-4 md:8 py-4 sm:py-6 lg:py-10">
      <h1 className="text-2xl lg:text-3xl font-semibold">Finalize Your Loan</h1>
      {/* ---------------------- First Section Start ------------------------ */}
      <section className="my-6">
        <div className="lg:w-3/5 border-2 rounded-2xl p-3 lg:p-6">
          <h3 className="text-xl font-medium mb-4">Loan Summary</h3>
          <div className="divide-y-2">
            {invoice.map((info, i) => (
              <React.Fragment key={i}>
                <div className="flex pb-3 pt-2 flex-wrap items-center space-y-2">
                  <p className="font-medium w-[62%] md:w-1/2">
                    {info?.description}
                  </p>
                  <div className="w-[38%] md:w-1/2 text-right md:text-left">
                    <div className="flex gap-1 justify-end md:justify-start">
                      {info?.symbol && (
                        <Image
                          src={info?.symbol || ''}
                          alt={info?.description || ''}
                          width={20}
                          height={20}
                        />
                      )}
                      <p>{info?.details}</p>
                    </div>
                    {info?.subDetails && (
                      <p className="text-sm text-gray-500">
                        {info?.subDetails}
                      </p>
                    )}
                  </div>
                  {info?.subDescription &&
                    info?.subDescription.map((innerInfo, i) => (
                      <React.Fragment key={i}>
                        <div className="pt-1 md:pt-0 w-[65%] md:w-1/2 lg:pl-6">
                          {innerInfo?.description}
                        </div>
                        <div className="pt-1 md:pt-0 w-[35%] md:w-1/2 text-right md:text-left">
                          <p>{innerInfo?.details}</p>
                          {'subDetails' in innerInfo && (
                            <p className="text-sm text-gray-500">
                              {innerInfo?.subDetails}
                            </p>
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 p-5 bg-gray-100 rounded-2xl">
            <p className="text-slate-600 text-sm lg:text-base">
              *Loan fulfillment times are subject to the Ethereum network.
              Fulfillment may be delayed during periods of high congestion
            </p>
          </div>
        </div>
      </section>
      {/* ---------------------- First Section End ------------------------ */}
      {/* ---------------------- Second Section Start ------------------------ */}
      <section className="my-6">
        <div className="lg:w-3/5 border-2 rounded-2xl p-3 lg:p-5">
          <h3 className="text-xl font-medium mb-1">
            Where do you want to receive your loan?
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            You can use the same account or wallet to provide collateral for
            your loan
          </p>
          {FLAG_COINBASE_FUNDING && (
            <div className="md:flex justify-between mb-7">
              <div className="flex md:items-center">
                <input
                  type="radio"
                  id="wallet1"
                  name="contact"
                  value="default"
                  checked={paymentMethod === 'default'}
                  className="w-[30px] h-[30px] md:w-7 md:h-7 border-2 border-black"
                  onChange={(e) => handlePaymentMethodChange(e)}
                />
                <label htmlFor="wallet1" className="pl-4">
                  <p className="font-semibold">
                    Coinbase or Gemini Account{' '}
                    <span className="font-medium text-xs md:text-sm lg:ml-3 bg-[#EFF3FE] py-1 px-2 rounded-xl text-[#276EF1] inline-block my-1 lg:my-0">
                      Easiest
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Minimize risk of funds being sent to an incorrect address
                  </p>
                </label>
              </div>
              <div className="text-center md:text-left mt-1 lg:mt-0">
                {connect ? (
                  <button
                    type="button"
                    onClick={OnSignIn}
                    className="w-24 md:w-32 h-10 rounded-3xl text-sm md:text-base text-[#eee] bg-[#2C3B8D]"
                  >
                    Sign in
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mx-auto md:m-0 flex items-center gap-x-1 px-2 py-1 text-green-600 bg-green-100 rounded-md"
                  >
                    <Image src={correct} alt="Correct Image" />
                    <p>Connected</p>
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="md:flex justify-between mb-7">
            <div className="flex items-center">
              <input
                type="radio"
                id="wallet2"
                name="contact"
                value="ethereum"
                onChange={(e) => {
                  handlePaymentMethodChange(e);
                  setConnect(true);
                }}
                className="w-5 h-5 md:w-7 md:h-7 border-2 border-black"
              />
              <label htmlFor="wallet2" className="pl-4">
                <p className="font-semibold">Ethereum Wallet</p>
              </label>
            </div>
            <div className="text-center md:text-left mt-1 lg:mt-0">
              <ConnectWallet
                btnTitle="Connect"
                theme="light"
                style={{
                  background: paymentMethod === 'ethereum' ? '#2C3B8D' : '#eee',
                  color: paymentMethod === 'ethereum' ? '#eee' : '#2C3B8D',
                  borderRadius: '1.5rem',
                  minWidth: '8rem',
                }}
              />
            </div>
          </div>
          {FLAG_OTHER_EXCHANGE_FUNDING && (
            <div className="flex items-start mb-7">
              <input
                type="radio"
                id="wallet3"
                name="contact"
                value="other"
                className="w-5 h-5 md:w-7 md:h-7 border-2 border-black"
                onChange={(e) => {
                  handlePaymentMethodChange(e);
                  setConnect(true);
                }}
              />
              <div className="pl-4">
                <label htmlFor="wallet3" className="">
                  <p className="font-semibold mb-6">
                    Other Exchange or Wallet Address
                  </p>
                </label>

                {/* if select other address then it will be active  start */}
                {paymentMethod === 'other' && (
                  <div className="">
                    <p className="text-sm font-semibold font-inter mb-2">
                      Enter Wallet Address
                    </p>
                    <div className="max-w-[450px] w-full">
                      <input
                        type="text"
                        className="w-full p-4 border border-[#E6E6E6] rounded-[10px] block focus:outline-none"
                        onBlur={handleOtherWalletBlur}
                      />
                    </div>
                    <div className="my-4 p-4 rounded-[10px] bg-[#FFFAF0] flex items-center justify-start gap-2 border border-[#dbdbda]">
                      <Image
                        src={StatusWarning}
                        width={24}
                        height={24}
                        alt="warning"
                      />
                      <p className="text-sm font-inter text-[#010304]">
                        Caution: Please ensure the provided information is
                        correct. Inputting an incorrect address could lead to
                        lost funds.
                      </p>
                    </div>
                  </div>
                )}
                {/* if select other address then it will be active  end */}
              </div>
            </div>
          )}
          <div className="mt-2 p-5 bg-gray-100 rounded-2xl">
            <div className="mt-2 p-3 bg-gray-100 rounded-2xl">
              <ul className="list-disc">
                {terms.map((term, i) => (
                  <React.Fragment key={i}>{term.rule}</React.Fragment>
                ))}
              </ul>
            </div>
            <label className="mb-1 text-slate-600 text-sm lg:text-base">
              <div className="flex gap-3">
                <div className="mt-3">
                  <input
                    type="checkbox"
                    className="checkbox1"
                    onChange={(e) => handleTermsCheckChange(e)}
                  />
                </div>
                <div>
                  By checking this box, you agree to the Rocko Terms of Service
                  which can be found{' '}
                  <Link
                    href="https://rocko.co/terms/"
                    className="underline"
                    target="_blank"
                  >
                    here
                  </Link>
                  . You also understand and acknowledge the risks of using DeFi
                  protocols, non-custodial wallets, and blockchain networks
                  which can include loss of funds.{' '}
                </div>
              </div>
              {/* </input> */}
            </label>
          </div>
        </div>
      </section>
      {/* ---------------------- Second Section End ------------------------ */}

      {/* ---------------------- when choose Coinbase or Gemini Account start ------------------------ */}
      {openModalFor && (
        <ModalContainer>
          {modalStep === 0 && (
            <ChooseWallet
              setModalStep={setModalStep}
              setOpenModalFor={setOpenModalFor}
              setConnect={setConnect}
            />
          )}

          {modalStep === 1 && <LoanFinalized navType="start" />}
        </ModalContainer>
      )}
      {/* ---------------------- when choose Coinbase or Gemini Account End ------------------------ */}
    </main>
  );
};

export default StepFive;
