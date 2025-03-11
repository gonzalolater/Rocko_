'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import logger from '@/utility/logger';
import { BACKEND_URL } from '@/constants/env';

export default () => {
  const [loansPaused, setLoansPaused] = useState(false);
  const [transactionsPaused, setTransactionsPaused] = useState(false);
  const [platformStatusMessage, setPlatformStatusMessage] = useState('');
  const getKillSwitch = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/comp/platform-status`);
      setLoansPaused(!!response.data.loan_booking_blocked);
      setTransactionsPaused(!!response.data.transactions_blocked);
      setPlatformStatusMessage(response.data.status_message);
    } catch (error: any) {
      if (error?.response?.status === 503) {
        logger(
          `Kill Switch active: ${JSON.stringify(error.data, null, 2)}`,
          'warn',
        );
        setLoansPaused(!!error?.response?.data.loan_booking_blocked);
        setTransactionsPaused(!!error?.response?.data.transactions_blocked);
      } else {
        logger(
          `Failed to fetch platform status: ${JSON.stringify(error, null, 2)}`,
          'error',
        );
      }
    }
  }, [setLoansPaused, setTransactionsPaused, setPlatformStatusMessage]);

  useEffect(() => {
    getKillSwitch();
  });

  return { loansPaused, transactionsPaused, platformStatusMessage };
};
