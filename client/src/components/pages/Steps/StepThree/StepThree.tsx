import { FC, useEffect, useState } from 'react';
import { ProtocolStep } from '@/types/type';
// import FilterOptions from '@/components/chips/FilterOptions/FilterOptions';
// import SortOptions from '@/components/chips/SortOptions/SortOptions';
// import Protocol from '@/components/chips/Protocol/Protocol';
import Protocol from '@/components/chips/Protocol/Protocol';
import useLoanData from '@/hooks/useLoanData';
import LoanSummary from '@/components/chips/LoanSummary/LoanSummary';
import ProtocolBanner from '@/components/ProtocolsBanner';
// import ProtocolDemo from '@/components/chips/Protocol/ProtocolDemo';
// import { protocols } from '@/context/loanContext/loanContext';
import { useProtocolConfig } from '@/protocols';
import { NetworkNames } from '@/constants/env';

// type FilterOptionsProps = string;

const StepThree: FC<ProtocolStep> = ({ title }) => {
  const protocolConfigs = useProtocolConfig();
  const { loanData, setLoanData } = useLoanData();
  const [selectProtocol, setSelectProtocol] = useState('');
  // const [sortOption, setSortOption] = useState('APR (lowest)');
  // const [filterOptions, setFilterOptions] = useState<FilterOptionsProps[]>([]);

  const initialize = () => {
    if (loanData?.protocol && loanData?.chain) {
      setSelectProtocol(`${loanData?.protocol}-${loanData?.chain}` || '');
      if (setLoanData) {
        setLoanData((prevLoanData) => ({
          ...prevLoanData,
          activeNextButton: true,
        }));
      }
    }
  };

  const handleProtocol = (name: string, chain: NetworkNames) => {
    setSelectProtocol(`${name}-${chain}`);
    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        protocol: name,
        chain,
        activeNextButton: true,
      }));
    }
  };
  // const handleFilterOption = (name: string) => {
  //   const index = filterOptions.indexOf(name);

  //   if (index === -1) {
  //     setFilterOptions([...filterOptions, name]);
  //   } else {
  //     setFilterOptions(filterOptions.filter((item) => item !== name));
  //   }
  // };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container mx-auto px-[15px] py-4 sm:py-6 lg:py-10 ">
      {/* title start  */}
      <div className="flex items-center justify-between flex-wrap gap-6">
        <h1 className="text-2xl lg:text-3xl text-blackPrimary lg:text-start text-center">
          Customize Your Loan
        </h1>
        {/* <div className="flex items-center justify-start max-[368px]:gap-1 min-[368px]:gap-4">
          <div className="py-2 md:py-[10px] px-4 flex items-center justify-start gap-2 bg-[#EEE] rounded-full relative group">
            <p className="text-[#2C3B8D] font-medium max-[355px]:text-sm ">
              Filter
            </p>
            {filterOptions.length > 0 && (
              <p className="w-5 h-5 text-sm flex items-center justify-center rounded-full bg-blue text-white">
                {filterOptions.length}
              </p>
            )}

            <FilterOptions handleFilterOption={handleFilterOption} />
          </div>
          <div className="py-2 md:py-[10px] px-4 flex items-center justify-start gap-2 bg-[#EEE] rounded-full relative group min-w-[150px]">
            <p className="text-[#2C3B8D] font-medium max-[355px]:text-sm ">
              Sort by: {sortOption}
            </p>
            <div className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.0001 11.3215L14.4108 6.91076L15.5894 8.08927L10.0001 13.6785L4.41084 8.08927L5.58936 6.91076L10.0001 11.3215Z"
                  fill="#2C3B8D"
                />
              </svg>
            </div>

            <SortOptions
              setSortOption={setSortOption}
              sortOption={sortOption}
            />
          </div>
        </div> */}
      </div>
      {/* title end  */}

      {/* Choose section  */}
      <section className="flex gap-4 lg:gap-10 my-6 flex-col sm:flex-row">
        <div className="w-full sm:w-8/12">
          <div className="p-6 border border-whiteSecondary rounded-2xl">
            <p className=" text-xl font-medium  text-blackPrimary lg:text-start text-center">
              {title}
            </p>
            <div className="divide-y-2 divide-[#E2E2E2]">
              {protocolConfigs.map((p) => (
                <Protocol
                  key={`${p.name.toLowerCase()}-${p.chain}`}
                  protocolInfo={p}
                  name={p.name}
                  symbol="/icons/Compound (COMP).svg"
                  chain={p.chain}
                  handleProtocol={handleProtocol}
                  selectProtocol={selectProtocol}
                />
              ))}
              {/* 
              {protocols?.map((protocol) => (
                <ProtocolDemo
                  key={protocol.id}
                  interestRate={protocol.interestRate}
                  name={protocol.name}
                  protocolInfos={protocol.protocolInfos}
                  symbol={protocol.symbol}
                  id={protocol.id}
                  handleProtocol={handleProtocol}
                  selectProtocol={selectProtocol}
                />
              ))} */}
              <ProtocolBanner
                label="Audited protocols only"
                title="More protocols coming soon!"
              />
            </div>
          </div>
        </div>
        <div className="p-6 border border-[#E2E2E2] flex-1 rounded-2xl h-fit">
          <LoanSummary />
        </div>
      </section>
    </main>
  );
};

export default StepThree;
