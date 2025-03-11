'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import {
  FLAG_COINBASE_FUNDING,
  FLAG_OTHER_EXCHANGE_FUNDING,
} from '@/constants/featureFlags';
import {
  ConnectWallet,
  useNetworkMismatch,
  useSwitchChain,
  useAddress,
  useChain,
} from '@thirdweb-dev/react';
import { useRockoAccount } from '@/hooks/useRockoAccount';
import { useRockoDisconnect } from '@/hooks/useRockoDisconnect';
import StatusWarning from '@/assets/StatusWarning.svg';
import financial from '@/utility/currencyFormate';
import { useSingleLoan } from '@/contract/single';
import useLoanData from '@/hooks/useLoanData';
import { networkChainId } from '@/constants';
import addressValidator from '@/utility/addressValidator';
import ModalContainer from '../ModalContainer/ModalContainer';
import ChooseWallet from '../ChooseWallet/ChooseWallet';
import LoanFinalized from '../LoanFinalized/LoanFinalized';

type CATEGORY = 'borrow_more';

interface Props {
  title: string;
  subTitle: string;
  invoiceTitle: string;
  category: CATEGORY;
}

const summaryData = {
  borrow_more: {
    title: 'Where do you want to receive your loan increase?',
    subTitle:
      'You can use the same account or wallet to provide collateral for your loan increase',
    terms: [
      {
        rule: (
          <li className="mb-1 ml-3 text-slate-600 text-sm">
            You will be asked to authorize a transaction for the Additional
            Collateral amount (shown above). If your Rocko wallet does not
            receive the Additional Collateral amount, your loan increase may not
            be fulfilled.
          </li>
        ),
      },
    ],
  },
};

