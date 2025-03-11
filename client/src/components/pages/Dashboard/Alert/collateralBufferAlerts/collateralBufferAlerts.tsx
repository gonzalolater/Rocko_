import ModalContent from '@/components/chips/ModalContent/ModalContent';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineMail, AiOutlineRight } from 'react-icons/ai';
import Image from 'next/image';
import { FC, Fragment, useState } from 'react';
import closeIcon from '@/assets/Close.svg';
import { IoMdCall } from 'react-icons/io';
import notification from '@/assets/notifications_active.svg';
import remove from '@/assets/delete.svg';
import { useAlert } from '@/context/alertContext/alertContext';
import { DELETE_ALERT } from '@/constants/alertType';
import { AprAlertType, BufferAlertType } from '@/types/type';
import { sortAprAlert, sortBufferAlert } from '@/utility/sortAlert';
import { useAlertDB } from '@/db/alertDb';
import AlertForm from '../alertForm/alertForm';

interface Props {
  setOpenModalFor: Function;
  title: string;
  loanId: number;
  description: string;
  alertFor: 'collateralBuffer' | 'APR';
  toggleAlert?: boolean;
  setToggleAlert: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const CollateralBufferAlerts: FC<Props> = ({
  setOpenModalFor,
  title,
  loanId,
  description,
  alertFor,
  toggleAlert,
  setToggleAlert,
}) => {
  const { deleteAlert } = useAlertDB();
  const [next, setNext] = useState(toggleAlert || false);
  const {
    aprAlertState,
    bufferAlertState,
    aprAlertDispatch,
    bufferAlertDispatch,
  } = useAlert();

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

  const handleDelete = async (index: number, aprAlert: any) => {
    await deleteAlert(aprAlert?.id);
    if (alertFor === 'APR') {
      aprAlertDispatch({ type: DELETE_ALERT, index });
    } else {
      bufferAlertDispatch({ type: DELETE_ALERT, index });
    }
  };

  const sortArpAlertState = sortAprAlert(aprAlertState);
  const sortBufferAlertState = sortBufferAlert(bufferAlertState);

  const [forUpdate, setForUpdate] = useState<
    BufferAlertType | AprAlertType | undefined
  >();
  const [forUpdateIndex, setForUpdateIndex] = useState<number>();
  const handleForUpdate = (
    index: number,
    alertType: BufferAlertType | AprAlertType,
  ) => {
    setForUpdate(alertType);
    setForUpdateIndex(index);
    setNext(true);
  };

  const handleCreateNew = () => {
    setForUpdate(undefined);
    setForUpdateIndex(undefined);
    setNext(true);
  };

  return (
    <ModalContent>
      {!next ? (
        <>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-2xl font-semibold font-inter">{title}</h4>
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
          <p className="mb-6">{description}</p>
          {/* go to form when click here */}
          {/* <div
            onClick={() => setNext(true)}
            className="p-4 form-border rounded-2xl flex items-center cursor-pointer gap-x-3 mb-6"
          >
            <div className="rounded-full bg-[#EEE] p-2 w-max">
              <FiPlus className="h-5 w-5 text-[#2C3B8D]" />
            </div>
            <p className="grow">Create new alert</p>
            <AiOutlineRight className="h-5 w-5 text-[#999A9B]" />
          </div> */}
          {/* //!----------------------------------------------------------------- */}
          {/* //!----------------------------------------------------------------- */}
          <div className="p-4 form-border rounded-2xl mb-6 h-full ">
            <div className="overflow-auto max-h-[45vh] alert-container">
              {alertFor === 'APR' &&
                sortArpAlertState.length > 0 &&
                sortArpAlertState.map((aprAlert, index) => (
                  <Fragment key={index}>
                    {/* //!both Call&Sms-alert-start */}
                    {aprAlert.alertMethods.email &&
                    aprAlert.alertMethods.sms ? (
                      <>
                        <div className="flex items-center gap-x-3 justify-between">
                          <div
                            onClick={() => handleForUpdate(index, aprAlert)}
                            className="flex items-center gap-x-3 cursor-pointer"
                          >
                            <div className="flex">
                              <div className="rounded-full bg-[#EEE] p-2 w-max border-2 border-white">
                                <AiOutlineMail className="h-5 w-5 text-[#323232]" />
                              </div>
                              <div className="rounded-full bg-[#EEE] p-2 w-max border-2 border-white -ml-4">
                                <IoMdCall className="h-5 w-5 text-[#323232]" />
                              </div>
                            </div>
                            <div className="grow">
                              <p>Email & SMS alert</p>
                              <p className="text-[#545454] text-sm">
                                {aprAlert.alertMethods.email},
                                {aprAlert.alertMethods.sms}
                              </p>
                            </div>
                          </div>
                          {/* alert&delete btns start */}
                          <div className="flex items-center gap-2">
                            <div className="py-[2px] px-2 rounded-[5px] bg-[#EFF3FE] text-[#276EF1] flex items-center gap-x-1">
                              <Image
                                src={notification}
                                alt="notify-bell"
                                width={16}
                                height={16}
                                className="w-full"
                              />
                              <p className="text-xs font-[500] whitespace-nowrap">
                                {aprAlert.currentInterestRate.position ===
                                'Above' ? (
                                  <>&gt;</>
                                ) : (
                                  <>&lt;</>
                                )}
                                {aprAlert.currentInterestRate.percentage}%
                              </p>
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDelete(index, aprAlert)}
                            >
                              <Image
                                src={remove}
                                alt="delete"
                                width={20}
                                height={20}
                                className="w-full"
                              />
                            </div>
                          </div>
                          {/* alert&delete btns end */}
                        </div>

                        {/* <hr className="my-4" /> */}
                      </>
                    ) : (
                      // email or sms alert
                      <>
                        {/* //!email-alert-start */}
                        <div className="flex items-center gap-x-3 justify-between">
                          <div
                            onClick={() => handleForUpdate(index, aprAlert)}
                            className="flex items-center gap-x-3 cursor-pointer"
                          >
                            <div className="rounded-full bg-[#EEE] p-2 w-max">
                              {aprAlert.alertMethods.email ? (
                                <AiOutlineMail className="h-5 w-5 text-[#323232]" />
                              ) : (
                                <IoMdCall className="h-5 w-5 text-[#323232]" />
                              )}
                            </div>
                            <div className="grow">
                              {aprAlert.alertMethods.email ? (
                                <p>Email alert</p>
                              ) : (
                                <p>SMS alert</p>
                              )}
                              <p className="text-[#545454] text-sm">
                                {aprAlert.alertMethods.email ||
                                  aprAlert.alertMethods.sms}
                              </p>
                            </div>
                          </div>
                          {/* alert&delete btns start */}
                          <div className="flex items-center gap-2">
                            <div className="py-[2px] px-2 rounded-[5px] bg-[#EFF3FE] text-[#276EF1] flex items-center gap-x-1">
                              <Image
                                src={notification}
                                alt="notify-bell"
                                width={16}
                                height={16}
                                className="w-full"
                              />
                              <p className="text-xs font-[500]  whitespace-nowrap">
                                {aprAlert.currentInterestRate.position ===
                                'Above' ? (
                                  <>&gt;</>
                                ) : (
                                  <>&lt;</>
                                )}
                                {aprAlert.currentInterestRate.percentage}%
                              </p>
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDelete(index, aprAlert)}
                            >
                              <Image
                                src={remove}
                                alt="delete"
                                width={20}
                                height={20}
                                className="w-full"
                              />
                            </div>
                          </div>
                          {/* alert&delete btns end */}
                        </div>
                        {/* //!email-alert-end */}

                        {/* <hr className="my-4" /> */}
                      </>
                    )}

                    <hr className="my-4" />
                  </Fragment>
                ))}
              {alertFor === 'collateralBuffer' &&
                sortBufferAlertState.length > 0 &&
                sortBufferAlertState.map((bufferAlert, index) => (
                  <Fragment key={index}>
                    {/* //!Call&Sms-alert-start */}
                    {bufferAlert.alertMethods.email &&
                    bufferAlert.alertMethods.sms ? (
                      <>
                        <div className="flex items-center gap-x-3 justify-between">
                          <div
                            onClick={() => handleForUpdate(index, bufferAlert)}
                            className="flex items-center gap-x-3 cursor-pointer"
                          >
                            <div className="flex">
                              <div className="rounded-full bg-[#EEE] p-2 w-max border-2 border-white">
                                <AiOutlineMail className="h-5 w-5 text-[#323232]" />
                              </div>
                              <div className="rounded-full bg-[#EEE] p-2 w-max border-2 border-white -ml-4">
                                <IoMdCall className="h-5 w-5 text-[#323232]" />
                              </div>
                            </div>
                            <div className="grow">
                              <p>Email & SMS alert</p>
                              <p className="text-[#545454] text-sm">
                                {bufferAlert.alertMethods.email},
                                {bufferAlert.alertMethods.sms}
                              </p>
                            </div>
                          </div>
                          {/* alert&delete btns start */}
                          <div className="flex items-center gap-2">
                            <div className="py-[2px] px-2 rounded-[5px] bg-[#EFF3FE] text-[#276EF1] flex items-center gap-x-1">
                              <Image
                                src={notification}
                                alt="notify-bell"
                                width={16}
                                height={16}
                                className="w-full"
                              />
                              <p className="text-xs font-[500] whitespace-nowrap">
                                {bufferAlert.currentCollateralBuffer
                                  .position === 'Above' ? (
                                  <>&gt;</>
                                ) : (
                                  <>&lt;</>
                                )}{' '}
                                {bufferAlert.currentCollateralBuffer.percentage}
                                %
                              </p>
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDelete(index, bufferAlert)}
                            >
                              <Image
                                src={remove}
                                alt="delete"
                                width={20}
                                height={20}
                                className="w-full"
                              />
                            </div>
                          </div>
                          {/* alert&delete btns end */}
                        </div>

                        {/* <hr className="my-4" /> */}
                      </>
                    ) : (
                      <>
                        {/* //!email-alert-start */}
                        <div className="flex items-center gap-x-3 justify-between">
                          <div
                            onClick={() => handleForUpdate(index, bufferAlert)}
                            className="flex items-center gap-x-3 cursor-pointer"
                          >
                            <div className="rounded-full bg-[#EEE] p-2 w-max">
                              {bufferAlert.alertMethods.email ? (
                                <AiOutlineMail className="h-5 w-5 text-[#323232]" />
                              ) : (
                                <IoMdCall className="h-5 w-5 text-[#323232]" />
                              )}
                            </div>
                            <div className="grow">
                              {bufferAlert.alertMethods.email ? (
                                <p>Email alert</p>
                              ) : (
                                <p>SMS alert</p>
                              )}
                              <p className="text-[#545454] text-sm">
                                {bufferAlert.alertMethods.email ||
                                  bufferAlert.alertMethods.sms}
                              </p>
                            </div>
                          </div>
                          {/* alert&delete btns start */}
                          <div className="flex items-center gap-2">
                            <div className="py-[2px] px-2 rounded-[5px] bg-[#EFF3FE] text-[#276EF1] flex items-center gap-x-1">
                              <Image
                                src={notification}
                                alt="notify-bell"
                                width={16}
                                height={16}
                                className="w-full"
                              />
                              <p className="text-xs font-[500]  whitespace-nowrap">
                                {bufferAlert.currentCollateralBuffer
                                  .position === 'Above' ? (
                                  <>&gt;</>
                                ) : (
                                  <>&lt;</>
                                )}
                                {bufferAlert.currentCollateralBuffer.percentage}
                                %
                              </p>
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => handleDelete(index, bufferAlert)}
                            >
                              <Image
                                src={remove}
                                alt="delete"
                                width={20}
                                height={20}
                                className="w-full"
                              />
                            </div>
                          </div>
                          {/* alert&delete btns end */}
                        </div>
                        {/* //!email-alert-end */}

                        {/* <hr className="my-4" /> */}
                      </>
                    )}

                    <hr className="my-4" />
                  </Fragment>
                ))}
            </div>

            {/* //!Create-alert-start */}
            <div
              onClick={handleCreateNew}
              className="flex items-center cursor-pointer gap-x-3"
            >
              <div className="rounded-full bg-[#EEE] p-2 w-max">
                <FiPlus className="h-5 w-5 text-[#2C3B8D]" />
              </div>
              <p className="grow">Create new alert</p>
              <AiOutlineRight className="h-5 w-5 text-[#999A9B]" />
            </div>

            {/* //!Create-alert-end */}
            {/* //!----------------------------------------------------------------- */}
            {/* //!----------------------------------------------------------------- */}
          </div>
          <div className="">
            <button
              // type="submit"
              onClick={handleCloseButton}
              className="py-[10px] px-6 rounded-3xl text-white font-semibold bg-[#2C3B8D]"
            >
              Done
            </button>
          </div>
        </>
      ) : (
        <AlertForm
          loanId={loanId}
          description=""
          setOpenModalFor={setOpenModalFor}
          title={title}
          setNext={setNext}
          alertFor={alertFor}
          setToggleAlert={setToggleAlert}
          forUpdate={forUpdate}
          updateIndex={forUpdateIndex}
        />
      )}
    </ModalContent>
  );
};

export default CollateralBufferAlerts;
