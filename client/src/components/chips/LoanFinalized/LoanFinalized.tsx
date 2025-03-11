import Image from 'next/image';
import Link from 'next/link';
import frameIcon from '@/assets/frame.svg';
import useLoanData from '@/hooks/useLoanData';
import ModalContent from '../ModalContent/ModalContent';

type Props = {
  navType: string;
  buttonText?: string;
  url?: string;
  title?: string;
  description?: string;
};

function LoanFinalized(props: Props) {
  const {
    navType,
    title = 'Loan Ready for Funding!',
    description = 'You can track the status on the next page.',
    url = '/depositing-collateral',
    buttonText = 'Continue',
  } = props;
  const { loanData } = useLoanData();

  const onContinue = () => {
    const { sessionStorage } = window;
    if (loanData) sessionStorage.setItem('loanData', JSON.stringify(loanData));
  };

  return (
    <ModalContent>
      <div className="w-16 h-16 rounded-full bg-[#EFF3FE] p-4">
        <Image
          src={frameIcon}
          alt=""
          width={34}
          height={27}
          className="w-full"
        />
      </div>
      <div className="space-y-2 ">
        <h4 className=" text-[24px] font-semibold text-[#141414]  font-inter">
          {title}
        </h4>
        <p className="text-[14px] text-[#141414]  font-inter ">{description}</p>
      </div>

      {/* continue button */}
      <div className="my-6">
        <Link href={`${url}?type=${navType}`}>
          <button
            type="button"
            onClick={onContinue}
            className="py-[10px] px-6 bg-[#2C3B8D] rounded-full text-sm font-semibold text-white"
          >
            {buttonText}
          </button>
        </Link>
      </div>
    </ModalContent>
  );
}

export default LoanFinalized;
