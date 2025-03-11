import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';
import CardTitle from './CardTitle';

type Props = PropsWithChildren & { className?: string; title?: string };

const Card: FC<Props> = (props) => {
  const { title, children, className } = props;
  return (
    <div
      className={clsx(
        'sm:p-6 p-4 border border-whiteSecondary rounded-2xl',
        className,
      )}
    >
      <CardTitle title={title} />
      {children}
    </div>
  );
};

export default Card;
