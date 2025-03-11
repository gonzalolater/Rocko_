import React from 'react';
import clsx from 'clsx';
import HoverTooltip from '../chips/HoverTooltip/HoverTooltip';

type Item = {
  title: string;
  value: string;
  infoText?: string;
  classes?: { title?: string; value?: string };
};
type Props = {
  items: Item[];
};

type RowProps = { data: Item };

function CardDataRow(props: Props) {
  const { items } = props;
  return (
    <div className="py-4 gap-3 flex flex-row">
      {items.map((item) => (
        <Column key={item.title} data={item} />
      ))}
    </div>
  );
}

function Column({ data }: RowProps) {
  const { title, value, infoText, classes } = data;
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-row gap-2 items-center">
        <p
          className={clsx(
            'm-0 sm:text-base text-sm leading-6 text-blackPrimary',
            classes?.title,
          )}
        >
          {title}
        </p>
        {infoText && <HoverTooltip text={infoText} />}
      </div>
      <p
        className={clsx(
          'mt-2 sm:text-lg text-base leading-6 font-medium text-blackPrimary',
          classes?.value,
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default CardDataRow;
