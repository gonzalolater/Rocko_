import frameIcon from '@/assets/frame.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { etherscanLink } from '@/utility/utils';
import CircleProgressBar from '../CircleProgressBar/CircleProgressBar';

function TransferConfirmModal({
  setOpenModalFor,
  confirmed,
  txHash,
}: {
  setOpenModalFor: Function;
  confirmed: boolean;
  txHash: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress === 80) {
        clearInterval(interval);
      } else {
        setProgress((prevProg) => prevProg + 20);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div>
      {confirmed && (
        <div className="w-16 h-16 rounded-full bg-[#EFF3FE] p-4">
          <Image
            src={frameIcon}
            alt=""
            width={34}
            height={27}
            className="w-full"
          />
        </div>
      )}
      <div className="mt-3 space-y-2 ">
        {confirmed ? (
          <h4 className="text-2xl font-semibold font-inter">Transfer sent</h4>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-2xl font-semibold font-inter">Sending</h4>
            <CircleProgressBar
              circleWidth={18}
              radius={7}
              percentage={progress}
              strokeWidth={2}
            />
          </div>
        )}
        {confirmed && (
          <p className="text-sm text-[#141414] font-inter ">
            Your transfer has been sent.
          </p>
        )}
      </div>
      {txHash !== '' && (
        <div className="mt-3">
          <Link
            className="text-sm text-[#141414] font-bold underline"
            target="_blank"
            href={etherscanLink(txHash)}
            rel="noopener noreferrer"
          >
            View transaction on Etherscan
          </Link>
        </div>
      )}

      {/* continue button */}
      <div className="mt-8">
        <button
          onClick={() => {
            setOpenModalFor('');
          }}
          className={`py-[10px] px-6 rounded-full text-sm font-semibold text-white ${
            confirmed ? 'bg-blue' : 'bg-blue/40'
          }`}
          disabled={!confirmed}
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export default TransferConfirmModal;
