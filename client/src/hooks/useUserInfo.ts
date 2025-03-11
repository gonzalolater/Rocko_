import { useState, useEffect } from 'react';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import setTokens from '@/utility/setTokens';
import { useRockoAccount } from './useRockoAccount';

// eslint-disable-next-line import/prefer-default-export
export const useUserInfo = () => {
  const { user, isConnected } = useRockoAccount();
  const { setShowAuthFlow } = useDynamicContext();
  const [userInfo, setUserInfo] = useState<any>();

  const useLogin = async () => {
    setShowAuthFlow(true);
  };

  useEffect(() => {
    const dynamicJwtToken = getAuthToken();

    if (user && dynamicJwtToken) {
      // Set token in session storage for use with backend authentication
      setTokens(dynamicJwtToken);
      setUserInfo(user);
    } else {
      // todo other areas of the app may not be actually removing the token from session storage
      sessionStorage.removeItem('token');
      setUserInfo(null);
    }
  }, [user, isConnected]);

  // console.log({ userInfo, setUserInfo, loginUser: useLogin, isConnected });
  return { userInfo, setUserInfo, loginUser: useLogin, isSuccess: isConnected };
};
