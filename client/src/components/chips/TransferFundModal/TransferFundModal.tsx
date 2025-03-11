/* eslint-disable jsx-a11y/control-has-associated-label */
import Image from 'next/image';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import closeIcon from '@/assets/Close.svg';
import logger from '@/utility/logger';
import addressValidator from '@/utility/addressValidator';
import { useRockoDisconnect } from '@/hooks/useRockoDisconnect';
import { useRockoWalletTransaction } from '@/hooks/useRockoWalletTransaction';
import ModalContent from '../ModalContent/ModalContent';
import TransferConfirmModal from '../TransferConfirmModal/TransferConfirmModal';

function TransferFundModal({
  setOpenModalFor,
  ethBalance,
  wethBalance,
  usdcBalance,
  compBalance,
}: {
  setOpenModalFor: Function;
  ethBalance: bigint | undefined;
  wethBalance: string | undefined;
  usdcBalance: string | undefined;
  compBalance: string | undefined;
}) {
  const [txStarted, setTxStarted] = useState<boolean>(false);
  const [txHash, setTxHash] = useState('');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [destination, setDestination] = useState('');
  const { disconnect } = useRockoDisconnect();
  const { batchWithdraw } = useRockoWalletTransaction({
    destination,
    ethBalance,
    wethBalance,
    usdcBalance,
    compBalance,
    setTxHash,
    setConfirmed,
  });

  const withdraw = async () => {
    setTxStarted(true);

    // console.log('Withdrawal using token:', sessionStorage.getItem('token'));
    await addressValidator(destination, disconnect);
    try {
      if (batchWithdraw) batchWithdraw();
    } catch (e) {
      logger(JSON.stringify(e, null, 2), 'error');
    }
  };

  return (
    <ModalContent>
      {!txStarted ? (
        <>
          <div className="flex items-start justify-between gap-2 ">
            <h4 className="text-2xl font-semibold font-inter">
              Transfer Funds
            </h4>
            {/* close button start */}
            <div>
              <button
                type="button"
                onClick={() => setOpenModalFor('')}
                className="w-8 h-8 rounded-full p-2 bg-[#EEE] block"
              >
                <Image
                  src={closeIcon}
                  alt=""
                  width={16}
                  height={16}
                  className="w-full"
                />
              </button>
            </div>
            {/* close button end */}
          </div>
          {/* select option */}
          <div className="space-y-3">
            <p className="font-medium text-[#141414]">
              You are transferring all funds in your Rocko smart wallet to the
              address input below
            </p>
          </div>
          {/* input field with react form hook */}
          <div>
            <p className="text-sm mb-2 font-bold"> Enter Wallet Address </p>
            <input
              type="text"
              autoComplete="off"
              id="numberField"
              className="w-full p-4 focus:outline-none border-2 border-gray-200 rounded-lg bg-white number-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="flex items-start gap-2 ">
            <button
              type="button"
              className={`py-[10px] px-6  rounded-full text-sm font-semibold  ${
                ethers.utils.isAddress(destination)
                  ? 'bg-[#2C3B8D] text-white'
                  : 'text-gray-100 bg-[#ABB1D1]'
              }`}
              disabled={!ethers.utils.isAddress(destination)}
              onClick={withdraw}
            >
              Confirm
            </button>
            <button
              type="button"
              className="py-[10px] px-6  rounded-full text-sm font-semibold bg-grayPrimary text-[#2C3B8D]"
              onClick={() => setOpenModalFor('')}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <TransferConfirmModal
          setOpenModalFor={setOpenModalFor}
          confirmed={confirmed}
          txHash={txHash}
        />
      )}
    </ModalContent>
  );
}

export default TransferFundModal;
