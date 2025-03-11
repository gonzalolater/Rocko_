'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import { useSingleLoan } from '@/contract/single';
import TransferFundModal from '@/components/chips/TransferFundModal/TransferFundModal';
import ModalContainer from '@/components/chips/ModalContainer/ModalContainer';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useUserDB } from '@/db/userDb';
import {
  USDCContract,
  WETHContract,
  networkChainId,
  exculdedCountries,
  CompTokenContract,
} from '@/constants';
import financial from '@/utility/currencyFormate';
import { etherscanLink, formatPhoneNumber } from '@/utility/utils';
import { PHONE_EMAIL_PASS_SETTINGS } from '@/constants/featureFlags';
import { useRockoAccount } from '@/hooks/useRockoAccount';
import { useRockoBalance } from '@/hooks/useRockoBalance';
// import { useRepayFull } from '@/protocols/compound/util/batch';
// import { Balance } from '@/protocols/compound/util/data';

const Profile: React.FC = () => {
  const [openModalFor, setOpenModalFor] = useState<undefined | string>();
  const { userInfo } = useUserInfo();
  const { address: zerodevAccount } = useRockoAccount();
  const { updateUser, getUserData } = useUserDB();

  const { data: ethBalance } = useRockoBalance({
    address: zerodevAccount as `0x${string}`,
  });

  const { data: usdcBalance } = useRockoBalance({
    address: zerodevAccount as `0x${string}`,
    token: USDCContract[networkChainId] as `0x${string}`,
  });

  const { data: wethBalance } = useRockoBalance({
    address: zerodevAccount as `0x${string}`,
    token: WETHContract[networkChainId] as `0x${string}`,
  });

  const { data: compBalance } = useRockoBalance({
    address: zerodevAccount as `0x${string}`,
    token: CompTokenContract[networkChainId] as `0x${string}`,
  });

  const [openContactEmailEditBox, setOpenContactEmailEditBox] =
    useState<boolean>(false);
  // const [contactEmail, setContactEmail] = useState('');
  // const [inputContact, setInputContact] = useState('');
  const [openContactNumberEdit, setOpenContactNumberEdit] =
    useState<boolean>(false);
  const [contactNumber, setContactNumber] = useState('');
  const [inputContactNumber, setInputContactNumber] = useState('');
  const [termsChecked, setTermsChecked] = useState<boolean>(false);

  const phoneEmailPass = PHONE_EMAIL_PASS_SETTINGS
    ? [
        // {
        //   description: 'Contact Email',
        //   details: contactEmail,
        // },
        {
          description: 'Contact Number',
          details: contactNumber,
        },
        {
          description: 'Password',
          details: (
            <button type="button" className="underline">
              Reset Password
            </button>
          ),
        },
      ]
    : [];

  const invoice1 = [
    {
      description: 'Wallet Login',
      details: userInfo ? userInfo.email : '',
    },
    ...phoneEmailPass,
  ];

  const invoice2 = [
    {
      description: 'Address',
      details: zerodevAccount ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={etherscanLink(zerodevAccount, 'address')}
          className="underline"
        >
          {zerodevAccount}
        </a>
      ) : (
        ''
      ),
    },
    Number(compBalance?.formatted) ||
    Number(ethBalance?.formatted) ||
    Number(wethBalance?.formatted) ||
    Number(usdcBalance?.formatted)
      ? {
          description: 'Total Balance',
          details: `${financial(
            Number(ethBalance?.formatted) + Number(wethBalance?.formatted),
            6,
          )} ETH`,
          subDescription: [
            {
              description: (
                <div className="flex items-center lg:gap-x-1 w-max">
                  <span className="mr-1 lg:mr-0">ETH </span>{' '}
                </div>
              ),
              details: (
                <div className="flex items-center lg:gap-x-1 w-max">
                  <span className="mr-1 lg:mr-0">
                    {userInfo && `${financial(ethBalance?.formatted, 6)} ETH`}
                  </span>{' '}
                </div>
              ),
            },
            {
              description: (
                <div className="flex items-center lg:gap-x-1">
                  <span className="mr-1 lg:mr-0">WETH </span>{' '}
                </div>
              ),
              details: (
                <div className="flex items-center lg:gap-x-1 w-max">
                  <span className="mr-1 lg:mr-0">
                    {userInfo && `${financial(wethBalance?.formatted, 6)} WETH`}
                  </span>{' '}
                </div>
              ),
            },
            {
              description: (
                <div className="flex items-center lg:gap-x-1">
                  <span className="mr-1 lg:mr-0">USDC </span>{' '}
                </div>
              ),
              details: (
                <div className="flex items-center lg:gap-x-1 w-max">
                  <span className="mr-1 lg:mr-0">
                    {userInfo && `${financial(usdcBalance?.formatted, 6)} USDC`}
                  </span>{' '}
                </div>
              ),
            },
            {
              description: (
                <div className="flex items-center lg:gap-x-1">
                  <span className="mr-1 lg:mr-0">COMP </span>{' '}
                </div>
              ),
              details: (
                <div className="flex items-center lg:gap-x-1 w-max">
                  <span className="mr-1 lg:mr-0">
                    {userInfo && `${financial(compBalance?.formatted, 6)} COMP`}
                  </span>{' '}
                </div>
              ),
            },
            {
              description: '',
              details: (
                <div className="flex items-center lg:gap-x-1 w-max mt-6">
                  <button
                    type="button"
                    className="font-semibold  text-xs md:text-sm text-blue py-[10px]  px-6 rounded-full bg-grayPrimary mr-2"
                    onClick={() => setOpenModalFor('Transfer Fund')}
                  >
                    Transfer Funds
                  </button>
                </div>
              ),
            },
          ],
        }
      : null,
  ];

  const handleTermsCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = event.target.checked;
    setTermsChecked(isChecked);
  };

  const handleSavePhoneClick = () => {
    setContactNumber(inputContactNumber === '+' ? '' : inputContactNumber);
    setOpenContactNumberEdit(!openContactNumberEdit);

    const phoneFlattened =
      inputContactNumber === '+' ? '' : formatPhoneNumber(inputContactNumber);
    updateUser(userInfo?.email, phoneFlattened);
  };

  const fetchPhone = async (email: string) => {
    try {
      const user = await getUserData(email);
      setInputContactNumber(user?.[0]?.phone);
      setContactNumber(user?.[0]?.phone);
    } catch (error) {
      console.log(error);
    }
  };
  // const [loanBalance, setLoanBalance] = useState<Balance>(0);
  // const { getCollateralBalanceOf } = useSingleLoan();
  // const initialize = async () => {
  //   setLoanBalance((await getCollateralBalanceOf()) || {});
  // };
  useEffect(() => {
    // initialize();
    if (userInfo) fetchPhone(userInfo?.email);
  }, [userInfo]);

  useEffect(() => {
    if (typeof window !== 'undefined' && openModalFor === '') {
      window.location.reload();
    }
  }, [openModalFor]);

  // const { getComp, getWeth } = useRepayFull(loanBalance);
  return (
    <main className="container mx-auto px-4 md:8 py-4 sm:py-6 lg:py-10">
      <h1 className="text-2xl lg:text-3xl font-semibold">Profile & Settings</h1>
      {/* <button
        type="button"
        onClick={async () => {
          const hash = await getWeth();
          console.log(hash);
        }}
      >
        getWeth
      </button> */}
      {/* <button
        type="button"
        onClick={async () => {
          const hash = await getComp();
          console.log(hash);
        }}
      >
        getComp
      </button> */}
      {/* ---------------------- First Section Start ------------------------ */}
      <section className="my-6 space-y-2">
        <div className="lg:w-3/5 border-2 rounded-2xl p-3 lg:p-6">
          <h3 className="text-xl font-medium mb-4">Account</h3>
          <div className="divide-y-2">
            {invoice1.map((info, i) => (
              <React.Fragment key={i}>
                <div>
                  <div className="flex pb-3 pt-2 flex-wrap items-center space-y-2">
                    <p className="font-medium w-[62%] md:w-1/2">
                      {info?.description}
                    </p>
                    <div className="w-[38%] md:w-1/2 text-right md:text-right">
                      <div className="flex gap-1 justify-end md:justify-end">
                        <p>{info?.details}</p>
                        {info?.description === 'Contact Email' && (
                          <Image
                            src={
                              !openContactEmailEditBox
                                ? '/icons/right-arrow.png'
                                : '/icons/top-arrow.png'
                            }
                            width={21}
                            height={21}
                            alt=""
                            onClick={() =>
                              setOpenContactEmailEditBox(
                                !openContactEmailEditBox,
                              )
                            }
                          />
                        )}
                        {info?.description === 'Contact Number' && (
                          <Image
                            src={
                              !openContactNumberEdit
                                ? '/icons/right-arrow.png'
                                : '/icons/top-arrow.png'
                            }
                            width={21}
                            height={21}
                            alt=""
                            onClick={() =>
                              setOpenContactNumberEdit(!openContactNumberEdit)
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* {info?.description === 'Contact Email' &&
                      openContactEmailEditBox && (
                        <>
                          <input
                            type="text"
                            autoComplete="off"
                            value={inputContact}
                            onChange={(e) => setInputContact(e.target.value)}
                            className="w-full p-3 focus:outline-none border-2 border-gray-200 rounded-lg bg-white number-input mb-4"
                          />
                          <div className="mb-4 flex justify-between">
                            <div />
                            <div>
                              <button
                                type="button"
                                className="font-semibold  text-xs md:text-sm text-blue py-[10px]  px-6 rounded-full bg-grayPrimary mr-2"
                                onClick={() =>
                                  setOpenContactEmailEditBox(
                                    !openContactEmailEditBox,
                                  )
                                }
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="font-semibold  text-xs md:text-sm text-white py-[10px] w-[95px] px-6 rounded-full bg-blue mr-2"
                                onClick={() => {
                                  setContactEmail(inputContact);
                                  setOpenContactEmailEditBox(
                                    !openContactEmailEditBox,
                                  );
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </>
                      )} */}
                    {info?.description === 'Contact Number' &&
                      openContactNumberEdit && (
                        <>
                          <PhoneInput
                            country="us"
                            excludeCountries={exculdedCountries}
                            containerClass="border-2 border-gray-200 rounded-lg bg-white mb-4"
                            inputClass="w-full focus:outline-none bg-white number-input"
                            inputStyle={{
                              width: '100%',
                              height: '50px',
                              fontSize: '16px',
                              fontWeight: '300',
                            }}
                            enableAreaCodes
                            enableSearch
                            value={inputContactNumber}
                            onChange={(value, country, e, formattedValue) => {
                              setInputContactNumber(formattedValue);
                            }}
                          />
                          <div className="flex gap-3">
                            <div className="mt-3">
                              <input
                                type="checkbox"
                                className="checkbox1"
                                onChange={(e) => handleTermsCheckChange(e)}
                              />
                            </div>
                            <div className="text-slate-600 text-sm lg:text-base">
                              By checking this box, you agree to receive
                              informational, non-marketing text messages at the
                              phone number you provided above. Text STOP to
                              cancel. Consent not required to purchase goods or
                              services. Message and data rates may apply.{' '}
                            </div>
                          </div>
                          <div className="mb-4 mt-4 flex justify-between">
                            <div />
                            <div>
                              <button
                                type="button"
                                className="font-semibold  text-xs md:text-sm text-blue py-[10px]  px-6 rounded-full bg-grayPrimary mr-2"
                                onClick={() =>
                                  setOpenContactNumberEdit(
                                    !openContactNumberEdit,
                                  )
                                }
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className={`font-semibold  text-xs md:text-sm ${
                                  !termsChecked ? 'bg-blue/40' : 'bg-blue'
                                } py-[10px] w-[95px] px-6 rounded-full text-white mr-2`}
                                disabled={!termsChecked}
                                onClick={handleSavePhoneClick}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="lg:w-3/5 border-2 rounded-2xl p-3 lg:p-6">
          <h3 className="text-xl font-medium mb-4">Wallet</h3>
          <div className="divide-y-2">
            {invoice2.map((info, i) => (
              <React.Fragment key={i}>
                <div className="flex pb-3 pt-2 flex-wrap items-center space-y-2">
                  <p className="font-medium w-[62%] md:w-1/2">
                    <span>{info?.description}</span>
                  </p>
                  <div className="w-[38%] md:w-1/2 text-right md:text-right">
                    <div className="flex gap-1 justify-end md:justify-end">
                      <p className="break-all">
                        <span>{info?.details}</span>
                      </p>
                    </div>
                  </div>
                  {info?.subDescription &&
                    info?.subDescription.map((innerInfo, i) => (
                      <React.Fragment key={i}>
                        <div className="pt-1 md:pt-0 w-[65%] md:w-1/2 lg:pl-6">
                          {innerInfo?.description}
                        </div>
                        <div className="pt-1 md:pt-0 w-[35%] md:w-1/2 text-right md:text-right">
                          <div className="flex gap-1 justify-end md:justify-end">
                            <p>{innerInfo?.details}</p>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* <div className="lg:w-3/5 border-2 rounded-2xl p-3 lg:p-6">
          <h3 className="text-xl font-medium mb-4">Security</h3>
          <div className="divide-y-2" />
        </div> */}
      </section>
      {/* ---------------------- First Section End ------------------------ */}

      {/* ---------------------- when choose Coinbase or Gemini Account start ------------------------ */}
      {openModalFor && openModalFor === 'Transfer Fund' && (
        <ModalContainer>
          <TransferFundModal
            setOpenModalFor={setOpenModalFor}
            ethBalance={ethBalance?.value}
            wethBalance={wethBalance?.formatted}
            usdcBalance={usdcBalance?.formatted}
            compBalance={compBalance?.formatted}
          />
        </ModalContainer>
      )}
      {/* ---------------------- when choose Coinbase or Gemini Account End ------------------------ */}
    </main>
  );
};

export default Profile;
