import { useState } from 'react';
import { NETWORK } from '@/constants/env';

// TODO: currently unused, needed for wallet connected to wrong chain warning
export default () => {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORK);

  return { selectedNetwork, setSelectedNetwork };
};
