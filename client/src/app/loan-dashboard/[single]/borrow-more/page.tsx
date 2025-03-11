'use client';

import { FC, useState } from 'react';
import SummaryComp from '@/components/chips/SummaryComp/SummaryComp';
import Footer from '@/components/chips/Footer/Footer';
import ModalContainer from '@/components/chips/ModalContainer/ModalContainer';
import LoanFinalized from '@/components/chips/LoanFinalized/LoanFinalized';

const BorrowPayment: FC = () => {
  const [isFinalized, setIsFinalized] = useState(false);

  return (
    <>
      <div className="mb-[60px]">
        <SummaryComp
          title="Loan Increase"
          subTitle="You're borrowing more with your current loan"
          invoiceTitle="Summary"
          category="borrow_more"
        />
      </div>
      <Footer setIsFinalized={setIsFinalized} />
      {isFinalized && (
        <ModalContainer>
          <LoanFinalized navType="add" />
        </ModalContainer>
      )}
    </>
  );
};

export default BorrowPayment;
