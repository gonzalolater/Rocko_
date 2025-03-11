import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import closeIcon from '@/assets/Close.svg';
import { useSingleLoan } from '@/contract/single';
import financial from '@/utility/currencyFormate';
import logger from '@/utility/logger';
import ModalContent from '../ModalContent/ModalContent';

function BorrowMoreModal({
  setOpenModalFor,
  currentBalance,
  collateral,
}: {
  setOpenModalFor: Function;
  currentBalance: string;
  collateral: string;
}) {
  const router = useRouter();
  const [inputNumber, setInputNumber] = useState<string | undefined>(); //! for loan
  const [inputCollateral, setInputCollateral] = useState<string | undefined>(); //! for collateral
  const [changeInputType, setChangeInputType] = useState<string>('text'); //! to show value with commas & without commas n inputfiled on onBlur handler
  const [isAlertShow, setIsAlertShow] = useState<boolean>(false);
  const { getBuffer, getLiquidationPrice, getETHPrice } = useSingleLoan();
  const [buffer, setBuffer] = useState<any>();
  const [liquidationPrice, setLiquidationPrice] = useState<any>();
  const [collateralPrice, setCollateralPrice] = useState<number>(0);

  const inputFloat = parseFloat(inputNumber?.replace(/,/g, '') || '0');
  const balanceFloat = parseFloat(currentBalance?.replace(/,/g, '') || '0');
  const outstanding_balance = balanceFloat + inputFloat;

  const collateralFloat = parseFloat(inputCollateral?.replace(/,/g, '') || '0');
  const originCollateral = parseFloat(collateral || '0');
  const newCollateral = collateralFloat + originCollateral;

  const handleDecimalsOnValue = (value: any) => {
    const regex = /([0-9]*[\.]{0,1}[0-9]{0,6})/s;
    return value.match(regex)[0];
  };

  const handleBorrowValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsAlertShow(false);

    const inputValue = event.target.value;

    setInputNumber(handleDecimalsOnValue(inputValue));
    setChangeInputType('number'); /* show number without commas */
  };

  const handleCollateralValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsAlertShow(false);

    const inputValue = event.target.value;

    setInputCollateral(handleDecimalsOnValue(inputValue));
    setChangeInputType('number'); /* show number without commas */
  };

  const onClickContinue = () => {
    // might be causing a bug so commenting out for now
    // if (collateralFloat === 0) {
    //   setIsAlertShow(true);
    //   return;
    // }

    const borrowMoreObj = {
      payment_loan: inputFloat,
      payment_collateral: collateralFloat,
      outstanding_balance,
      total_collateral: newCollateral,
      buffer,
      liquidation_price: liquidationPrice,
    };
    const { sessionStorage } = window;
    sessionStorage.setItem('borrowMoreData', JSON.stringify(borrowMoreObj));

    router.push('/loan-dashboard/1/borrow-more');
  };

  useEffect(() => {
    getETHPrice()
      .then((_price) => setCollateralPrice(_price))
      .catch((e) => console.log(e));

    getLiquidationPrice(outstanding_balance, newCollateral)
      .then((_price) => setLiquidationPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getBuffer(outstanding_balance, newCollateral)
      .then((_buffer) => setBuffer(_buffer))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));
  });

  return (
    <ModalContent>
      <div className="flex items-start justify-between gap-2 ">
        <h4 className="text-2xl font-semibold font-inter">Borrow More</h4>
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
        <p className="font-medium text-[#141414]">
          Outstanding Balance: {currentBalance} USDC
        </p>
      </div>
      {/* input field with react form hook */}
      <div>
        <p className="text-sm mb-2 font-bold">
          {' '}
          How much more do you want to borrow?{' '}
        </p>
        <input
          name="numberInput"
          type={changeInputType} /* switch between "text" & "number" */
          autoComplete="off"
          id="numberField"
          min={0}
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
          placeholder="1000"
          value={inputNumber}
          onFocus={() => {
            const valueWithoutCommas = inputNumber?.replace(/,/g, '');
            setInputNumber(valueWithoutCommas);
            setChangeInputType('number');
          }}
          onChange={handleBorrowValueChange}
        />
        <p className="text-right mr-5 -mt-10 text-black">
          {' '}
          {/* active text on selecting radion button */}
          USDC
        </p>
      </div>
      {(isAlertShow || (buffer < 0 && inputCollateral)) && (
        <p className="text-red-500 text-sm mt-2 p-0.5">
          You cannot borrow this amount as it would reduce your collateral value
          below the required LTV threshold. Please add additional collateral or
          reduce the borrow amount.
        </p>
      )}
      {/* input field with react form hook end
       */}

      {/* input field with react form hook */}
      <div>
        <p className="text-sm mb-2 font-bold">
          {' '}
          How much additional collateral do you wish to post?{' '}
        </p>
        <input
          name="numberInput"
          type={changeInputType} /* switch between "text" & "number" */
          autoComplete="off"
          id="numberField"
          min={0}
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
          placeholder="1"
          value={inputCollateral}
          onChange={handleCollateralValueChange}
        />
        <p className="text-right mr-5 -mt-10 text-black">
          {' '}
          {/* active text on selecting radion button */}
          ETH
        </p>
      </div>
      {/* input field with react form hook end
       */}

      <div className="p-6 bg-gray-100 rounded-2xl">
        <div className="mb-6">
          <p className="font-semibold ">
            Projected values after loan modification
          </p>
        </div>
        <div className="grid grid-cols-2 space-y-2">
          <p className="text-sm text-gray-600">Outstanding Balance</p>
          {/* after putting a value on inputfield the number(based on user's intention like "add" or "withdraw") will show */}
          <p className="font-semibold text-right">
            {inputNumber ? `${financial(outstanding_balance, 6)} USDC` : '--'}
            <span className="block text-gray-600 text-sm font-normal">
              {inputNumber ? `~$${financial(outstanding_balance, 2)}` : ''}
            </span>
          </p>
          <p className="text-sm text-gray-600">Collateral Posted</p>
          {/* after putting a value on inputfield the number(based on user's intention like "add" or "withdraw") will show */}
          <p className="font-semibold text-right">
            {inputCollateral ? `${financial(newCollateral, 18)} ETH` : '--'}
            <span className="block text-gray-600 text-sm font-normal">
              {inputCollateral
                ? `~$${financial(newCollateral * collateralPrice, 2)}`
                : ''}
            </span>
          </p>
          <p className="text-sm text-gray-600">Collateral Buffer</p>
          <p className="font-semibold text-right">
            {inputNumber || inputCollateral
              ? `${financial(buffer * 100)}%`
              : '--'}
          </p>
          <p className="text-sm text-gray-600">Liquidation Price (ETH)</p>
          <p className="font-semibold text-right">
            {inputNumber || inputCollateral
              ? `$${financial(liquidationPrice, 2)}`
              : '--'}
          </p>
        </div>
      </div>
      {/* continue button */}
      {/* passing the user's intention like "add" or "withdraw" throuth query */}
      <button
        className={`py-[10px] px-6  rounded-full text-sm font-semibold max-w-[25%] ${
          (inputNumber || inputCollateral) && buffer > 0
            ? 'bg-[#2C3B8D] text-white'
            : 'text-gray-100 bg-[#ABB1D1]'
        }`}
        disabled={!((inputNumber || inputCollateral) && buffer > 0)}
        onClick={onClickContinue}
      >
        Continue
      </button>
    </ModalContent>
  );
}

export default BorrowMoreModal;
