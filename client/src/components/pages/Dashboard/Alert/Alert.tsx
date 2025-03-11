import { FC, useEffect, useState } from 'react';
import ModalContainer from '@/components/chips/ModalContainer/ModalContainer';
import { useAlert } from '@/context/alertContext/alertContext';
import { useAlertDB } from '@/db/alertDb';
import { useUserDB } from '@/db/userDb';
import { getFrequencyObject } from '@/utility/utils';
import { useUserInfo } from '@/hooks/useUserInfo';
import CollateralBufferAlerts from './collateralBufferAlerts/collateralBufferAlerts';
import ToggleBTN from '../toggleBTN/toggleBTN';

interface Props {
  title: string;
  loanId: number;
  description: string;
  alertFor: 'collateralBuffer' | 'APR';
}

const Alert: FC<Props> = ({ title, loanId, description, alertFor }) => {
  const [userPhone, setUserPhone] = useState<string>('');
  const { getUserData } = useUserDB();
  const { userInfo } = useUserInfo();
  const { getAlertData } = useAlertDB();
  const {
    aprAlertState,
    bufferAlertState,
    aprAlertDispatch,
    bufferAlertDispatch,
  } = useAlert();

  const [toggleAlert, setToggleAlert] = useState<boolean | undefined>(
    alertFor === 'APR' && aprAlertState.length > 0
      ? true
      : alertFor === 'collateralBuffer' && bufferAlertState.length > 0
        ? true
        : undefined,
  );
  const [openModalFor, setOpenModalFor] = useState('');

  const getAlerts = async () => {
    const result = await getAlertData(loanId);
    if (result) {
      const alerts = result.filter(
        (alert: any) => alert.active === 1 && alert.loan_id === loanId,
      );
      // clear alert states
      aprAlertDispatch({ type: 'CLEAR_ALERT' });
      bufferAlertDispatch({ type: 'CLEAR_ALERT' });
      // add alerts from db to states
      alerts.map((alert: any) => {
        /* for apr alert */
        if (alert?.alert_type === 'APR') {
          aprAlertDispatch({
            type: 'ADD_ALERT',
            alert: {
              id: alert.id,
              alertMethods: {
                email: alert?.alert_email === 1 ? userInfo?.email : '',
                sms: alert?.alert_phone === 1 ? userPhone : '',
              },
              currentInterestRate: {
                percentage: alert?.alert_threshold,
                position: alert?.alert_metric,
              },
              frequency: {
                interval: getFrequencyObject(alert?.alert_repeat_secs)
                  ?.interval,
                repeat: getFrequencyObject(alert?.alert_repeat_secs)?.repeat,
              },
            },
          });
        }
        /* for collateral buffer alert */
        if (alert?.alert_type === 'Collateral') {
          bufferAlertDispatch({
            type: 'ADD_ALERT',
            alert: {
              id: alert.id,
              alertMethods: {
                email: alert?.alert_email === 1 ? userInfo?.email : '',
                sms: alert?.alert_phone === 1 ? userPhone : '',
              },
              currentCollateralBuffer: {
                percentage: alert?.alert_threshold,
                position: alert?.alert_metric,
              },
              frequency: {
                interval: getFrequencyObject(alert?.alert_repeat_secs)
                  ?.interval,
                repeat: getFrequencyObject(alert?.alert_repeat_secs)?.repeat,
              },
            },
          });
        }
      });
    }
  };

  const OnManageAlerts = async () => {
    setOpenModalFor(`manage-${title}`);
    await getAlerts();
  };

  const fetchPhone = async (email: string) => {
    try {
      const user = await getUserData(email);
      setUserPhone(user?.[0]?.phone);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loanId) getAlerts();
    fetchPhone(userInfo?.email);
  }, [userInfo, loanId]);

  useEffect(() => {
    setToggleAlert(
      alertFor === 'APR' && aprAlertState.length > 0
        ? true
        : alertFor === 'collateralBuffer' && bufferAlertState.length > 0
          ? true
          : undefined,
    );
  }, [aprAlertState, bufferAlertState]);

  return (
    <>
      <div className=" flex items-center justify-between gap-4 bg-[#F9F9F9] rounded-2xl p-4 my-4">
        <div className="flex flex-col md:flex-row items-center gap-2 ">
          <div className="w-10 h-10 rounded-full bg-[#EEEEEE] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_787_4368)">
                <path
                  d="M9.99974 18.334C10.9164 18.334 11.6664 17.584 11.6664 16.6673H8.33307C8.33307 17.584 9.08307 18.334 9.99974 18.334ZM14.9997 13.334V9.16732C14.9997 6.60898 13.6414 4.46732 11.2497 3.90065V3.33398C11.2497 2.64232 10.6914 2.08398 9.99974 2.08398C9.30807 2.08398 8.74974 2.64232 8.74974 3.33398V3.90065C6.36641 4.46732 4.99974 6.60065 4.99974 9.16732V13.334L3.33307 15.0007V15.834H16.6664V15.0007L14.9997 13.334ZM13.3331 14.1673H6.66641V9.16732C6.66641 7.10065 7.92474 5.41732 9.99974 5.41732C12.0747 5.41732 13.3331 7.10065 13.3331 9.16732V14.1673ZM6.31641 3.40065L5.12474 2.20898C3.12474 3.73398 1.80807 6.08398 1.69141 8.75065H3.35807C3.48307 6.54232 4.61641 4.60898 6.31641 3.40065ZM16.6414 8.75065H18.3081C18.1831 6.08398 16.8664 3.73398 14.8747 2.20898L13.6914 3.40065C15.3747 4.60898 16.5164 6.54232 16.6414 8.75065Z"
                  fill="#141414"
                />
              </g>
              <defs>
                <clipPath id="clip0_787_4368">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <p className="text-base font-medium text-[#141414]">{title}</p>
        </div>
        <div className="flex  items-center gap-8">
          <button
            onClick={() => {
              OnManageAlerts();
            }}
            type="button"
            className="text-[#2C3B8D] text-xs font-semibold py-2 px-3 bg-[#EEE] rounded-full"
          >
            Manage Alerts
          </button>
          <div className="flex  items-center gap-4">
            <p className="text-center md:text-left text-sm md:text-base">
              Alerts {toggleAlert ? 'On' : 'Off'}
            </p>
            <ToggleBTN
              setToggleAlert={setToggleAlert}
              toggleAlert={toggleAlert}
              setOpenModalFor={setOpenModalFor}
              title={
                alertFor === 'collateralBuffer'
                  ? 'Turn off Collateral Buffer Alerts'
                  : 'Turn off APR Alerts'
              }
              alertFor={alertFor}
              description={
                alertFor === 'collateralBuffer'
                  ? 'Are you sure you want to turn off Collateral Buffer alerts? This will delete any existing Collateral Buffer alerts.'
                  : 'Are you sure you want to turn off APR alerts? This will delete any existing APR alerts.'
              }
            />
          </div>
        </div>
      </div>
      {openModalFor && (
        <ModalContainer>
          {/* //todo change the name if both alert is same function  */}
          <CollateralBufferAlerts
            setOpenModalFor={setOpenModalFor}
            title={title}
            loanId={loanId}
            description={description}
            alertFor={alertFor}
            toggleAlert={!openModalFor.startsWith('manage')}
            setToggleAlert={setToggleAlert}
          />
        </ModalContainer>
      )}
    </>
  );
};

export default Alert;
