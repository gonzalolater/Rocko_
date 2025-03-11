import { BACKEND_URL, NETWORK } from '@/constants/env';
import logger from '@/utility/logger';
import axiosInterceptor from './axiosInterceptor';

// Transaction compliance check
const transactionComp = async ({
  transactionHash,
  metadata,
}: {
  transactionHash: string;
  metadata: any;
}) => {
  if (NETWORK === 'mainnet') {
    try {
      const transactionCompliance = await axiosInterceptor.post(
        `${BACKEND_URL}/comp/transaction`,
        {
          transaction_hash: transactionHash,
          metadata,
        },
      );

      return transactionCompliance;
    } catch (e) {
      logger(`Failed to send transaction to compliance: ${e}`);
    }
    return null;
  }
};

export default transactionComp;
