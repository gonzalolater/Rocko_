import { FC, useRef, useState, useEffect } from 'react';
import { IoIosCheckbox, IoMdCall } from 'react-icons/io';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { AiOutlineMail } from 'react-icons/ai';
import Image from 'next/image';
import { BiLeftArrowAlt } from 'react-icons/bi';
import Link from 'next/link';
import { AlertFormProps, AprAlertType, BufferAlertType } from '@/types/type';
import { useAlertDB } from '@/db/alertDb';
import { useAlert } from '@/context/alertContext/alertContext';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useUserDB } from '@/db/userDb';
import closeIcon from '@/assets/Close.svg';
import { UPDATE_ALERT } from '@/constants/alertType';
import { FLAG_SMS_ALERTS } from '@/constants/featureFlags';
// import { ROCKO_WEBSITE_URL } from '@/constants';
import SelectOptionTwo from '../collateralBufferAlerts/selectOption/SelectOptionTwo';
import SelectOptionOne from '../collateralBufferAlerts/selectOption/SelectOptionOne';

const AlertForm: FC<AlertFormProps> = ({
  loanId,
  setOpenModalFor,
  title,
  setNext,
  alertFor,
  setToggleAlert,
  forUpdate,
  updateIndex,
}) => {
  const [userPhone, setUserPhone] = useState<string>('');
  const { userInfo } = useUserInfo();
  const { getUserData } = useUserDB();
  const { addAlert, updateAlert } = useAlertDB();
  const {
    aprAlertDispatch,
    aprAlertState,
    bufferAlertState,
    bufferAlertDispatch,
  } = useAlert();

  const fetchPhone = async (email: string) => {
    try {
      const user = await getUserData(email);
      setUserPhone(user?.[0]?.phone);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPhone(userInfo?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.email]);

  const [collateralBufferAlert, setCollateralBufferAlert] =
    useState<BufferAlertType>({
      id: forUpdate ? forUpdate?.id : bufferAlertState.length + 1,
      alertMethods: {
        email: forUpdate ? forUpdate.alertMethods.email : '',
        sms: forUpdate ? forUpdate.alertMethods.sms : '',
      },
      currentCollateralBuffer: {
        position: forUpdate
          ? alertFor === 'collateralBuffer'
            ? (forUpdate as BufferAlertType).currentCollateralBuffer.position
            : (forUpdate as AprAlertType).currentInterestRate.position
          : '',
        percentage: forUpdate
          ? alertFor === 'collateralBuffer'
            ? (forUpdate as BufferAlertType).currentCollateralBuffer.percentage
            : (forUpdate as AprAlertType).currentInterestRate.percentage
          : undefined,
      },
      callAlertType: 'Test Alert',
      emailAlertType: 'Test Alert',
      frequency: {
        repeat: forUpdate ? forUpdate.frequency.repeat : '',
        interval: forUpdate ? forUpdate.frequency.interval : '',
      },
    });

  const collateralEmailRef = useRef<HTMLInputElement>(null!);
  const collateralCallRef = useRef<HTMLInputElement>(null!);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const scrollDown = () => {
    modalContentRef.current?.scrollBy({
      top: 100,
      behavior: 'smooth',
    });
  };

  const handleCollateralPercent = (e: any) => {
    const value = parseFloat(e.target.value);

    if (!Number.isInteger(value)) {
      const convertValueToString = value.toString();
      const dotIndex = convertValueToString.indexOf('.');
      if (dotIndex !== -1) {
        const slicedString = convertValueToString.slice(0, dotIndex + 3);
        setCollateralBufferAlert((prev) => ({
          ...prev,
          currentCollateralBuffer: {
            ...prev.currentCollateralBuffer,
            percentage: parseFloat(slicedString),
          },
        }));
      } else {
        setCollateralBufferAlert((prev) => ({
          ...prev,
          currentCollateralBuffer: {
            ...prev.currentCollateralBuffer,
            percentage: value,
          },
        }));
      }
    } else if (value < 0) {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        currentCollateralBuffer: {
          ...prev.currentCollateralBuffer,
          percentage: undefined,
        },
      }));
    } else if (alertFor === 'APR' && value >= 100) {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        currentCollateralBuffer: {
          ...prev.currentCollateralBuffer,
          percentage: 100,
        },
      }));
    } else if (alertFor === 'collateralBuffer' && value >= 500) {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        currentCollateralBuffer: {
          ...prev.currentCollateralBuffer,
          percentage: 500,
        },
      }));
    } else {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        currentCollateralBuffer: {
          ...prev.currentCollateralBuffer,
          percentage: value,
        },
      }));
    }
  };

  const handleCollateralRepeat = (e: any) => {
    const value = parseFloat(e.target.value);
    if (value > 100) {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          repeat: 100,
        },
      }));
    } else {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          repeat: value,
        },
      }));
    }
  };

  const handleCollateralForm = () => {
    if (!loanId) return;

    // add alert to db
    if (!forUpdate) {
      addAlert(alertFor, loanId, collateralBufferAlert);
    } else {
      updateAlert(forUpdate?.id, collateralBufferAlert, 1);
    }

    if (forUpdate && alertFor === 'APR') {
      aprAlertDispatch({
        type: UPDATE_ALERT,
        index: updateIndex as number,
        alert: {
          id: forUpdate?.id,
          alertMethods: {
            email: collateralBufferAlert?.alertMethods?.email,
            sms: collateralBufferAlert?.alertMethods?.sms,
          },
          currentInterestRate: {
            percentage:
              collateralBufferAlert?.currentCollateralBuffer?.percentage,
            position: collateralBufferAlert?.currentCollateralBuffer?.position,
          },
          frequency: {
            interval: collateralBufferAlert?.frequency?.interval,
            repeat: collateralBufferAlert?.frequency?.repeat,
          },
        },
      });
      setNext(false);
      return;
    }
    if (forUpdate && alertFor === 'collateralBuffer') {
      bufferAlertDispatch({
        type: UPDATE_ALERT,
        index: updateIndex as number,
        alert: {
          id: forUpdate?.id,
          alertMethods: {
            email: collateralBufferAlert?.alertMethods?.email,
            sms: collateralBufferAlert?.alertMethods?.sms,
          },
          currentCollateralBuffer: {
            percentage:
              collateralBufferAlert?.currentCollateralBuffer?.percentage,
            position: collateralBufferAlert?.currentCollateralBuffer?.position,
          },
          frequency: {
            interval: collateralBufferAlert?.frequency?.interval,
            repeat: collateralBufferAlert?.frequency?.repeat,
          },
        },
      });
      setNext(false);
      return;
    }

    if (alertFor === 'APR') {
      aprAlertDispatch({
        type: 'ADD_ALERT',
        alert: {
          id: aprAlertState.length + 1,
          alertMethods: {
            email: collateralBufferAlert?.alertMethods?.email,
            sms: collateralBufferAlert?.alertMethods?.sms,
          },
          currentInterestRate: {
            percentage:
              collateralBufferAlert?.currentCollateralBuffer?.percentage,
            position: collateralBufferAlert?.currentCollateralBuffer?.position,
          },
          frequency: {
            interval: collateralBufferAlert?.frequency?.interval,
            repeat: collateralBufferAlert?.frequency?.repeat,
          },
        },
      });
    } else if (alertFor === 'collateralBuffer') {
      bufferAlertDispatch({
        type: 'ADD_ALERT',
        alert: {
          id: bufferAlertState.length + 1,
          alertMethods: {
            email: collateralBufferAlert?.alertMethods?.email,
            sms: collateralBufferAlert?.alertMethods?.sms,
          },
          currentCollateralBuffer: {
            percentage:
              collateralBufferAlert?.currentCollateralBuffer?.percentage,
            position: collateralBufferAlert?.currentCollateralBuffer?.position,
          },
          frequency: {
            interval: collateralBufferAlert?.frequency?.interval,
            repeat: collateralBufferAlert?.frequency?.repeat,
          },
        },
      });
    }
    setNext(false);
  };

  // ! toggle alert and Sent!
  const handleToggleEmailAlertType = () => {
    setCollateralBufferAlert((prev) => ({
      ...prev,
      emailAlertType:
        prev.emailAlertType === 'Test Alert' ? 'Sent!' : 'Test Alert',
    }));

    // This should say, “Sent!”. Also, please have it change back to “Test Alert” after two seconds
    setTimeout(() => {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        emailAlertType: 'Test Alert',
      }));
    }, 2000);
  };

  useEffect(() => {
    if (collateralBufferAlert.emailAlertType === 'Sent!')
      if (!forUpdate) {
        addAlert(alertFor, loanId, collateralBufferAlert);
      } else {
        updateAlert(forUpdate?.id, collateralBufferAlert, 1);
      }
  }, [collateralBufferAlert]);

  // ! toggle alert and silent
  const handleToggleCallAlertType = () => {
    setCollateralBufferAlert((prev) => ({
      ...prev,
      callAlertType:
        prev.callAlertType === 'Test Alert' ? 'Sent!' : 'Test Alert',
    }));
    // This should say, “Sent!”. Also, please have it change back to “Test Alert” after two seconds
    setTimeout(() => {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        callAlertType: 'Test Alert',
      }));
    }, 2000);
  };

  //! close the modal
  const handleCloseButton = () => {
    setToggleAlert(
      alertFor === 'APR' && aprAlertState.length > 0
        ? true
        : alertFor === 'collateralBuffer' && bufferAlertState.length > 0
          ? true
          : undefined,
    );

    setOpenModalFor('');
  };

  return (
    <>
      {/* //! collateral Buffer form  start */}
      <div className="flex items-center justify-between mb-4">
        <div
          onClick={() => setNext(false)}
          className="rounded-full bg-[#EEE] cursor-pointer p-2 w-fit"
        >
          <BiLeftArrowAlt className="h-[18px] w-[18px] text-[#323232]" />
        </div>
        <div>
          <button
            onClick={handleCloseButton}
            className="w-8 h-8 rounded-full p-2 bg-[#EEE] block"
          >
            <Image
              src={closeIcon}
              alt=""
              width={16}
              height={16}
              className="w-full"
            />
          </button>
        </div>
      </div>
      <h4 className="text-2xl font-semibold font-inter mb-6">{title}</h4>

      <div
        ref={modalContentRef}
        className="max-h-[50vh] overflow-auto mb-1 alert-container"
      >
        <p className="font-semibold mb-4">Select alert method(s)</p>
        <div className="p-4 form-border rounded-2xl mb-6">
          {/* //!email-alert-start */}
          <div className="flex items-center gap-x-3">
            <div className="rounded-full bg-[#EEE] p-2 w-max">
              <AiOutlineMail className="h-5 w-5 text-[#323232]" />
            </div>
            <input
              type="email"
              defaultValue={userInfo?.email}
              required
              ref={collateralEmailRef}
              readOnly
              className="grow focus:outline-none cursor-default"
            />
            {collateralBufferAlert.alertMethods.email && (
              <button
                onClick={handleToggleEmailAlertType}
                className=" bg-[#EEE] text-[#2C3B8D] rounded-full border border-[#2C3B8D] px-3 py-2 font-semibold text-xs"
              >
                {collateralBufferAlert.emailAlertType}
              </button>
            )}
            {!collateralBufferAlert.alertMethods.email ? (
              <MdCheckBoxOutlineBlank
                className="h-6 w-6 cursor-pointer"
                onClick={() => {
                  setCollateralBufferAlert((prev) => ({
                    ...prev,
                    alertMethods: {
                      ...prev.alertMethods,
                      email: collateralEmailRef.current.value,
                    },
                  }));
                }}
              />
            ) : (
              <IoIosCheckbox
                className="h-6 w-6 cursor-pointer"
                onClick={() => {
                  setCollateralBufferAlert((prev) => ({
                    ...prev,
                    alertMethods: {
                      ...prev.alertMethods,
                      email: '',
                    },
                  }));
                }}
              />
            )}
          </div>
          {/* //!email-alert-end */}
          {/* //!Call-alert-start */}
          {FLAG_SMS_ALERTS && (
            <>
              <hr className="my-4" />
              <div className="flex items-center gap-x-3">
                <div className="rounded-full bg-[#EEE] p-2 w-max">
                  <IoMdCall className="h-5 w-5 text-[#323232]" />
                </div>
                {userPhone ? (
                  <input
                    type="text"
                    required
                    value={userPhone}
                    ref={collateralCallRef}
                    readOnly
                    className="grow focus:outline-none cursor-default"
                  />
                ) : (
                  <Link
                    className="grow underline"
                    href="/profile/"
                    rel="noopener noreferrer"
                  >
                    Add your number on your profile page
                  </Link>
                )}
                {collateralBufferAlert.alertMethods.sms && (
                  <button
                    onClick={handleToggleCallAlertType}
                    className=" bg-[#EEE] text-[#2C3B8D] rounded-full border border-[#2C3B8D] px-3 py-2 font-semibold text-xs"
                  >
                    {collateralBufferAlert.callAlertType}
                  </button>
                )}
                {!collateralBufferAlert.alertMethods.sms ? (
                  <MdCheckBoxOutlineBlank
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      if (userPhone) {
                        setCollateralBufferAlert((prev) => ({
                          ...prev,
                          alertMethods: {
                            ...prev.alertMethods,
                            sms: collateralCallRef.current.value,
                          },
                        }));
                      }
                    }}
                  />
                ) : (
                  <IoIosCheckbox
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      setCollateralBufferAlert((prev) => ({
                        ...prev,
                        alertMethods: {
                          ...prev.alertMethods,
                          sms: '',
                        },
                      }));
                    }}
                  />
                )}
              </div>
            </>
          )}
          {/* //!Call-alert-end */}
        </div>
        <p className="font-semibold mb-4">Alert when</p>
        <div className="flex flex-col md:flex-row items-center gap-y-4 md:gap-y-0 md:gap-x-2 justify-between mb-6">
          <div className="w-full">
            <p className="text-sm font-[500] mb-2">
              {alertFor === 'collateralBuffer'
                ? 'Collateral buffer is'
                : 'Interest rate is'}
            </p>
            <SelectOptionOne
              setCollateralBufferAlert={setCollateralBufferAlert}
              alertFor={alertFor}
              userSelected={
                alertFor === 'collateralBuffer'
                  ? (forUpdate as BufferAlertType)?.currentCollateralBuffer
                      ?.position
                  : (forUpdate as AprAlertType)?.currentInterestRate?.position
              }
            />
          </div>
          <div className="w-full">
            <label htmlFor="collateralPercent" className="text-sm font-[500]">
              Percent
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                id="collateralPercent"
                required
                placeholder={alertFor === 'APR' ? '7' : '25'}
                name="collateralCall"
                value={
                  collateralBufferAlert?.currentCollateralBuffer?.percentage &&
                  collateralBufferAlert?.currentCollateralBuffer?.percentage
                }
                className="w-full p-4 form-border rounded-lg number-input text-sm"
                onInput={handleCollateralPercent}
              />
              <span
                className={`absolute right-4 text-lg top-4 ${
                  collateralBufferAlert?.currentCollateralBuffer?.percentage !==
                  undefined
                    ? 'text-black'
                    : 'text-gray-400'
                }`}
              >
                %
              </span>
            </div>
          </div>
        </div>
        <p className="font-semibold mb-4">Alert Frequencey</p>
        <div className="flex flex-col md:flex-row items-center gap-y-4 md:gap-y-0 md:gap-x-2 justify-between mb-6">
          <div className="w-full">
            <label htmlFor="collateralRepeat" className="text-sm font-[500]">
              Repeat every
            </label>
            <input
              type="number"
              name=""
              onKeyDown={(event) => {
                const keyPressed = event.key;
                const isDecimalDigit = /^\d+$/.test(keyPressed);
                const isAllowedHexChar = /^[a-eA-E]+$/.test(keyPressed);

                if (
                  (!isDecimalDigit && !(event.key === 'Backspace')) ||
                  isAllowedHexChar
                ) {
                  event.preventDefault();
                }
                if (event.key === '-') {
                  event.preventDefault();
                }
              }}
              id="collateralRepeat"
              required
              placeholder="1"
              defaultValue={forUpdate && forUpdate.frequency.repeat}
              value={collateralBufferAlert.frequency.repeat}
              onChange={handleCollateralRepeat}
              min={1}
              max={100}
              className="w-full p-4 form-border rounded-lg number-input mt-1 text-sm"
            />
          </div>
          <div className="w-full">
            <p className="text-sm font-[500] mb-2 hidden md:block md:opacity-0">
              Collateral buffer is
            </p>
            <SelectOptionTwo
              setCollateralBufferAlert={setCollateralBufferAlert}
              scrollDown={scrollDown}
              userSelected={forUpdate?.frequency.interval}
            />
          </div>
        </div>
        <div className="bg-[#F9F9F9] rounded-2xl p-4 mb-[6px]">
          <p className="text-sm text-[#545454]">
            {/* //todo: For now it doesn’t need to link anywhere */}
            Your email and phone number can be updated via your{' '}
            <Link href="/profile" className="underline">
              profile page
            </Link>{' '}
            which is located in the top right corner.
          </p>
        </div>
      </div>

      <div className="flex gap-x-3">
        <button
          // type="submit"
          onClick={handleCollateralForm}
          disabled={
            !(
              collateralBufferAlert?.currentCollateralBuffer?.percentage !==
                undefined &&
              collateralBufferAlert?.frequency?.repeat !== '' &&
              (collateralBufferAlert?.alertMethods?.email ||
                collateralBufferAlert?.alertMethods?.sms) &&
              collateralBufferAlert?.currentCollateralBuffer?.position !== '' &&
              collateralBufferAlert?.frequency?.interval !== ''
            )
          }
          className={`py-[10px] px-6 rounded-3xl text-white font-semibold ${
            collateralBufferAlert?.currentCollateralBuffer?.percentage !==
              undefined &&
            collateralBufferAlert?.frequency?.repeat !== '' &&
            (collateralBufferAlert?.alertMethods?.email ||
              collateralBufferAlert?.alertMethods?.sms) &&
            collateralBufferAlert?.currentCollateralBuffer?.position !== '' &&
            collateralBufferAlert?.frequency?.interval !== ''
              ? 'bg-[#2C3B8D]'
              : 'bg-[#ABB1D1]'
          }`}
        >
          Save
        </button>
        <button
          onClick={() => setNext(false)}
          className="py-[10px] px-6 rounded-3xl text-[#2C3B8D] bg-[#EEEEEE] font-semibold"
        >
          Cancel
        </button>
      </div>
      {/* //! collateral Buffer form  end */}
    </>
  );
};

export default AlertForm;
