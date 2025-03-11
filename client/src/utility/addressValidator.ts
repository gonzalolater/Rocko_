import { ethers } from 'ethers';
import { BACKEND_URL } from '@/constants/env';
import axiosInterceptor from './axiosInterceptor';

// validate ETH address and address compliance check
const addressValidator = async (address: string, disconnect?: any) => {
  try {
    // ethers.utils.getAddress will throw an error if the address is invalid
    // or does not match the checksum. If valid, it returns the address with the correct checksum.
    const validAddress = ethers.utils.getAddress(address);

    const addressCheck = await axiosInterceptor.post(
      `${BACKEND_URL}/comp/address`,
      {
        address: validAddress,
      },
    );

    // if the address fails compliance, disconnect the user
    if (addressCheck.status !== 200) {
      sessionStorage.removeItem('token');
      if (disconnect) {
        disconnect();
      }
      return null;
    }

    return validAddress;
  } catch {
    // If getAddress throws, the address is invalid or checksum is incorrect
    return null;
  }
};

export default addressValidator;
