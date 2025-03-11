import { ethers } from 'ethers';
import { NETWORK } from '@/constants/env';

export const formatBalance = (
  value: ethers.BigNumberish,
  decimals = 18,
  maxFraction = 0,
) => {
  const formatted = ethers.utils.formatUnits(value, decimals);
  if (maxFraction > 0) {
    const split = formatted.split('.');
    if (split.length > 1) {
      return `${split[0]}.${split[1].substr(0, maxFraction)}`;
    }
  }
  return formatted;
};

export const parseBalance = (value: any, decimals = 18) =>
  ethers.utils.parseUnits(value || '0', decimals);

export const getDurationFromUnixTime = (unixTimestamp: number) => {
  unixTimestamp = 604800 - unixTimestamp;
  if (unixTimestamp <= 0) return `0.0`;

  const milliseconds = unixTimestamp * 1000;

  const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
  );
  const mins = Math.floor(
    ((milliseconds % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) / (60 * 1000),
  );

  return `${days}D ${hours}H ${mins}M`;
};

export const getInterest = (
  loan: number,
  apr: number,
  startLoan: string | number | Date,
) => {
  const durationInDays = new Date().getDay() - new Date(startLoan).getDay();
  const interest = (durationInDays * loan * apr) / 100 / 365;

  return interest;
};

export const formatDate = (date: number | Date | undefined) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

export const getRoundDown = (value: number, fractionalPoints: number) => {
  const roundedDownNumber =
    Math.floor(value * 10 ** fractionalPoints) / 10 ** fractionalPoints;

  return roundedDownNumber;
};

export const etherscanLink = (
  txHash: string,
  type: string | undefined = 'tx',
) =>
  NETWORK === 'mainnet'
    ? `https://etherscan.io/${type}/${txHash}`
    : `https://${NETWORK}.etherscan.io/${type}/${txHash}`;

export const getFrequencyObject = (repeat: number) => {
  const secsOneDay = 60 * 60 * 24;
  const secsOneHour = 60 * 60;
  const secsOneMin = 60;

  if (repeat > secsOneDay) {
    return {
      interval: 'Day(s)',
      repeat: repeat / secsOneDay,
    };
  }
  if (repeat > secsOneHour) {
    return {
      interval: 'Hour(s)',
      repeat: repeat / secsOneHour,
    };
  }
  if (repeat > secsOneMin) {
    return {
      interval: 'Min(s)',
      repeat: repeat / secsOneMin,
    };
  }
};

export function setDelay(delay: number) {
  /* eslint-disable no-promise-executor-return */
  return new Promise((res) => setTimeout(res, delay));
}

export const formatPhoneNumber = (phoneNumber: string) => {
  let formattedNumber = phoneNumber.replace(/\D/g, '');
  formattedNumber = `+${formattedNumber}`;

  return formattedNumber;
};
