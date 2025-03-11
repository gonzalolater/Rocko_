/* eslint-disable @next/next/no-img-element */

'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import StatusWarning from '@/assets/StatusWarning.svg';
import ModalContainer from '@/components/chips/ModalContainer/ModalContainer';
import ChooseWallet from '@/components/chips/ChooseWallet/ChooseWallet';
import correct from '@/assets/correct.svg';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ConnectWallet,
  useNetworkMismatch,
  useSwitchChain,
  useAddress,
  useChain,
} from '@thirdweb-dev/react';
import { useSingleLoan } from '@/contract/single';
import financial from '@/utility/currencyFormate';
import logger from '@/utility/logger';
import {
  FLAG_COINBASE_FUNDING,
  FLAG_OTHER_EXCHANGE_FUNDING,
} from '@/constants/featureFlags';
import { networkChainId } from '@/constants';
import addressValidator from '@/utility/addressValidator';
import { useRockoAccount } from '@/hooks/useRockoAccount';
import { useRockoDisconnect } from '@/hooks/useRockoDisconnect';

interface InnerInfo {
  description: string;
  details: string;
  subDetails?: string;
}

interface Info {
  description: string;
  details?: string | number | JSX.Element;
  subDetails?: string;
  subDescription?: InnerInfo[];
}

interface Term {
  rule: React.JSX.Element;
}

const terms: Term[] = [
  {
    rule: (
      <li className="mb-1 ml-3 text-slate-600 text-sm">
        You will need to authorize the transfer to your Rocko wallet for the
        collateral amount above. If your Rocko wallet does not receive the
        collateral amount, no additional collateral will be posted for your
        loan.
      </li>
    ),
  },
];

