import { LoanData } from '@/types/type';
import closeIcon from '@/assets/Close.svg';
import useLoanData from '@/hooks/useLoanData';
import financial from '@/utility/currencyFormate';
import { useEffect, useState } from 'react';
import { useSingleLoan } from '@/contract/single';
import Image from 'next/image';
import ModalContent from '../ModalContent/ModalContent';
import ModalContainer from '../ModalContainer/ModalContainer';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  balance: any;
};

function FinishLoanTransaction(props: Props) {
  const { onCancel, onConfirm, balance } = props;

  const { loanData } = useLoanData();

  return (
    <ModalContainer>
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-2 ">
          <div className="space-y-2 ">
            <h4 className="text-2xl font-semibold font-inter">
              Finish Loan Transaction
            </h4>
            <p className="text-sm text-[#141414] font-inter ">
              Your collateral has been received by your Rocko smart wallet. In
              order to finish your loan transaction and receive your loan,
              please press “Confirm” below. Rocko’s service fee will also be
              sent to Rocko upon confirmation.
            </p>
          </div>
          <div className="">
            <button
              onClick={onCancel}
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
        <BalanceDisplay
          title="Rocko Smart Wallet Balance"
          value={`${balance?.formatted} ETH`}
        />
        <ModalBody loanInfo={loanData} balance={balance} />
        <div className="flex gap-x-[12px]">
          <button
            onClick={onConfirm}
            className="py-[10px] px-6 rounded-full text-sm font-semibold bg-[#2C3B8D] text-white"
          >
            Continue
          </button>
          <button
            onClick={onCancel}
            className="py-[10px] px-6 rounded-full text-sm font-semibold bg-[#EEEEEE] text-[#2C3B8D]"
          >
            Cancel
          </button>
        </div>
      </ModalContent>
    </ModalContainer>
  );
}

type PillProps = {
  title: string;
  value: string;
};

function BalanceDisplay(props: PillProps) {
  const { title, value } = props;
  const containerStyle = {
    borderColor: '#E2E2E2',
    borderWidth: '1px',
    borderRadius: '16px',
    padding: '16px',
    display: 'inline-block',
  };

  const titleStyle = {
    color: '#545454',
    fontSize: '14px',
    fontWeight: '400',
  };

  const bodyStyle = {
    fontSize: '16px',
    fontWeight: '400',
    color: '#141414',
  };

  return (
    <div className="container" style={containerStyle}>
      <p className="title" style={titleStyle}>
        {title}
      </p>
      <div className="body" style={bodyStyle}>
        {value}
      </div>
    </div>
  );
}

type ModalBodyProps = {
  loanInfo: LoanData;
  balance: any;
};

function ModalBody(props: ModalBodyProps) {
  const { getBuffer } = useSingleLoan();
  const { loanInfo, balance } = props;
  const [buffer, setBuffer] = useState<string | number>('N/A');

  useEffect(() => {
    getBuffer(balance, Number(loanInfo?.collateralNeeded))
      .then((_buffer) => setBuffer(_buffer))
      .catch((e) => console.error(e));
  });

  const containerStyle = {
    backgroundColor: '#F9F9F9',
    borderColor: '#F9F9F9',
    borderWidth: '1px',
    borderRadius: '16px',
    padding: '24px',
    display: 'inline-block',
  };

  const titleStyle = {
    color: '#141414',
    fontSize: '16px',
    fontWeight: '500',
  };

  const termContainerStyle = {
    paddingTop: '16px',
  };

  const rowStyle = {
    paddingTop: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const subRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const termTitleStyle = {
    color: '#545454',
    fontSize: '14px',
    fontWeight: '400',
  };

  // Styles for the values in the second column
  const termValueStyle = {
    color: '#141414',
    fontSize: '16px',
    fontWeight: '600',
  };

  const termSubValueStyle = {
    color: '#141414',
    fontSize: '14px',
    fontWeight: '400',
  };

  return (
    <div className="container" style={containerStyle}>
      <p className="title" style={titleStyle}>
        Key Loan Terms
      </p>
      <div style={termContainerStyle}>
        <div style={rowStyle}>
          <div style={termTitleStyle}>Loan Amount</div>
          <div style={termValueStyle}>
            {loanInfo?.borrowing} {loanInfo?.coin}
          </div>
        </div>
        <div style={subRowStyle}>
          <div style={termTitleStyle} />
          <div style={termSubValueStyle}>${loanInfo?.borrowing}</div>
        </div>
        <div style={rowStyle}>
          <div style={termTitleStyle}>Current APR</div>
          <div style={termValueStyle}>
            {financial(loanInfo?.currentAPR, 2)}%
          </div>
        </div>
        <div style={rowStyle}>
          <div style={termTitleStyle}>Projected Collateral Buffer</div>
          <div style={termValueStyle}>{buffer}%</div>
        </div>
        <div style={rowStyle}>
          <div style={termTitleStyle}>Liquidation Price (ETH)</div>
          <div style={termValueStyle}>
            ${financial(loanInfo?.liquidationPrice, 2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinishLoanTransaction;
