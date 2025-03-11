/* eslint-disable import/prefer-default-export */
import { publicIpv4, publicIpv6 } from 'public-ip';
import axiosInterceptor from '@/utility/axiosInterceptor';
import { BACKEND_URL } from '@/constants/env';
import logger from '@/utility/logger';

const getIp = async () => {
  let ip;
  try {
    ip = await publicIpv4();
  } catch (error) {
    try {
      ip = await publicIpv6();
    } catch (error) {
      return null;
    }
  }

  return ip;
};

const getUserCountry = async () => {
  try {
    const ip = await getIp();

    const response = await axiosInterceptor.post(`${BACKEND_URL}/vpn`, {
      ip,
    });

    return response.data.details;
  } catch (error: any) {
    return error.response;
  }
};

export const useUserDB = () => {
  const addUser = async ({
    email,
    walletAddress,
    inactive,
  }: {
    email: string;
    walletAddress: string;
    inactive: boolean;
  }) => {
    const { country, ip } = await getUserCountry();

    const userObject = {
      email,
      wallet_address: walletAddress,
      country,
      ip,
      inactive: Number(inactive),
    };
    axiosInterceptor.post(`${BACKEND_URL}/addUser`, userObject).catch((e) => {
      logger(`Cannot addUser: ${JSON.stringify(e, null, 2)}`, 'error');
    });
  };

  const updateUser = async (email: string, phone: string) => {
    const userObject = {
      email,
      phone,
    };
    axiosInterceptor
      .post(`${BACKEND_URL}/updateUser`, userObject)
      .catch((e) => {
        logger(`Cannot updateUser: ${JSON.stringify(e, null, 2)}`, 'error');
      });
  };

  const updateCountry = async (email: string) => {
    if (email) {
      const { country, ip } = await getUserCountry();

      const userObject = {
        email,
        country,
        ip,
      };
      axiosInterceptor.patch(`${BACKEND_URL}/updateCountry`, userObject);
    }
  };

  const getUserData = async (email: string) => {
    if (email) {
      try {
        const response = await axiosInterceptor.post(`${BACKEND_URL}/users`, {
          email,
        });
        return response.data;
      } catch (error) {
        logger(
          `Cannot Get UserData: ${JSON.stringify(error, null, 2)}`,
          'error',
        );
        return null;
      }
    }
  };

  const getUserId = async (email: string) => {
    if (email) {
      try {
        const response = await axiosInterceptor.post(`${BACKEND_URL}/userid`, {
          email,
        });

        return response.data.length > 0 ? response.data[0].id : -1;
      } catch (error) {
        logger(`Cannot Get UserId: ${JSON.stringify(error, null, 2)}`, 'error');
        return null;
      }
    }
  };

  const isVPN = async () => {
    try {
      // const ip = await publicIp();
      const ip = await getIp();
      if (!ip) return null;

      const response = await axiosInterceptor.post(`${BACKEND_URL}/vpn`, {
        ip,
      });

      return response;
    } catch (error: any) {
      logger(`Cannot vpnRes: ${JSON.stringify(error, null, 2)}`, 'error');
      return error.response;
    }
  };

  const isInActive = async (email: string) => {
    if (email) {
      try {
        const response = await axiosInterceptor.post(`${BACKEND_URL}/users`, {
          email,
        });

        return response.data.length > 0 ? response.data[0].inactive : null;
      } catch (error: any) {
        logger(
          `Cannot Get InActive Status: ${JSON.stringify(error, null, 2)}`,
          'error',
        );
        return null;
      }
    }
  };

  const isReadOnly = async (email: string) => {
    if (email) {
      try {
        const response = await axiosInterceptor.post(`${BACKEND_URL}/users`, {
          email,
        });

        return response?.data.length > 0 ? response?.data[0].readonly : null;
      } catch (error: any) {
        logger(`Cannot Get ReadOnly Status: ${JSON.stringify(error, null, 2)}`);
        return null;
      }
    }
  };

  return {
    addUser,
    updateUser,
    updateCountry,
    getUserData,
    getUserId,
    getUserCountry,
    isVPN,
    isInActive,
    isReadOnly,
  };
};
