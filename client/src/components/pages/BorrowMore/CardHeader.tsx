import Image, { StaticImageData } from 'next/image';
import React from 'react';

type Props = {
  icon?: string | StaticImageData | { default: StaticImageData };
  balance: string | number;
  symbol: string;
  title?: string;
};

function CardHeader(props: Props) {
  const { icon, title, balance, symbol } = props;
  return (
    <div className="py-4">
      {title && <p className="text-base text-blackPrimary mb-2">{title}</p>}
      <div className="flex flex-1 flex-row justify-between">
        <p className="m-0 text-xl sm:text-2xl">
          {balance} {symbol}
        </p>
        {icon && (
          <Image
            width={24}
            height={24}
            src={icon}
            alt=""
            className="w-6 h-6 rounded-full"
          />
        )}
      </div>
      <p className="text-sm text-[#545454] mt-1">${balance}</p>
    </div>
  );
}

export default CardHeader;
