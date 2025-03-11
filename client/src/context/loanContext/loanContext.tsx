'use client';

import { FC, ReactNode, SetStateAction, createContext, useState } from 'react';
import {
  AssetStep,
  ContextValues,
  CurrencyStep,
  LoanData,
  ProtocolStep,
  RiskStep,
} from '@/types/type';

import usdcIcon from '@/assets/coins/USD Coin (USDC).svg';
import usdIcon from '@/assets/coins/USD.svg';

import { FLAG_MULTI_PROTOCOL } from '@/constants/featureFlags';
import { useProtocolConfig } from '@/protocols';
import { ProtocolConfig } from '@/protocols/types';

export const protocols: any = !FLAG_MULTI_PROTOCOL
  ? []
  : [
      {
        id: 'protocol-0',
        name: 'Compound Config',
        symbol: '/icons/Compound (COMP).svg',
        interestRate: 4.44,
        protocolInfos: [
          {
            id: 'protocol-info-1',
            title: 'Trailing APRs',
            tooltip: 'tooltip information',
            options: [
              {
                name: '30 Day',
                value: '4.01%', // value will percentage
                subInfo: '',
              },
              {
                name: '365 Day',
                value: '3.76%', // value will percentage
                subInfo: '',
              },
            ],
          },
          {
            id: 'protocol-info-2',
            title: 'Collateral Parameters (ETH)',
            tooltip: '',
            options: [
              {
                name: 'Max Loan-to-Value',
                value: '82.5%', // value will percentage
                subInfo: 'Max Loan-to-Value tooltip',
              },
              {
                name: 'Liquidation Threshold',
                value: '86%', // value will percentage
                subInfo: 'Liquidation Threshold tooltip',
              },
              {
                name: 'Liquidation Penalty',
                value: '5%', // value will percentage
                subInfo: 'Liquidation Penalty',
              },
            ],
          },
          {
            id: 'protocol-info-3',
            title: 'Rewards',
            tooltip: 'tooltip information',
            options: [
              {
                name: 'Current Rate',
                value: 'N/A', // value will percentage
                subInfo: '',
              },
              {
                name: 'Trailing 365 average',
                value: 'N/A', // value will percentage
                subInfo: '',
              },
            ],
          },
        ],
      },
      {
        id: 'protocol-2',
        name: 'Aave',
        symbol: '/icons/Aave (AAVE).svg',
        interestRate: 4.02,
        protocolInfos: [
          {
            id: 'protocol-info-1',
            title: 'Trailing APRs',
            tooltip: 'tooltip information',
            options: [
              {
                name: '30 Day',
                value: '4.01%', // value will percentage
                subInfo: '',
              },
              {
                name: '365 Day',
                value: '3.76%', // value will percentage
                subInfo: '',
              },
            ],
          },
          {
            id: 'protocol-info-2',
            title: 'Collateral Parameters (ETH)',
            tooltip: '',
            options: [
              {
                name: 'Max Loan-to-Value',
                value: '82.5%', // value will percentage
                subInfo: 'Max Loan-to-Value tooltip',
              },
              {
                name: 'Liquidation Threshold',
                value: '86%', // value will percentage
                subInfo: 'Liquidation Threshold tooltip',
              },
              {
                name: 'Liquidation Penalty',
                value: '5%', // value will percentage
                subInfo: 'Liquidation Penalty',
              },
            ],
          },
          {
            id: 'protocol-info-3',
            title: 'Rewards',
            tooltip: 'tooltip information',
            options: [
              {
                name: 'Current Rate',
                value: 'N/A', // value will percentage
                subInfo: '',
              },
              {
                name: 'Trailing 365 average',
                value: 'N/A', // value will percentage
                subInfo: '',
              },
            ],
          },
        ],
      },
      {
        id: 'protocol-3',
        name: 'Notional Finance',
        symbol: '/icons/image 18.png',
        interestRate: 5.64,
        protocolInfos: [
          {
            id: 'protocol-info-1',
            title: 'Trailing APRs',
            tooltip: 'tooltip information',
            options: [
              {
                name: '30 Day',
                value: '5.87%', // value will percentage
                subInfo: '',
              },
              {
                name: '365 Day',
                value: '6.2%', // value will percentage
                subInfo: '',
              },
            ],
          },
          {
            id: 'protocol-info-2',
            title: 'Collateral Parameters (ETH)',
            tooltip: '',
            options: [
              {
                name: 'Max Loan-to-Value',
                value: '70%', // value will percentage
                subInfo: 'Max Loan-to-Value tooltip',
              },
              {
                name: 'Liquidation Threshold',
                value: '82%', // value will percentage
                subInfo: 'Liquidation Threshold tooltip',
              },
              {
                name: 'Liquidation Penalty',
                value: '5%', // value will percentage
                subInfo: 'Liquidation Penalty',
              },
            ],
          },
          {
            id: 'protocol-info-3',
            title: 'Rewards',
            tooltip: 'tooltip information',
            options: [
              {
                name: 'Current Rate',
                value: 'N/A', // value will percentage
                subInfo: '',
              },
              {
                name: 'Trailing 365 average',
                value: 'N/A', // value will percentage
                subInfo: '',
              },
            ],
          },
        ],
      },
    ];