const ModifyCollateral: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState(''); //! capture which payment method or radio btn a user will select
  const [openModalFor, setOpenModalFor] = useState(''); //! if openModalFor's value is empty string then popup modal is closed if it's not empty string then it'll show up
  const [modalStep, setModalStep] = useState(0); //! passing modalStep value to chooseWallet popup/modal. If modalStep's value is 1 then it will redirect to loanFinalized popup after user clicking continue btn on chooseWallet popup/modal.
  const [connect, setConnect] = useState<boolean>(true); //! after choosing wallet on chooseWallet popup/modal then it'll show connected on the page
  const [collateralPrice, setCollateralPrice] = useState<number>(0);

  const basicRouter = useParams();
  const router = useSearchParams(); //! use the hooks for getting the URL parameters
  const amount = router.get('try'); //! get the URL parameter value
  const loanIndex = parseFloat(basicRouter.single.toString() || '0');
  const payment = parseFloat(router.get('payment') || '0'); //! get the URL parameter payment value
  const basicCollateral = parseFloat(router.get('collateral') || '0');
  const currentBalance = parseFloat(router.get('balance') || '0');

  const new_collateral =
    amount === 'add' ? basicCollateral + payment : basicCollateral - payment;

  const { disconnect } = useRockoDisconnect();
  const { address: zerodevAccount } = useRockoAccount();
  const { getETHPrice, getLiquidationPrice, getBuffer } = useSingleLoan();
  const [liquidationPrice, setLiquidationPrice] = useState<any>();
  const [buffer, setBuffer] = useState<any>();

  // for auto-switch network
  const address = useAddress();
  const chain = useChain();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();

  const invoice: Info[] = [
    {
      description: 'Lending Protocol',
      details: <span className="underline font-normal">Compound Finance</span>,
    },
    {
      description: 'Collateral Amount',
      details: `${financial(payment, 18)} ETH`,
      subDetails: `~$${financial(payment * collateralPrice, 2)}`,
    },
    {
      description: 'Projected values after collateral modification',
      subDescription: [
        {
          description: 'Total Collateral',
          details: `${financial(new_collateral, 18)} ETH`,
          subDetails: `~$${financial(new_collateral * collateralPrice, 2)}`,
        },
        {
          description: 'Collateral Buffer',
          details: `${financial(buffer * 100)}%`,
        },
        {
          description: 'Liquidation Price (ETH)',
          details: `$${financial(liquidationPrice, 2)}`,
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
        amount: payment,
        account: zerodevAccount?.toString(),
      }),
    );
  };

  useEffect(() => {
    getETHPrice()
      .then((_price) => setCollateralPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getLiquidationPrice(currentBalance, new_collateral)
      .then((_price) => setLiquidationPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getBuffer(currentBalance, new_collateral)
      .then((_buffer) => setBuffer(_buffer))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));
  });

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
    <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-10">
      <h1 className="text-2xl lg:text-3xl font-semibold">Modify Collateral</h1>
      {amount === 'add' ? (
        <p>
          You’re adding more <strong>ETH</strong> to your loan collateral
        </p>
      ) : (
        <p>
          You’re withdrawing <strong>ETH</strong> from your loan collateral
        </p>
      )}

      {/* ---------------------- First Section Start ------------------------ */}
      <section className="my-6">
        <div className="lg:max-w-4xl border-2 rounded-2xl p-3 lg:p-6">
          <h3 className="text-xl font-medium mb-4">Summary</h3>
          <div className="divide-y-2">
            {invoice.map((info, i) => (
              <React.Fragment key={i}>
                <div className="flex pb-3 pt-2 flex-wrap items-center space-y-2">
                  <p className="font-medium w-[62%] md:w-1/2">
                    {info?.description}
                  </p>
                  <div className="w-[38%] md:w-1/2 text-right md:text-left">
                    <p className="font-semibold">{info?.details}</p>
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
                          <p className="text-sm">{innerInfo?.description}</p>
                        </div>
                        <div className="pt-1 md:pt-0 w-[35%] md:w-1/2 text-right md:text-left">
                          <p className="font-semibold text-sm">
                            {innerInfo?.details}
                          </p>
                          {innerInfo?.subDetails && (
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
        </div>
      </section>
      {/* ---------------------- First Section End ------------------------ */}
      {/* ---------------------- Second Section Start ------------------------ */}
      <section className="my-6">
        <div className="lg:max-w-4xl border-2 rounded-2xl p-3 lg:p-5">
          <h3 className="text-xl font-medium mb-6">
            {amount === 'add'
              ? 'Choose your funding source'
              : 'Where do you want to receive your collateral?'}
          </h3>
          {/* radio btn - 1 Container */}
          {FLAG_COINBASE_FUNDING && (
            <div className="md:flex justify-between mb-7">
              {/* radio btn - 1 */}
              <div className="flex md:items-center">
                <input
                  type="radio"
                  id="wallet1"
                  name="contact"
                  value="default"
                  className="w-[30px] h-[30px] md:w-7 md:h-7 border-2 border-black"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="wallet1" className="pl-4">
                  <p className="font-medium">
                    Coinbase or Gemini Account{' '}
                    <span className="font-medium text-xs  lg:ml-3 bg-[#EFF3FE] py-1 px-2 rounded-xl text-[#276EF1] inline-block my-1 lg:my-0">
                      Easiest
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Minimize risk of funds being sent to an incorrect address
                  </p>
                </label>
              </div>
              <div className="text-center md:text-left mt-1 lg:mt-0">
                {/* based on the connect value toggling the buttons */}
                {connect ? (
                  <button
                    type="button"
                    onClick={OnSignIn}
                    disabled={paymentMethod !== 'default'}
                    className={` w-24 md:w-32 h-10 rounded-3xl text-sm font-semibold ${
                      paymentMethod === 'default'
                        ? 'text-[#eee] bg-[#2C3B8D]'
                        : 'bg-[#eee] text-[#2C3B8D]'
                    }`}
                  >
                    Sign in
                  </button>
                ) : (
                  <button className="mx-auto md:m-0 flex items-center gap-x-1 px-2 py-1 text-green-600 bg-green-100 rounded-md text-xs font-medium">
                    <Image src={correct} alt="Correct Image" />
                    <p>Connected</p>
                  </button>
                )}
              </div>
            </div>
          )}
          {/* radio btn - 2 Container */}
          <div className="md:flex justify-between mb-7">
            {/* radio btn - 2 */}
            <div className="flex items-center">
              <input
                type="radio"
                id="wallet2"
                name="contact"
                value="ethereum"
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setConnect(true);
                }}
                className="w-5 h-5 md:w-7 md:h-7 border-2 border-black"
              />
              <label htmlFor="wallet2" className="pl-4">
                <p className="font-medium">Ethereum Wallet</p>
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
          {/* radio btn - 3 */}
          {FLAG_OTHER_EXCHANGE_FUNDING && (
            <div className="flex items-start mb-7">
              <input
                type="radio"
                id="wallet3"
                name="contact"
                value="other"
                className="w-5 h-5 md:w-7 md:h-7 border-2 border-black"
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setConnect(true);
                }}
              />
              <div className="pl-4">
                <label htmlFor="wallet3" className="">
                  <p className="font-medium mb-6">
                    Other Exchange or Wallet Address
                  </p>
                </label>

                {/* if select other address then it will be active -- start */}
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
                {/* if select other address then it will be active -- end */}
              </div>
            </div>
          )}
          {amount === 'add' && (
            <div className="mt-2 p-5 bg-gray-100 rounded-2xl">
              <ul className="list-disc">
                {terms.map((term, i) => (
                  <React.Fragment key={i}>{term.rule}</React.Fragment>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      {/* ---------------------- Second Section End ------------------------ */}
      {/* ---------------------footer start------------------- */}
      <div className="h-20 w-full" />
      <div className=" mt-24 fixed bottom-0 left-0 w-full bg-white ">
        <div className="bg-[#F7F7F7] h-1 w-full relative">
          <div className="duration-500 bg-blue h-full absolute left-0 top-0 w-8/12" />
        </div>
        <div className="container mx-auto">
          <div className="p-4">
            <div className="flex items-center justify-end gap-3">
              {/* //!after clicking back btn it'll redirect to previous page */}
              <Link href={`/loan-dashboard/${loanIndex}?active=true`}>
                <button
                  className={`font-semibold  text-xs md:text-sm text-blue  py-[10px]  px-6 rounded-full 
                   bg-grayPrimary`}
                >
                  Back
                </button>
              </Link>
              {/* //!after clicking continue page it'll redirect to "status" page with dynamic URL */}
              <Link
                href={`/loan-dashboard/${loanIndex}/${'modify_collateral'}/${amount}?payment=${payment}&method=${paymentMethod}`}
              >
                <button
                  className={`font-semibold  text-xs md:text-sm ${
                    address && zerodevAccount ? 'bg-blue' : 'bg-blue/40'
                  } py-[10px]  px-6 rounded-full text-white `}
                  disabled={!address || !zerodevAccount}
                >
                  Confirm
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* //!---------------------footer end------------------- */}
      {/* //! If user select the first radio button and click "Sign in"  btn then chosseWallet popup/modal will show and passing modalStep,openModalFor&connet value to chooseWallet popup/modal [for mor details about the props look up where they're initialize] */}
      {paymentMethod === 'default' && openModalFor && (
        <ModalContainer>
          {modalStep === 0 && (
            <ChooseWallet
              setModalStep={setModalStep}
              setOpenModalFor={setOpenModalFor}
              setConnect={setConnect}
            />
          )}
        </ModalContainer>
      )}
    </main>
  );
};

export default ModifyCollateral;
