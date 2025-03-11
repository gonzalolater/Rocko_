import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useUserInfo } from './useUserInfo';
import { useRockoWallet } from './useRockoWallet';

// eslint-disable-next-line import/prefer-default-export
export const useRockoDisconnect = () => {
  const { handleLogOut } = useDynamicContext();
  const { setUserInfo } = useUserInfo();
  const { setKernelClientZeroDev } = useRockoWallet();
  const disconnect = () => {
    // logout user and clear session data
    handleLogOut();
    sessionStorage.clear();
    setUserInfo(null);
    setKernelClientZeroDev({});
    // TODO:
    // redirect to home page or login page
  };

  return { disconnect };
};
