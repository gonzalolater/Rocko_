import React from 'react';
import Image from 'next/image';
import frame from '@/assets/coins/Frame.svg';
import audited from '@/assets/coins/audited.svg';

type ProtocolBannerProps = React.HTMLAttributes<HTMLButtonElement> & {
  label?: string;
  title?: string;
};

function ProtocolBanner(props: ProtocolBannerProps) {
  const { label, title } = props;

  return (
    <div className="flex items-center flex-wrap lg:flex-nowrap justify-center lg:justify-start lg:gap-x-[40px] gap-x-[20px]   lg:p-[40px] md:p-[25px] p-[16px] bg-[#5ccee51a] !border-0 rounded-[16px]">
      <div className="lg:mb-[0] mb-[20px]">
        <Image
          src={frame}
          alt="Ether"
          className="md-w-[150px] lg:w-[192px] w-[100px]"
        />
      </div>
      <div>
        <div className="text-[#545454] leading-6 text-[16px] font-medium mb-1 flex justify-center lg:justify-start items-center gap-x-[4px]">
          <Image src={audited} alt="Ether" className="" />
          {label}
        </div>
        <h5 className="text-[#0F2E35] leading-8 lg:text-[24px] text-[20px] font-medium">
          {title}
        </h5>
      </div>
    </div>
  );
}

export default ProtocolBanner;
