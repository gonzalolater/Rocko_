import Card from '@/components/Card';
import CardDataRow from '@/components/Card/CardDataRow';
import Divider from '@/components/Divider';
import React from 'react';

function CollateralParameters() {
  return (
    <Card title="Collateral Parameters">
      <CardDataRow
        items={[
          {
            title: 'Loan-to-Value Ratio',
            infoText: 'Loan-to-Value Ratio',
            value: '83%',
          },
        ]}
      />
      <Divider />
      <CardDataRow
        items={[
          {
            title: 'Liquidation Threshold',
            infoText: 'Liquidation Threshold',
            value: '90%',
          },
        ]}
      />
      <Divider />
      <CardDataRow
        items={[
          {
            title: 'Liquidation Penalty',
            infoText: 'Liquidation Penalty',
            value: '5%',
          },
        ]}
      />
      <CardDataRow items={[]} />
    </Card>
  );
}

export default CollateralParameters;
