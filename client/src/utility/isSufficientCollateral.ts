const isSufficientCollateral = (
  balance: string | undefined,
  collateral: string,
): boolean => {
  if (!balance) {
    return false;
  }
  const balanceNumber = Number(balance);
  const collateralNumber = Number(collateral);

  return balanceNumber >= collateralNumber * 0.75;
};

export default isSufficientCollateral;
