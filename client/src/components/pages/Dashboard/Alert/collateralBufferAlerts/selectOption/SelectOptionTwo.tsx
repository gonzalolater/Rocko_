import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import { BsCheckLg } from 'react-icons/bs';
import { BufferAlertType } from '@/types/type';

const interval = [
  { name: 'Minute(s)' },
  { name: 'Hour(s)' },
  { name: 'Day(s)' },
];

export default function SelectOptionTwo({
  setCollateralBufferAlert,
  scrollDown,
  userSelected,
}: {
  setCollateralBufferAlert?: Dispatch<SetStateAction<BufferAlertType>>;
  scrollDown: () => void;
  userSelected: string | undefined;
}) {
  const [selected, setSelected] = useState(interval[1]);
  const [click, setClick] = useState(!!userSelected);

  useEffect(() => {
    if (click && setCollateralBufferAlert) {
      setCollateralBufferAlert((prev) => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          interval: selected.name,
        },
      }));
    }
  }, [setCollateralBufferAlert, click, selected]);

  useEffect(() => {
    if (userSelected === 'Day(s)') setSelected(interval[2]);
    if (userSelected === 'Hour(s') setSelected(interval[1]);
    if (userSelected === 'Min(s)') setSelected(interval[0]);
  }, [userSelected]);
  return (
    <div className="w-full rounded-xl">
      <Listbox value={userSelected || selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button
            className="relative w-full cursor-default rounded-lg bg-white text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm p-4 form-border"
            onClick={() => {
              scrollDown();
              setClick(true);
            }}
          >
            <span
              className={`block truncate ${
                click ? 'text-black' : 'text-gray-400'
              }`}
            >
              {selected.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FiChevronDown
                className={`h-5 w-5 ${click ? 'text-black' : 'text-gray-400'} `}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-[98%] overflow-auto rounded-md bg-white text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
              {interval.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 md:py-[6px] pl-10 pr-4 ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {person.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                          <BsCheckLg className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
