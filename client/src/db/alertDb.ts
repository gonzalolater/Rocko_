/* eslint-disable import/prefer-default-export */
import axiosInterceptor from '@/utility/axiosInterceptor';
import { BACKEND_URL } from '@/constants/env';
import logger from '@/utility/logger';

export const useAlertDB = () => {
  const getSeconds = (frequencyObject: any) => {
    const { repeat } = frequencyObject;

    if (frequencyObject.interval === 'Minute(s)') {
      return repeat * 60;
    }
    if (frequencyObject.interval === 'Hour(s)') {
      return repeat * 60 * 60;
    }
    if (frequencyObject.interval === 'Day(s)') {
      return repeat * 60 * 60 * 24;
    }
  };

  const addAlert = (alertFor: string, loanId: number, alertData: any) => {
    if (!alertData.currentCollateralBuffer.percentage || !alertData.frequency)
      return 0;
    const alertObject = {
      loan_id: loanId,
      alert_type: alertFor === 'collateralBuffer' ? 'Collateral' : alertFor,
      alert_metric: alertData.currentCollateralBuffer.position,
      alert_threshold: alertData.currentCollateralBuffer.percentage,
      alert_email: alertData.alertMethods.email === '' ? 0 : 1,
      alert_phone: alertData.alertMethods.sms === '' ? 0 : 1,
      alert_repeat_secs: getSeconds(alertData.frequency),
      alert_once: alertData.emailAlertType === 'Sent!' ? 1 : 0,
      active: 1,
    };

    axiosInterceptor.post(`${BACKEND_URL}/addAlert`, alertObject);
  };

  const updateAlert = (alertId: number, alertData: any, active: number) => {
    if (!alertData.currentCollateralBuffer.percentage || !alertData.frequency)
      return 0;
    const updateObject = {
      id: alertId,
      alert_metric: alertData.currentCollateralBuffer.position,
      alert_threshold: alertData.currentCollateralBuffer.percentage,
      alert_email: alertData.alertMethods.email === '' ? 0 : 1,
      alert_phone: alertData.alertMethods.sms === '' ? 0 : 1,
      alert_repeat_secs: getSeconds(alertData.frequency),
      alert_once: alertData.emailAlertType === 'Sent!' ? 1 : 0,
      active,
    };

    axiosInterceptor.post(`${BACKEND_URL}/updateAlert`, updateObject);
  };

  const getAlertData = async (loanId: number) => {
    try {
      const response = await axiosInterceptor.get(
        `${BACKEND_URL}/alerts?loanId=${loanId}`,
      );
      return response.data;
    } catch (error) {
      logger(JSON.stringify(error, null, 2), 'error');
      return null;
    }
  };

  const deleteAlert = async (alertId: number) => {
    const deletedObject = {
      id: alertId,
      active: 0,
    };

    await axiosInterceptor.post(`${BACKEND_URL}/deleteAlert`, deletedObject);
  };

  const deleteAlertByType = async (alertType: string) => {
    console.log('alertType', alertType);
    await axiosInterceptor.post(`${BACKEND_URL}/deleteAlertByType`, {
      alertType,
    });
  };

  return {
    addAlert,
    getAlertData,
    updateAlert,
    deleteAlert,
    deleteAlertByType,
  };
};
