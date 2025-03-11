'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInterceptor from '@/utility/axiosInterceptor';
import { setDelay } from '@/utility/utils';
import financial from '@/utility/currencyFormate';
import { BACKEND_URL } from '@/constants/env';
import logger from '@/utility/logger';

const initiateWithdrawal = async (
  accountId: any,
  cb2fa: any,
  withdrawalAddress: any,
  currency: any,
  amount: any,
) => {
  const result = await axiosInterceptor.post(
    `${BACKEND_URL}/send-withdrawal`,
    {
      accountId,
      amount,
      currency,
      crypto_address: withdrawalAddress,
      cb_2fa_token: cb2fa,
    },
    {
      withCredentials: true,
    },
  );

  return result;
};

export default function CoinbaseCallback() {
  const [retrievedData, setRetrievedData] = useState<any>(null);
  const [stateToken, setStateToken] = useState<any>(null);
  const [searchParams, setSearchParams] = useState<any>(null);
  const payment: any = JSON.parse(retrievedData || '{}');

  const [code, setCode] = useState('');
  const [balance, setBalance] = useState<any>(null);

  const stateParam = searchParams?.get('state');
  const validStateToken = stateToken === stateParam;

  const fetchCoinbaseBalance = () => {
    axiosInterceptor
      .get(`${BACKEND_URL}/coinbase-balance`, {
        withCredentials: true,
      })
      .then((response: any) => {
        const { data } = response;
        setBalance(data);
      })
      .catch((error: any) => {
        logger(
          `Error fetching balance: ${JSON.stringify(error, null, 2)}`,
          'error',
        );
      });
  };

  const OnVerify = async () => {
    if (code === '') return;

    try {
      await initiateWithdrawal(
        balance?.response[0].id,
        code,
        payment.account,
        payment.currency,
        payment.amount.toString(),
      );

      toast.success(
        `Your ${financial(
          payment.amount.toString(),
          2,
        )} ETH from coinbase is successfully deposited to your smart wallet!`,
      );

      await setDelay(5000);

      close();
    } catch (e) {
      console.log(e);
      toast.error(
        'Something went wrong, please check the 2fa code or your coinbase balance!',
      );
    }
  };

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
    setRetrievedData(sessionStorage?.getItem('coinbasePayment'));
    setStateToken(sessionStorage?.getItem('stateToken'));
    if (validStateToken) {
      fetchCoinbaseBalance();
    }
    return () => {
      sessionStorage?.removeItem('stateToken');
    };
  }, [validStateToken]);

  if (!validStateToken) {
    toast.error('Invalid state token');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-36">
      <h1 className="text-4xl font-bold mb-4">Two-Factor</h1>
      <h2 className="text-4xl font-bold mb-8">Authentication</h2>
      <div className="flex flex-col items-center justify-center text-center w-1/2">
        <p className="text-lg mb-8">
          Enter the 6-digit code generated by your Coinbase to confirm your
          action.
        </p>
        <input
          type="text"
          id="code"
          name="code"
          onChange={(event) => setCode(event.target.value)}
          className="text-xl border border-[#2C3B8D] rounded-lg px-4 py-2 mb-4 w-full text-center"
        />
        <button
          type="button"
          className="py-[10px] px-6 bg-[#2C3B8D] rounded-full text-xl font-semibold text-white w-full"
          onClick={OnVerify}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
