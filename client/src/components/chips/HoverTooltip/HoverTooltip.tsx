import Image from 'next/image';
import React from 'react';
import errorOutline from '@/assets/error_outline.svg';
import clsx from 'clsx';

interface HoverTooltipProps {
  text: string;
  className?: string;
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({ text, className }) => (
  <span className={clsx(className, 'relative group')}>
    <Image width={16} height={16} src={errorOutline} alt="" className="" />

    {/* tooltip text */}
    <span className="whitespace-pre-wrap w-96 bg-gray-800 text-white text-xs py-2 px-2 rounded absolute bottom-8 left-1/2 transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 group-hover:z-20">
      {/* text here */}
      {text}
    </span>

    {/* tooltip arrow box */}
    <span className="arrow-down absolute bottom-6 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 left-1/2 transform -translate-x-1/2 bg-gray-800 w-4 h-4 rotate-45 -z-1 group-hover:-z-2" />
  </span>
);

export default HoverTooltip;
