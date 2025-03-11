'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import comp from '@/assets/coins/Compound (COMP).svg';
import eth from '@/assets/coins/Ether (ETH).svg';
import usdc from '@/assets/coins/USD Coin (USDC).svg';
import { useLoanDB } from '@/db/loanDb';
import { useUserDB } from '@/db/userDb';
import financial from '@/utility/currencyFormate';
import { etherscanLink, formatDate } from '@/utility/utils';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useSingleLoan } from '@/contract/single';
import logger from '@/utility/logger';
import usePlatformStatus from '@/hooks/usePlatformStatus';

function Dashboard() {
  const [active, setActive] = useState(true);
  const { loansPaused, transactionsPaused } = usePlatformStatus();
  const newLoansPaused = loansPaused || transactionsPaused;
  const { getLoanData } = useLoanDB();
  const { getUserId } = useUserDB();
  const { userInfo } = useUserInfo();
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [closedLoans, setClosedLoans] = useState<any[]>([]);
  const { getBorrowAPR, getBorrowBalanceOf } = useSingleLoan();
  const [borrowAPR, setBorrowAPR] = useState<any>(0);
  const [borrowBalanceOf, setBorrowBalanceOf] = useState<any>(0);

  const initialize = async () => {
    if (userInfo) {
      const userId = await getUserId(userInfo?.email);
      const result = await getLoanData(userId);

      if (result) {
        const userActiveLoans = result.filter(
          (loan: any) => loan.loan_active === 1,
        );
        const userClosedLoans = result.filter(
          (loan: any) => loan.loan_active === 0,
        );
        setActiveLoans(userActiveLoans);
        setClosedLoans(userClosedLoans);
      }
    }
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, active]);

  useEffect(() => {
    getBorrowAPR()
      .then((_apr) => setBorrowAPR(_apr))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));
    getBorrowBalanceOf()
      .then((_balance) => setBorrowBalanceOf(_balance.formatted))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));
  });

  return (
    <main className="container mx-auto px-4 py-6  lg:py-10 ">
      <h1 className="text-center md:text-left text-2xl md:text-[28px] font-medium">
        Loan Dashboard
      </h1>
      <div className="border-2 rounded-2xl p-3 md:p-5 lg:p-6 mt-8">
        <h4 className="text-xl font-medium">Loans</h4>
        <div className="mt-4 mb-4">
          <button
            type="button"
            className={`py-[6px] px-4 text-xs relative font-medium ${
              active
                ? 'bg-[#2C3B8D] text-white z-10 rounded-3xl'
                : 'text-[#2C3B8D] bg-gray-200 z-0 rounded-s-3xl'
            }`}
            onClick={() => setActive(true)}
          >
            Active Loans
          </button>
          <button
            type="button"
            className={`py-[6px] px-4 text-xs -ml-[10px] relative font-medium ${
              !active
                ? 'bg-[#2C3B8D] text-white z-10 rounded-3xl'
                : 'text-[#2C3B8D] bg-gray-200 z-0 rounded-e-3xl'
            }`}
            onClick={() => setActive(false)}
          >
            Closed Loans
          </button>
        </div>
        <div className="divide-y-2 space-y-5">
          {active &&
            activeLoans?.reverse()?.map((loan: any, i: number) => (
              <div key={i} className="space-y-6 pt-4">
                {/* Parents */}
                <div className="flex gap-x-2 items-center mb-3 relative">
                  {/* title Container */}
                  <div key={i} className="flex items-center gap-x-1">
                    <Image
                      width={20}
                      height={20}
                      src={comp}
                      alt=""
                      className="w-5 h-5"
                    />
                    <h1 className="md:text-xl font-medium">Compound - </h1>
                    <Image
                      width={20}
                      height={20}
                      src={usdc}
                      alt=""
                      className="w-5 h-5"
                    />
                    <h1 className="md:text-xl font-medium">USDC :</h1>
                    <Image
                      width={20}
                      height={20}
                      src={eth}
                      alt=""
                      className="w-5 h-5"
                    />
                    <h1 className="md:text-xl font-medium">ETH</h1>
                  </div>
                  <Link
                    href={{
                      pathname: `/loan-dashboard/${i + 1}`,
                      query: { active },
                    }}
                    className="mt-6 py-2 px-6 rounded-3xl text-[#2C3B8D] bg-[#EEE] absolute left-1/2 -translate-x-1/2 top-[116px] md:left-[91%] md:-top-[30px] lg:left-[93%]  w-max text-sm font-semibold"
                  >
                    Manage Loan
                  </Link>
                </div>
                <div className="space-y-1 pb-11 md:pb-0">
                  {/* info Conatiner */}
                  <div className="flex">
                    <p className="w-1/2">Balance</p>
                    <p className="w-1/2 text-right md:text-left">
                      {financial(borrowBalanceOf, 2)} <small>USDC</small>
                    </p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">Current APR</p>
                    <p className="w-1/2 text-right md:text-left">
                      {financial(borrowAPR, 2)}%
                    </p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">Date Opened</p>
                    <p className="w-1/2 text-right md:text-left">
                      {formatDate(new Date(loan?.create_time))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          {!active &&
            closedLoans?.reverse()?.map((loan: any, i: any) => (
              <div key={i} className="space-y-6 pt-4">
                {/* Parents */}
                <div className="flex gap-x-2 items-center mb-3 relative">
                  {/* title Container */}
                  <div key={i} className="flex items-center gap-x-1">
                    <Image
                      width={20}
                      height={20}
                      src={comp}
                      alt=""
                      className="w-5 h-5"
                    />
                    <h1 className="md:text-xl font-medium">
                      {loan?.lending_protocol} -{' '}
                    </h1>
                    <Image
                      width={20}
                      height={20}
                      src={usdc}
                      alt=""
                      className="w-5 h-5"
                    />
                    <h1 className="md:text-xl font-medium">USDC :</h1>
                    <Image
                      width={20}
                      height={20}
                      src={eth}
                      alt=""
                      className="w-5 h-5"
                    />
                    <h1 className="md:text-xl font-medium">ETH</h1>
                  </div>
                </div>
                <div className="space-y-1 pb-11 md:pb-0">
                  {/* info Conatiner */}
                  <div className="flex">
                    <p className="w-1/2">Open Date</p>
                    <p className="w-1/2 text-right md:text-left">
                      {formatDate(new Date(loan?.create_time))}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">Close Date</p>
                    <p className="w-1/2 text-right md:text-left">
                      {formatDate(new Date(loan?.modified_time))}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">Amount Borrowed (Principal Only)</p>
                    <p className="w-1/2 text-right md:text-left">
                      ${financial(loan?.principal_balance)}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="w-1/2">Total Interest Accrued</p>
                    <p className="w-1/2 text-right md:text-left">
                      {financial(loan?.interest, 6)} USDC
                    </p>
                  </div>
                  <div className="flex">
                    <Link
                      className="w-1/2 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={etherscanLink(loan?.transaction_hash)}
                    >
                      View loan repayment transaction
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          {newLoansPaused ? null : (
            <div className="text-center md:text-left pb-2 md:pb-0">
              <a href="/">
                <button
                  type="button"
                  className="mt-6 py-[10px] px-6 rounded-3xl bg-[#2C3B8D] text-white font-semibold text-sm"
                >
                  Create New Loan
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
