// import { ProtocolConfig } from '../types';
// import {
//   calculateRewardsRate,
//   calculateLiquidationThreshold,
//   calculateLiquidationPenalty,
//   calculateMaxLtv,
//   getCurrentBorrowRate,
// } from './util';

// const aaveConfig: ProtocolConfig = {
//   name: 'Aave',
//   url: 'https://aave.com',
//   description: 'Aave is neat',
//   chain: 'sepolia',
//   collateral: ['ETH', 'WBTC'],
//   rateType: 'floating',
//   minBorrow: 100,
//   maxBorrow: 50000,
//   loanTerm: 'open',
//   borrowRate: getCurrentBorrowRate,
//   rewardsRate: calculateRewardsRate,
//   liquidationThreshold: calculateLiquidationThreshold,
//   liquidationPenalty: calculateLiquidationPenalty,
//   maxLtv: calculateMaxLtv,
// };
const aaveConfig = {};
// eslint-disable-next-line import/prefer-default-export
export { aaveConfig };
