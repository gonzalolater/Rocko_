import Card from '@/components/Card';
import CardDataRow from '@/components/Card/CardDataRow';
import Divider from '@/components/Divider';
import React from 'react';
import comp from '@/assets/coins/Compound (COMP).svg';
import CardHeader from './CardHeader';

function Rewards() {
  return (
    <Card title="Rewards">
      <CardHeader
        title="Rewards Earned"
        balance="0.0217"
        symbol="COMP"
        icon={comp}
      />
      <Divider />
      <CardDataRow
        items={[
          {
            title: 'Rewards Rate',
            value: '2.54%',
          },
        ]}
      />
      <div className="p-6 rounded-2xl text-sm mt-[40px] sm:mt-[70px] bg-whiteTertiary">
        <p className="text-sm text-blackSecondary">
          Compound protocol offers rewards in its Comp token for usage of the
          protocol. Your Rocko wallet will automatically claim your rewards for
          you when your loan is repaid.
        </p>
      </div>
    </Card>
  );
}

export default Rewards;
