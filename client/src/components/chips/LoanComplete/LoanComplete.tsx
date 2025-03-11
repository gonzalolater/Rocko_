import frameIcon from '@/assets/frame.svg';
import Image from 'next/image';
import Link from 'next/link';
import { etherscanLink } from '@/utility/utils';
import ModalContent from '../ModalContent/ModalContent';

function LoanComplete({
  title,
  details,
  id,
  txHash,
}: {
  title: string;
  details: string;
  id: number;
  txHash: string;
}) {
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
        <h4 className="text-2xl font-semibold font-inter">{title}</h4>
        <p className="text-sm text-[#141414] font-inter ">{details}</p>
      </div>

      {txHash !== '' && (
        <Link
          className="text-sm text-[#141414] font-bold underline"
          target="_blank"
          href={etherscanLink(txHash)}
          rel="noopener noreferrer"
        >
          View transaction on Etherscan
        </Link>
      )}

      {/* continue button */}
      <div className="my-4">
        {id === 0 ? (
          <Link
            className="py-[10px] px-6 bg-[#2C3B8D] rounded-full text-sm font-semibold text-white"
            href="/loan-dashboard"
          >
            Continue
          </Link>
        ) : (
          <Link
            className="py-[10px] px-6 bg-[#2C3B8D] rounded-full text-sm font-semibold text-white"
            href={`/loan-dashboard/${id}?active=true`}
          >
            Continue
          </Link>
        )}
      </div>
    </ModalContent>
  );
}

export default LoanComplete;
