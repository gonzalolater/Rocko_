import { AprAlertType, BufferAlertType } from '@/types/type';

const sortAprAlert = (aprAlertState: AprAlertType[]) => {
  const aprAlertAbove = aprAlertState.filter(
    (aprAlert: AprAlertType) =>
      aprAlert.currentInterestRate.position === 'Above',
  );

  const aprAlertBelow = aprAlertState.filter(
    (aprAlert: AprAlertType) =>
      aprAlert.currentInterestRate.position === 'Below',
  );

  const sortAprAlertAbove = aprAlertAbove.sort((a, b) => {
    const aPercentage = a?.currentInterestRate?.percentage || 0;
    const bPercentage = b?.currentInterestRate?.percentage || 0;
    return bPercentage - aPercentage;
  });

  const sortAprAlertBelow = aprAlertBelow.sort((a, b) => {
    const aPercentage = a?.currentInterestRate?.percentage || 0;
    const bPercentage = b?.currentInterestRate?.percentage || 0;
    return bPercentage - aPercentage;
  });

  return [...sortAprAlertAbove, ...sortAprAlertBelow];
};

const sortBufferAlert = (bufferAlertState: BufferAlertType[]) => {
  const bufferAlertAbove = bufferAlertState.filter(
    (bufferAlert: BufferAlertType) =>
      bufferAlert.currentCollateralBuffer.position === 'Above',
  );

  const bufferAlertBelow = bufferAlertState.filter(
    (bufferAlert: BufferAlertType) =>
      bufferAlert.currentCollateralBuffer.position === 'Below',
  );

  const sortBufferAlertAbove = bufferAlertAbove.sort((a, b) => {
    const aPercentage = a?.currentCollateralBuffer?.percentage || 0;
    const bPercentage = b?.currentCollateralBuffer?.percentage || 0;
    return bPercentage - aPercentage;
  });

  const sortBufferAlertBelow = bufferAlertBelow.sort((a, b) => {
    const aPercentage = a?.currentCollateralBuffer?.percentage || 0;
    const bPercentage = b?.currentCollateralBuffer?.percentage || 0;
    return bPercentage - aPercentage;
  });

  return [...sortBufferAlertAbove, ...sortBufferAlertBelow];
};

export { sortAprAlert, sortBufferAlert };
