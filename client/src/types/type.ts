import React, { Dispatch, SetStateAction } from 'react';
import {
  ADD_ALERT,
  ALERT_OFF,
  DELETE_ALERT,
  UPDATE_ALERT,
  // UPDATE_ALERT_METHOD,
  // UPDATE_ALERT_TYPE,
  // UPDATE_FREQUENCY,
  // UPDATE_INTEREST_RATE,
  CLEAR_ALERT,
} from '@/constants/alertType';
import { ProtocolConfig } from '@/protocols/types';
import { NetworkNames } from '@/constants/env';

export interface CoinCardProps {
  coinIcon: string;
  coinName: string;
  coinShortName: string;
  selectedCoin: string;
  handleSelect: Function;
  currentAPR?: number;
  loanToValue?: number; // data is  in percentage
  liquidationThreshold?: number; // data is in percentage
  liquidationPenalty?: number;
  collateralPrice?: number;
  subCollateralPrice?: number;
  liquidationPrice?: number;
  subLiquidationPrice?: number;
  isComingSoon?: boolean;
  className?: string;
}

export interface AssetParameterProps {
  title?: string;
  value?: number;
  active?: boolean;
}
export interface LoanSteps {}
// Interface for currency step
export interface CurrencyStep {
  id?: number;
  title?: string;
  currency?: {
    id?: string;
    name?: string;
    fullName?: string;
    symbol?: string;
    currentAPR?: number;
    comingSoon?: boolean;
  }[];
  description?: string;
}

// Interface for asset step
export interface AssetStep {
  id?: number;
  title?: string;
  assets?: {
    id?: string;
    name?: string;
    fullName?: string;
    symbol?: string;
    loanToValue?: number;
    liquidationThreshold?: number;
    liquidationPenalty?: number;
    collateralPrice?: number;
    subCollateralPrice?: number;
    liquidationPrice?: number;
    subLiquidationPrice?: number;
    comingSoon?: boolean;
  }[];
  description?: string;
}

// Interface for protocol step
export interface ProtocolProps {
  id?: string;
  name?: string;
  symbol?: string;
  chain?: NetworkNames;
  protocolInfo: ProtocolConfig;
  selectProtocol?: string;
  handleProtocol?: Function;
  protocolInfos?: {
    id?: string;
    title?: string;
    tooltip?: string;
    options?: {
      name?: string;
      value?: number | string;
      subInfo?: string;
    }[];
  }[];
}
export interface ProtocolStep {
  id?: number;
  title?: string;
  protocols?: ProtocolProps[];
  description?: string;
}

// Interface for risk step
export interface RiskStep {
  id?: number;
  title?: string;
  subTitle?: string;
  risk?: {
    minRisk?: number;
    maxRisk?: number;
  };
  description?: any;
}

export interface LoanData {
  borrowing: number;
  protocol: string;
  chain: NetworkNames | null;
  currentAPR: number;
  coin: string;
  coinIcon: string;
  sixMonthInterest: number;
  twelveMonthInterest: number;
  twentyFourMonthInterest: number;
  paymentMethod: string;
  otherAddress: string;
  cryptoName: string;
  cryptoIcon: string;
  buffer: number;
  loanToValue: number;
  liquidationThreshold: number;
  liquidationPenalty: number;
  collateralPrice: number;
  subCollateralPrice: number;
  collateralNeeded: number;
  liquidationPrice: number;
  decreaseToLiquidationPrice: number;
  subLiquidationPrice: number;
  rewardRate: number;
  rewardAmount: number;
  termsChecked: boolean;
  activeNextButton?: boolean;
  nextValidation: any;
}
// ContextValues interface using the above step interfaces
export interface ContextValues {
  loanData: LoanData;
  setLoanData?: Dispatch<SetStateAction<LoanData>>;
  loanSteps: (CurrencyStep | AssetStep | ProtocolStep | RiskStep)[];
  loanStepsNonConnected: (CurrencyStep | AssetStep | ProtocolStep | RiskStep)[];
  currentStep: number;
  setCurrentStep?: Dispatch<SetStateAction<number>>;
}

// ? alert interface

// arp alert
export interface AprAlertType {
  id: number;
  alertMethods: {
    email?: string;
    sms?: string;
  };
  alertType?: string;
  currentInterestRate: {
    position?: string;
    percentage?: number;
  };

  frequency: {
    repeat?: number | string;
    interval?: string;
  };
}

export interface BufferAlertType {
  id: number;
  alertMethods: {
    email?: string;
    sms?: string;
  };
  emailAlertType?: string;
  callAlertType?: string;
  currentCollateralBuffer: {
    position?: string;
    percentage?: number;
  };

  frequency: {
    repeat?: number | string;
    interval?: string;
  };
}

export type AprAlertAction =
  | { type: typeof ADD_ALERT; alert: AprAlertType }
  | { type: typeof UPDATE_ALERT; alert: AprAlertType; index: number }
  | { type: typeof DELETE_ALERT; index: number }
  | { type: typeof ALERT_OFF }
  | { type: typeof CLEAR_ALERT };

export type BufferAlertAction =
  | { type: typeof ADD_ALERT; alert: BufferAlertType }
  | { type: typeof UPDATE_ALERT; alert: BufferAlertType; index: number }
  | { type: typeof DELETE_ALERT; index: number }
  | { type: typeof ALERT_OFF }
  | { type: typeof CLEAR_ALERT };
export interface AlertContextValues {
  aprAlertState: AprAlertType[];
  bufferAlertState: BufferAlertType[];
  aprAlertDispatch: Dispatch<AprAlertAction>;
  bufferAlertDispatch: Dispatch<BufferAlertAction>;
}

export interface AlertFormProps {
  setOpenModalFor: Function;
  loanId: number;
  title: string;
  description: string;
  setNext: Function;
  alertFor: 'collateralBuffer' | 'APR';
  setToggleAlert: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  forUpdate?: BufferAlertType | AprAlertType;
  updateIndex?: number | string;
}