const hardcodedMeta: any = {
  eth: {
    loanToValue: 0.7, // data is  in percentage
    liquidationThreshold: 0.82, // data is in percentage
    liquidationPenalty: 0.05, // data is in percentage
    collateralPrice: 8.3145,
    subCollateralPrice: 16548.6,
    liquidationPrice: 1902.48,
    subLiquidationPrice: 2264.82,
  },
  comp: {
    loanToValue: 0.8, // data is  in percentage
    liquidationThreshold: 0.1, // data is in percentage
    liquidationPenalty: 0.06, // data is in percentage
    collateralPrice: 7.3121,
    subCollateralPrice: 13823.6,
    liquidationPrice: 1712.48,
    subLiquidationPrice: 1864.82,
  },
  wbtc: {
    loanToValue: 0.9, // data is  in percentage
    liquidationThreshold: 0.6, // data is in percentage
    liquidationPenalty: 0.04, // data is in percentage
    collateralPrice: 9.0421,
    subCollateralPrice: 30823.6,
    liquidationPrice: 1212.48,
    subLiquidationPrice: 1264.82,
  },
  uni: {
    loanToValue: 0.8, // data is  in percentage
    liquidationThreshold: 0.8, // data is in percentage
    liquidationPenalty: 0.02, // data is in percentage
    collateralPrice: 9.3121,
    subCollateralPrice: 62823.6,
    liquidationPrice: 1542.48,
    subLiquidationPrice: 3864.82,
  },
};
const getSupportedAssets = (protocolConfigs: ProtocolConfig[]) => {
  const seenTickers: any = {}; // Object to keep track of seen tickers
  return protocolConfigs.reduce((acc: any, protocolConfig) => {
    const { collateral } = protocolConfig;
    const uniqueCollateral = collateral.filter((collateralToken) => {
      if (!seenTickers[collateralToken.ticker]) {
        seenTickers[collateralToken.ticker] = true; // Mark this ticker as seen
        return true; // Include this collateralToken since its ticker hasn't been seen before
      }
      return false; // Exclude this collateralToken because its ticker has already been seen
    });

    return acc.concat(
      uniqueCollateral.map((collateralToken) => ({
        id: `asset-${collateralToken.ticker}`,
        name: collateralToken.ticker,
        fullName: collateralToken.fullName,
        symbol: collateralToken.icon,
        comingSoon: collateralToken.comingSoon,
        ...hardcodedMeta[collateralToken.ticker.toLowerCase()],
      })),
    );
  }, []);
};
// [
//   {
//     id: 'asset-1',
//     name: 'ETH',
//     fullName: 'Ether',
//     symbol: etherIcon,
//     comingSoon: false,
//   },

//   {
//     id: 'assets-2',
//     name: 'COMP',
//     fullName: 'Compound',
//     symbol: compoundIcon,
//     comingSoon: true,
//   },

//   {
//     id: 'assets-3',
//     name: 'WBTC',
//     fullName: 'Wrapped Bitcoin',
//     symbol: wrappedIcon,
//     comingSoon: true,
//   },
//   {
//     id: 'assets-4',
//     name: 'UNI',
//     fullName: 'Uniswap',
//     symbol: uniswapIcon,
//     comingSoon: true,
//   },
// ];

export const loanContext = createContext<ContextValues>({
  loanData: {
    borrowing: 0,
    protocol: '',
    chain: null,
    currentAPR: 0,
    coin: '',
    sixMonthInterest: 0,
    twelveMonthInterest: 0,
    twentyFourMonthInterest: 0,
    paymentMethod: '',
    otherAddress: '',

    buffer: 0,
    loanToValue: 0,
    collateralPrice: 0,
    subCollateralPrice: 0,
    collateralNeeded: 0,
    liquidationPenalty: 0,
    liquidationThreshold: 0,
    liquidationPrice: 0,
    decreaseToLiquidationPrice: 0,
    subLiquidationPrice: 0,
    rewardRate: 0,
    rewardAmount: 0,
    coinIcon: '',
    cryptoIcon: '',
    cryptoName: 'ETH',
    termsChecked: false,
    activeNextButton: false,
    nextValidation: '',
  },
  loanSteps: [],
  loanStepsNonConnected: [],
  currentStep: 0,
  // eslint-disable-next-line no-unused-vars
  setLoanData(value: SetStateAction<{}>) {
    throw new Error('Function not implemented.');
  },
  // eslint-disable-next-line no-unused-vars
  setCurrentStep(value: SetStateAction<number>) {
    throw new Error('Function not implemented.');
  },
});

