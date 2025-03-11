// @ts-ignore
/* eslint-disable */
import Image from 'next/image';
import closeIcon from '@/assets/Close.svg';
import ModalContent from '../ModalContent/ModalContent';
import ModalContainer from '../ModalContainer/ModalContainer';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

function CancelLoanModal(props: Props) {
  const { onCancel, onConfirm } = props;

  // TODO, this should only show if collateral is insufficient
  return (
    <ModalContainer>
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-2 ">
          <div className="space-y-2 ">
            <h4 className="text-2xl font-semibold font-inter">Cancel Loan?</h4>
            <p className="text-sm text-[#141414] font-inter ">
              Are you sure you wish to cancel your loan transaction? If so,
              you’ll need to start from the beginning to get a new loan.
              Additionally, you’ll need to transfer your collateral out of your
              Rocko smart wallet.
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
        <div className="flex gap-x-[12px]  items-center">
          <button
            onClick={onConfirm}
            className="py-[10px] px-6 rounded-full text-sm font-semibold bg-[#2C3B8D] text-white"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="py-[10px] px-6 rounded-full text-sm font-semibold bg-[#EEEEEE] text-[#2C3B8D]"
          >
            Go Back And Finish Loan
          </button>
        </div>
      </ModalContent>
    </ModalContainer>
  );
}

export default CancelLoanModal;