function SummaryComp(props: Props) {
  const { disconnect } = useRockoDisconnect();
  const retrievedData = sessionStorage.getItem('borrowMoreData');
  const borrowMoreData = JSON.parse(retrievedData || '{}');

  // console.log(borrowMoreData);

  const loanPayment = borrowMoreData?.payment_loan || 0;
  const collateralPayment = borrowMoreData?.payment_collateral || 0;
  const outStandingBalance = borrowMoreData?.outstanding_balance || 0;
  const totalCollateral = borrowMoreData?.total_collateral || 0;
  const buffer = borrowMoreData?.buffer || 0;
  const liquidationPrice = borrowMoreData?.liquidation_price || 0;

  const { title, subTitle, invoiceTitle, category } = props;

  const { address: zerodevAccount } = useRockoAccount();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [openModalFor, setOpenModalFor] = useState('');
  const [modalStep, setModalStep] = useState(0);
  const { setLoanData } = useLoanData();
  const data = summaryData[category];

  const { getETHPrice } = useSingleLoan();
  const [collateralPrice, setCollateralPrice] = useState<number>(0);

  // for auto-switch network
  const address = useAddress();
  const chain = useChain();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();

  const invoice: any = [
    {
      description: 'Lending Protocol',
      details: <span className="underline">Compound Finance</span>,
    },
    {
      description: 'Loan Amount',
      details: (
        <span className="font-semibold">{`${financial(
          loanPayment,
          6,
        )} USDC`}</span>
      ),
      subDetails: `$${financial(loanPayment, 2)}`,
    },
    {
      description: 'Additional Collateral',
      details: (
        <span className="font-semibold">{`${financial(
          collateralPayment,
          18,
        )} ETH`}</span>
      ),
      subDetails: `$${financial(collateralPayment * collateralPrice, 2)}`,
    },
    {
      description: 'Projected values after payment',
      subDescription: [
        {
          description: 'Outstanding Balance',
          details: (
            <span className="font-semibold text-sm">
              {financial(outStandingBalance, 6)} USDC
            </span>
          ),
          subDetails: `~$${financial(outStandingBalance, 2)}`,
        },
        {
          description: 'Collateral Posted',
          details: (
            <span className="font-semibold text-sm">
              {financial(totalCollateral, 18)} ETH
            </span>
          ),
          subDetails: `~$${financial(totalCollateral * collateralPrice, 2)}`,
        },
        {
          description: 'Collateral Buffer',
          details: (
            <span className="font-semibold text-sm">
              {buffer === 0 ? 'N/A' : `${financial(buffer * 100)}%`}
            </span>
          ),
        },
        {
          description: 'Liquidation Price (ETH)',
          details: (
            <span className="font-semibold text-sm">
              {liquidationPrice === 0
                ? 'N/A'
                : `$${financial(liquidationPrice, 2)}`}
            </span>
          ),
        },
      ],
    },
  ];

  const OnSignIn = () => {
    setOpenModalFor('Coinbase or Gemini');
    setPaymentMethod('default');

    const { sessionStorage } = window;
    sessionStorage.setItem(
      'coinbasePayment',
      JSON.stringify({
        currency: 'ETH',
        amount: collateralPayment,
        account: zerodevAccount?.toString(),
      }),
    );
  };

  useEffect(() => {
    getETHPrice()
      .then((_price) => setCollateralPrice(_price))
      .catch((e) => console.log(e));
  });

  useEffect(() => {
    if (address) {
      addressValidator(address, disconnect);
    }
  }, [address, disconnect]);

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

  useEffect(() => {
    if (isMismatched) {
      switchChain(networkChainId);
    }
  }, [address, chain]);

  return (
    <main className="container mx-auto px-4 md:8 py-4 sm:py-6 lg:py-10">
      <h1 className="text-2xl lg:text-3xl font-semibold">{title}</h1>
      {subTitle && <p className="my-4">{subTitle}</p>}
      {/* ---------------------- First Section Start ------------------------ */}
      <section className="my-6">
        <div className="lg:w-3/5 border-2 rounded-2xl p-3 lg:p-6">
          <h3 className="text-xl font-medium mb-4">{invoiceTitle}</h3>
          <div className="divide-y-2">
            {invoice.map((info: any, i: number) => (
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
                  <div className="flex flex-col flex-1">
                    {info?.subDescription &&
                      info?.subDescription.map((innerInfo: any, i: number) => (
                        <React.Fragment key={i}>
                          <div className="flex items-start">
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
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          {category !== 'borrow_more' && (
            <div className="mt-2 p-5 bg-gray-100 rounded-2xl">
              <p className="text-slate-600 text-sm lg:text-base">
                *Loan fulfillment times are subject to the Ethereum network.
                Fulfillment may be delayed during periods of high congestion
              </p>
            </div>
          )}
        </div>
      </section>
      {/* ---------------------- First Section End ------------------------ */}
      {/* ---------------------- Second Section Start ------------------------ */}
      <section className="my-6">
        <div className="lg:w-3/5 border-2 rounded-2xl p-3 lg:p-5">
          <h3 className="text-xl font-medium mb-1">{data.title}</h3>
          <p className="text-sm text-gray-600 mb-6">{data.subTitle}</p>
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
                <button
                  type="button"
                  onClick={OnSignIn}
                  className="w-24 md:w-32 h-10 rounded-3xl text-sm md:text-base text-[#eee] bg-[#2C3B8D]"
                >
                  Sign in
                </button>
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
                onChange={(e) => handlePaymentMethodChange(e)}
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
                onChange={(e) => handlePaymentMethodChange(e)}
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
                    <div className="max-w-[426px] w-full">
                      <input
                        type="text"
                        className="w-full p-4 border border-[#E6E6E6] rounded-[10px] block focus:outline-none"
                        onBlur={(e) =>
                          addressValidator(e.target.value, disconnect)
                        }
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
            <ul className="list-disc">
              {data.terms.map((term, i) => (
                <React.Fragment key={i}>{term.rule}</React.Fragment>
              ))}
            </ul>
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
            />
          )}

          {modalStep === 1 && <LoanFinalized navType="add" />}
        </ModalContainer>
      )}
      {/* ---------------------- when choose Coinbase or Gemini Account End ------------------------ */}
    </main>
  );
}

export default SummaryComp;
