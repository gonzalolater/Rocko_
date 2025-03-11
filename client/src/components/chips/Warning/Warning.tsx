import Image from 'next/image';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { useRockoAccount } from '@/hooks/useRockoAccount';
import { useRockoBalance } from '@/hooks/useRockoBalance';
import contentCopy from '@/assets/content_copy.svg';
import useLoanData from '@/hooks/useLoanData';
import financial from '@/utility/currencyFormate';
import ModalContent from '../ModalContent/ModalContent';

type Props = { goBack: () => void; proceedAnyway: () => void };

function Warning(props: Props) {
  const { goBack, proceedAnyway } = props;

  const { loanData } = useLoanData();
  const { address: zerodevAccount } = useRockoAccount();
  const { data } = useRockoBalance({
    address: zerodevAccount as `0x${string}`,
  });

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(loanData?.otherAddress);
  };

  return (
    <ModalContent className="max-h-[90vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-2 ">
        <div className="space-y-2 ">
          <h4 className="text-2xl font-semibold font-inter">Warning </h4>
          <p className="text-sm text-[#141414] font-inter ">
            Less than the Amount Required has been received by your Rocko
            wallet. Continuing could result in the transaction failing or
            receiving a loan with a smaller collateral buffer than intended.
          </p>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-normal	text-blackSecondary text-[14px]">
              Amount Received
            </p>
            <p className="font-normal	text-blackPrimary text-[16px]">
              {financial(data?.formatted, 3)} ETH
            </p>
          </div>
        </div>
        <div className="py-[5px]">
          <p className="font-normal	text-blackSecondary text-[14px]">
            Amount Required
          </p>
          <p className="font-normal	text-blackPrimary text-[16px]">
            {financial(loanData?.collateralNeeded, 3)} ETH
          </p>
        </div>
        <div className="flex justify-between items-center pt-[5px]">
          <div>
            <p className="font-normal	text-blackSecondary text-[14px]">
              Address
            </p>
            <p className="font-normal	text-blackPrimary text-[14px] text-wrap">
              {loanData?.otherAddress}
            </p>
          </div>
          <Image
            src={contentCopy}
            onClick={copyToClipboard}
            alt="contentCopy"
            className="cursor-pointer"
          />
        </div>
        <div className=" flex   flex-col py-[5px]">
          <QRCode value={loanData?.otherAddress} size={100} />
          <p className="text-blackSecondary text-[14px]   mt-[12px]">
            Scan within your exchange mobile app
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center flex-wrap">
        <button
          type="button"
          onClick={goBack}
          className="py-[10px] px-6 rounded-full text-sm font-semibold bg-[#2C3B8D] text-white"
        >
          Go back and add collateral
        </button>
        <Link href="/depositing-collateral?type=start">
          <button
            type="button"
            onClick={proceedAnyway}
            className="text-[#141414] font-normal underline-offset-1 underline text-[12px] mt-[8px] w-full text-center p-0 m-0 outline-0 border-0"
          >
            Proceed anyway
          </button>
        </Link>
      </div>
    </ModalContent>
  );
}

export default Warning;
