'use client';

import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

export default function ToggleBtn() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="md:mt-1 flex items-center">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-black' : 'bg-gray-300'}
          relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-[20px]' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
}
