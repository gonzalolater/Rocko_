export const shortenAddress = (address: string, count = 7) =>
  `${address.slice(0, count)}...${address.slice(-count)}`;

export function financial(x: any, decimal = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
    useGrouping: true,
  }).format(x);
}

export default financial;
