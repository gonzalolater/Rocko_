import ModalContent from '@/components/chips/ModalContent/ModalContent';
import closeIcon from '@/assets/Close.svg';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import financial from '@/utility/currencyFormate';
import { useSingleLoan } from '@/contract/single';
import logger from '@/utility/logger';

function ModifyWallet({
  setOpenModalFor,
  currentBalance,
  collateral,
}: {
  setOpenModalFor: Function;
  currentBalance: string;
  collateral: string;
}) {
  const basicRouter = useParams();
  const loanIndex = parseFloat(basicRouter.single.toString() || '0');
  const [activeInputField, setActiveInputField] = useState(false); //! input field active on selecting radio btn
  const [inputNumber, setInputNumber] = useState<string | undefined>(); //! turning inputNumber into inputText to save & show number with commas on onBlur handler & number without commas on onFocus handler in inputfiled
  const [changeInputType, setChangeInputType] = useState<string>('text'); //! to show value with commas & without commas n inputfiled on onBlur handler
  const [amount, setAmount] = useState<string>(''); //! amount could be "add" or "widthraw" based on user's intention & amount value is passed through URL query for the reaction of next page based on user's intention

  const { getETHPrice, getLiquidationPrice, getBuffer } = useSingleLoan();
  const [collateralPrice, setCollateralPrice] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState<any>();
  const [buffer, setBuffer] = useState<any>();

  const balanceFloat = parseFloat(currentBalance?.replace(/,/g, '') || '0');
  const inputFloat = parseFloat(inputNumber?.replace(/,/g, '') || '0');
  const new_collateral =
    amount === 'add'
      ? Number(collateral) + (inputFloat || 0)
      : Number(collateral) - (inputFloat || 0);

  const handleDecimalsOnValue = (value: any) => {
    const regex = /([0-9]*[\.]{0,1}[0-9]{0,18})/s;
    return value.match(regex)[0];
  };

  const handleBorrowValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;
    setInputNumber(handleDecimalsOnValue(inputValue));

    setChangeInputType('number'); /* show number without commas */
    setActiveInputField(true);
  };

  useEffect(() => {
    getETHPrice()
      .then((_price) => setCollateralPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getLiquidationPrice(balanceFloat, new_collateral)
      .then((_price) => setLiquidationPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getBuffer(balanceFloat, new_collateral)
      .then((_buffer) => setBuffer(_buffer))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));
  });

  return (
    <ModalContent>
      <div className="flex items-start justify-between gap-2 ">
        <h4 className="text-2xl font-semibold font-inter">Modify Collateral</h4>
        {/* close button start */}
        <div>
          <button
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
        {/* radio button-1 */}
        <div className="flex items-center">
          <input
            type="radio"
            id="Coinbase"
            name="recommended-wallet"
            value="Coinbase"
            className="w-5 h-5 md:w-7 md:h-7 border-2 border-black"
            onClick={() => {
              setActiveInputField(true);
              setAmount('add');
            }}
          />
          <label htmlFor="Coinbase" className="pl-4">
            <p className="font-semibold">Add Collateral</p>
          </label>
        </div>
        {/* radio button-2 */}
        <div className="flex items-center">
          <input
            type="radio"
            id="Gemini"
            name="recommended-wallet"
            value="Gemini"
            className="w-5 h-5 md:w-7 md:h-7 border-2 border-black"
            onClick={() => {
              setActiveInputField(true);
              setAmount('withdraw');
            }}
          />
          <label htmlFor="Gemini" className="pl-4">
            <p className="font-semibold">Withdraw Collateral</p>
          </label>
        </div>
      </div>
      {/* input field with react form hook */}
      <div>
        <p className="text-sm mb-2 font-bold"> Enter Collateral Amount</p>
        <input
          name="numberInput"
          type={changeInputType} /* switch between "text" & "number" */
          autoComplete="off"
          id="numberField"
          min={1}
          onKeyDown={(event) => {
            const keyPressed = event.key;
            // const isDecimalDigit = /^\d+$/.test(keyPressed);
            const isAllowedHexChar = /^[a-eA-E]+$/.test(keyPressed);

            if (
              /* not allowing any character without number */
              isAllowedHexChar
            ) {
              event.preventDefault();
            }
            if (event.key === '-') {
              event.preventDefault();
            }
          }}
          className="w-full p-4 focus:outline-none border-2 border-gray-200 rounded-lg bg-white number-input"
          placeholder="10,000"
          disabled={!activeInputField} /* active on selecting radio button */
          value={inputNumber}
          onFocus={() => {
            const valueWithoutCommas = inputNumber?.replace(/,/g, '');
            setInputNumber(valueWithoutCommas);
            setChangeInputType('number');
          }}
          onBlur={() => {
            /* on onBlur set the number */
            // const valueWithoutCommas = parseFloat(
            //   inputNumber?.replace(/,/g, "") || "0"
            // );
            // setInputNumber(
            //   new Intl.NumberFormat("en-US", {
            //     maximumFractionDigits: 100,
            //   }).format(valueWithoutCommas)
            // );
            // setChangeInputType("text");
          }}
          onChange={handleBorrowValueChange}
        />
        <p
          className={`text-right mr-5 -mt-10 ${
            activeInputField ? 'text-black' : 'text-gray-400'
          }`}
        >
          {' '}
          {/* active text on selecting radion button */}
          ETH
        </p>
        <p className="text-gray-500 text-sm mt-5">
          {inputNumber ? `~$${financial(collateralPrice * inputFloat, 2)}` : ''}
        </p>{' '}
        <p className="text-red-500 text-sm mt-2 p-0.5">
          {buffer < 0 &&
            'You cannot withdraw this collateral amount as it would reduce your collateral value below the required threshold.'}
        </p>{' '}
        {/* after putting a value on inputfield the number will show */}
      </div>
      <div className="p-6 bg-gray-100 rounded-2xl">
        <p className="font-semibold mb-6">
          Projected values after collateral modification
        </p>
        <div className="grid grid-cols-2 space-y-2">
          <p className="text-sm text-gray-600">Total Collateral</p>
          {/* after putting a value on inputfield the number(based on user's intention like "add" or "withdraw") will show */}
          <p className="font-semibold text-right">
            {inputNumber ? `${financial(new_collateral, 18)} ETH` : '--'}
            <span className="block text-gray-600 text-sm font-normal">
              {inputNumber
                ? `~$${financial(new_collateral * collateralPrice, 2)}`
                : ''}
            </span>
          </p>
          <p className="text-sm text-gray-600">Collateral Buffer</p>
          <p className="font-semibold text-right">
            {inputNumber ? `${financial(buffer * 100)}%` : '--'}
          </p>
          <p className="text-sm text-gray-600">Liquidation Price (ETH)</p>
          <p className="font-semibold text-right">
            {inputNumber ? `$${financial(liquidationPrice, 2)}` : '--'}
          </p>
        </div>
      </div>
      {/* continue button */}
      <Link
        href={`/loan-dashboard/${loanIndex}/${'modify_collateral'}?try=${amount}&payment=${inputNumber}&collateral=${collateral}&balance=${balanceFloat}`}
      >
        {' '}
        {/* passing the user's intention like "add" or "withdraw" throuth query */}
        <button
          className={`py-[10px] px-6  rounded-full text-sm font-semibold  ${
            !inputNumber || buffer < 0
              ? 'text-gray-100 bg-[#ABB1D1]'
              : 'bg-[#2C3B8D] text-white'
          }`}
          disabled={!!(!inputNumber || buffer < 0)}
        >
          Continue
        </button>
      </Link>
    </ModalContent>
  );
}

export default ModifyWallet;
