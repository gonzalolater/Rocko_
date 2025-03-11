import React from 'react';
import clsx from 'clsx';

type Props = React.HTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'info';
};

function Button(props: Props) {
  const { variant = 'primary', className, children, ...rest } = props;

  return (
    <button
      className={clsx(
        'px-[28px] py-[14px] text-base rounded-full duration-500',
        variant === 'primary' && 'text-white bg-blue hover:bg-[#6b3493]',
        variant === 'secondary' && 'text-blue bg-grayPrimary',
        variant === 'info' && 'text-white bg-[#ABB1D1]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
