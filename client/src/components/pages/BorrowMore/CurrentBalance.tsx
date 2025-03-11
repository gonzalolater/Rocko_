import Card from '@/components/Card';
import CardDataRow from '@/components/Card/CardDataRow';
import Divider from '@/components/Divider';
import React from 'react';
import CardHeader from '@/components/pages/BorrowMore/CardHeader';
import usdc from '@/assets/coins/USD Coin (USDC).svg';
import Button from '@/components/Button';
import Link from 'next/link';
import Alerts from './Alerts';

export type CurrentBalanceData = {
  dateOpened: string;
  currentApr: string;
  averageApr: string;
  interestAccrued: string;
  symbol: string;
  balance: string;
};

type Props = {
  data: CurrentBalanceData;
  borrowMoreClick: () => void;
};

export default function CurrentBalance(props: Props) {
  const { borrowMoreClick, data } = props;
  const {
    dateOpened,
    currentApr,
    averageApr,
    interestAccrued,
    symbol,
    balance,
  } = data;

  const currentBalanceCardData = [
    {
      title: 'Interest Accrued',
      value: interestAccrued,
    },
    {
      title: 'Current APR',
      value: currentApr,
    },
    {
      title: 'Average APR',
      value: averageApr,
      infoText: 'Average APR',
    },
  ];

  return (
    <Card title="Current balance">
      <CardHeader balance={balance} symbol={symbol} icon={usdc} />
      <Divider />
      <CardDataRow items={currentBalanceCardData} />
      <Divider />
      <CardDataRow items={[{ title: 'Date Opened', value: dateOpened }]} />
      <Alerts title="APR Alerts" />
      <div className="flex gap-4 sm:gap-6 mt-6 items-center flex-col sm:flex-row">
        <Button className="sm:w-auto w-full">Make a Payment</Button>
        <Button
          className="sm:w-auto w-full"
          onClick={borrowMoreClick}
          variant="secondary"
        >
          Borrow More
        </Button>
        <p className="text-sm text-blackSecondary flex-1">
          There is no payment due date for this loan. You can repay it in part
          or in full at anytime.{' '}
          <Link href="#" className="underline">
            Learn more.
          </Link>
        </p>
      </div>
    </Card>
  );
}
