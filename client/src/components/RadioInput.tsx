import React, { HTMLProps } from 'react';

type RadioInputProps = { label?: string } & HTMLProps<HTMLInputElement>;

function RadioInput(props: RadioInputProps) {
  const { label, ...rest } = props;
  return (
    <div className="flex items-start relative">
      <input
        type="checkbox"
        className="custom-checkbox w-5 h-5 md:w-7 md:h-7 z-10 border-black relative opacity-0 rounded-full"
        {...rest}
      />
      <label className="rounded-label" />
      <div className="pl-4 max-w-[284px] w-full">
        <label htmlFor="wallet3" className="font-semibold ">
          {label}
        </label>
      </div>
    </div>
  );
}

export default RadioInput;
