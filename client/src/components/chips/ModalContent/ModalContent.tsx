import { ReactNode } from 'react';
import clsx from 'clsx';

function ModalContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'p-6 bg-white max-w-[496px] w-full rounded-[20px] flex flex-col gap-8',
        className,
      )}
    >
      {' '}
      {children}
    </div>
  );
}

export default ModalContent;
