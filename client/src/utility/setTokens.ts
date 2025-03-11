const setTokens = (token: string, refreshToken?: string) => {
  sessionStorage.setItem('token', token);
  if (refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  // check token expiry
  // request refresh token

  // get new token at expiry
  // get new refresh token

  // set new token
  // set new refresh token

  // set max age for token
  // set max age for refresh token

  // expire token at max age
};

export default setTokens;
