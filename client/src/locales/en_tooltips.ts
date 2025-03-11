module.exports = {
  CURRENT_APR:
    'This is a variable (A.K.A. floating) APR and it fluctuates in real-time based on borrowing demand and available supply.',
  PROJECTED_INTEREST:
    'This is based on the current APR and displayed in USD at a 1:1 exchange rate. Your actual interest will likely be different as it is expected the APR will fluctuate during the term of your loan.',
  COLLATERAL_NEEDED:
    'This is the amount of collateral you will need to post for this loan. It is determined by your loan amount, the ratio required by the selected lending protocol, and the collateral buffer you set.',
  LIQUIDATION_PRICE:
    'This is the USD price of the collateral asset at which your collateral would be liquidated. For example, a liquidation price of $1,200 for ETH would mean your collateral would be liquidated if the price of ETH reached or dropped below $1,200. Increasing your collateral buffer will lower your liquidation price.',
  MAX_LTV:
    'This is the highest loan-to-value (LTV) ratio the lending protocol will allow when originating a loan. The LTV ratio is calculated by dividing the USD value of your loan by the USD value of your collateral. For example, a $1,000 loan with $2,000 of ETH as collateral would have a LTV of 50%.',
  LIQUIDATION_THRESHOLD:
    'This is the loan-to-value (LTV) ratio at which your collateral would be liquidated. For example, if the liquidation threshold is 90%, your collateral would be liquidated if the LTV reached or exceeded 90%.',
  LIQUIDATION_PENALTY:
    'If your collateral is liquidated, the lending protocol may charge a fee which is known as the liquidation penalty. For example, if the liquidation penalty is 5% and collateral worth $1,000 is liquidated, the lending protocol would collect a $50 fee when liquidating the collateral.',
  LOAN_TERM:
    'This is the length of your loan. Many loans in DeFi have no payment due date and can be held in perpetuity as long as the LTV stays below the liquidation threshold.',
  MINIMUM_MONTHLY_PAYMENT:
    'Many lending protocols require no monthly minimum payment.',
  PROTOCOL_REWARDS:
    "Some lending protocols offer rewards based on usage of their service. The reward rate is based on the loan amount and is typically paid in the protocol's native token.",
  TRAILING_APRS:
    'Trailing APRs are calculated as the average interest rate for specified time period. Interest rates are collected every 5 minutes as part of the calculation.',
  AVERAGE_APR:
    'This is the average APR for the length of this loan. It is calculated using your beginning interest rate and then the interest rate at every hour and half hour for the course of your loan.',
  FLOATING:
    'Floating rates are interest rates that change in real-time according to a predefined formula — usually based on the market demand and supply of an asset.',
};