interface LoanProviderProps {
  children: ReactNode;
}

const LoanProvider: FC<LoanProviderProps> = ({ children }) => {
  const [loanData, setLoanData] = useState<LoanData>({
    borrowing: 0,
    protocol: '',
    chain: null,
    currentAPR: 0,
    coin: '',
    sixMonthInterest: 0,
    twelveMonthInterest: 0,
    twentyFourMonthInterest: 0,
    paymentMethod: '',
    otherAddress: '',
    buffer: 0,
    collateralNeeded: 0,
    loanToValue: 0,
    collateralPrice: 0,
    subCollateralPrice: 0,
    liquidationPenalty: 0,
    liquidationThreshold: 0,
    liquidationPrice: 0,
    decreaseToLiquidationPrice: 0,
    subLiquidationPrice: 0,
    rewardRate: 0,
    rewardAmount: 0,
    coinIcon: '',
    cryptoIcon: '',
    cryptoName: 'ETH',
    termsChecked: false,
    activeNextButton: false,
    nextValidation: '',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const protocolConfigs = useProtocolConfig();
  const loanSteps: (CurrencyStep | AssetStep | ProtocolStep | RiskStep)[] = [
    // step-1 need to select currencies usdc or usd.
    {
      id: 1,
      title: 'What do you want to borrow?',
      currency: [
        {
          id: 'currency-1',
          name: 'USDC',
          fullName: 'USD Coin',
          symbol: usdcIcon,
          currentAPR: 0, // apr is  calculated in percentage
          comingSoon: false,
        },
        {
          id: 'currency-2',
          name: 'USD',
          fullName: 'US Dollar',
          symbol: usdIcon,
          currentAPR: 2.56, // apr is calculated in percent
          comingSoon: true,
        },
      ],
    },

    // step-2 Choose which asset you will post as collateral.
    {
      id: 2,
      title: 'Choose which asset you will post as collateral.',
      assets: getSupportedAssets(protocolConfigs),
      description:
        'You will be able to choose the amount of collateral to post after confirming the lending protocol for your loan.',
    },
    // Choose the lending protocol to borrow from
    {
      id: 3,
      title: 'Choose a lender and loan offer.',
      protocols,
    },
    // Choose how much collateral buffer you want.
    {
      id: 4,
      // title: 'Choose how much collateral buffer you want',
      title: 'Choose how much additional collateral to post for your loan',
      // subTitle:'Maintaining a Collateral Buffer of 50% or more at all times is recommended to avoid collateral liquidation.',
      subTitle: 'You can add or withdraw collateral for your loan at anytime',
      risk: {
        minRisk: 0,
        maxRisk: 200,
      },
      description: (
        <>
          Your loan requires your collateral to maintain a certain value at all
          times, otherwise your collateral may be liquidated (i.e. sold) by the
          lender.{' '}
          <b>
            A collateral buffer is the percentage of collateral you provide
            above what is required for your loan.
          </b>{' '}
          A larger collateral buffer will reduce the asset price at which your
          collateral would be liquidated (i.e. liquidation price).
        </>
      ),
    },
    {
      id: 5,
      title: 'Loan Summary',
    },
  ];

  const loanStepsNonConnected: (
    | CurrencyStep
    | AssetStep
    | ProtocolStep
    | RiskStep
  )[] = [
    {
      id: 1,
      title: 'What do you want to borrow?',
      currency: [
        {
          id: 'currency-1',
          name: 'USDC',
          fullName: 'USD Coin',
          symbol: usdcIcon,
          currentAPR: 0, // apr is  calculated in percentage
          comingSoon: false,
        },
        {
          id: 'currency-2',
          name: 'USD',
          fullName: 'US Dollar',
          symbol: usdIcon,
          currentAPR: 2.56, // apr is calculated in percent
          comingSoon: true,
        },
      ],
    },

    {
      id: 5,
      title: 'Loan Summary',
    },
  ];

  return (
    <loanContext.Provider
      value={{
        loanData,
        setLoanData,
        loanSteps,
        currentStep,
        setCurrentStep,
        loanStepsNonConnected,
      }}
    >
      {children}
    </loanContext.Provider>
  );
};

export default LoanProvider;
