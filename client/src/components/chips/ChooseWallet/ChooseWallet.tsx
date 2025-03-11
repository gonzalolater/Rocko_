import React, { useState } from 'react';
import Image from 'next/image';
import closeIcon from '@/assets/Close.svg';
import ModalContent from '../ModalContent/ModalContent';
import CoinbaseLoginBtn from '../CoinbaseLoginBtn/CoinbaseLoginBtn';

function ChooseWallet({
  setOpenModalFor,
  setModalStep,
  setConnect,
}: {
  setOpenModalFor: Function; //! if openModalFor's value is empty string then popup modal is closed if it's not empty string
  setModalStep: Function; //! passing modalStep value to chooseWallet popup/modal. If modalStep's value is 1 then it will redirect to loanFinalized popup after user clicking continue btn on chooseWallet popup/modal.
  // eslint-disable-next-line no-unused-vars
  setConnect?: (value: boolean) => void; //! setConnect is only passed from modify-collateral page that's why it's optional
}) {
  const [activeBtn, setActiveBtn] = useState<boolean>(false); //! on clicking any radio button the value will be true and continue btn will be activated
  const [selected, setSelected] = useState<string>('');

  const handleContinueBtn = () => {
    if (setConnect) {
      setConnect(false);
      setOpenModalFor('');
    } else {
      setModalStep(1);
    }
  };

  return (
    <ModalContent>
      {/* instruction */}
      <div className="flex items-start justify-between gap-2 ">
        <div className="space-y-2 ">
          <h4 className="text-2xl font-semibold font-inter">
            Choose Your Exchange Account
          </h4>
          <p className="text-sm text-[#141414] font-inter ">
            After logging in, you will be asked to grant your Rocko wallet
            permission to view wallet addresses and deposit/withdraw funds. Your
            Rocko wallet will only deposit/withdraw the amounts specified and
            authorized by you.
          </p>
        </div>
        <div className="">
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
      </div>
      {/* select option */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="Coinbase"
            name="recommended-wallet"
            value="Coinbase"
            className="w-5 h-5 md:w-7 md:h-7 border-2 border-black"
            onClick={() => {
              setActiveBtn(true);
              setSelected('Coinbase');
            }}
          />
          <label htmlFor="Coinbase" className="pl-4">
            <p className="font-semibold">Coinbase</p>
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="Gemini"
            name="recommended-wallet"
            value="Gemini"
            className="w-5 h-5 md:w-7 md:h-7 border-2 border-black"
            onClick={() => {
              setActiveBtn(true);
              setSelected('Gemini');
            }}
          />
          <label htmlFor="Gemini" className="pl-4">
            <p className="font-semibold">Gemini</p>
          </label>
        </div>
      </div>

      {/* continue button */}
      {/* <div className="">
        {selectedWallet === "Coinbase" ? (
            <CoinbaseLoginBtn setModalStep={setModalStep} />
        ) : (
            <button onClick={()=>setModalStep(1)} className="py-[10px] px-6 bg-[#2C3B8D] rounded-full text-sm font-semibold text-white">
                Continue
            </button>
        )}
    </div> */}
      <div>
        {selected === 'Coinbase' ? (
          <CoinbaseLoginBtn
            setConnect={setConnect}
            setOpenModalFor={setOpenModalFor}
          />
        ) : (
          <button
            type="button"
            onClick={handleContinueBtn}
            className={`py-[10px] px-6  rounded-full text-sm font-semibold  ${
              activeBtn
                ? 'bg-[#2C3B8D] text-white'
                : 'text-gray-100 bg-[#ABB1D1]'
            }`}
            disabled={!activeBtn} //! on clicking any radio button the value will be false and continue btn will be activated
          >
            Continue
          </button>
        )}
      </div>
    </ModalContent>
  );
}

export default ChooseWallet;
