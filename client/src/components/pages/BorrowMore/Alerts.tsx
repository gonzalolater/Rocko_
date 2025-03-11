import React from 'react';
import alert from '@/assets/alert.svg';
import ToggleBtn from '@/components/chips/ToggleBtn/ToogleBtn';
import Image from 'next/image';
import Button from '@/components/Button';
import clsx from 'clsx';

type Props = {
  title: string;
  className?: string;
};

export default function Alerts(props: Props) {
  const { title, className } = props;
  const sm = window.matchMedia('(max-width: 640px)').matches;
  return (
    <div
      className={clsx(
        'bg-whiteTertiary p-4 flex-col sm:flex-row gap-6 sm:gap-2 flex justify-between items-center rounded-2xl',
        className,
      )}
    >
      <div className="flex items-center sm:w-auto gap-2 sm:gap-0 w-full justify-center">
        <Image
          src={alert}
          alt="alert"
          height={sm ? 32 : 36}
          width={sm ? 32 : 36}
          className="sm:h-9 sm:w-9 h-8 w-8 rounded-full p-2 bg-grayPrimary"
        />
        <div className="flex flex-0 sm:flex-1 ml-2">
          <p className="text-base font-medium">{title}</p>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:gap-1">
        <Button
          className="!mx-4 !text-sm !px-3 !py-2 w-full sm:w-auto"
          variant="secondary"
        >
          {' '}
          Manage Alerts
        </Button>
        <div className="flex items-center sm:w-auto w-full justify-center">
          <p className="mr-[9px] text-blackSecondary text-base">Alert On</p>
          <ToggleBtn />
        </div>
      </div>
    </div>
  );
}
