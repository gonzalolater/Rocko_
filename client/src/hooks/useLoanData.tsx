import { useContext } from 'react';
import { loanContext } from '@/context/loanContext/loanContext';
import { ContextValues } from '@/types/type';

const useLoanData = (): ContextValues => useContext<ContextValues>(loanContext);

export default useLoanData;
