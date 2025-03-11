import comp from '@/assets/coins/Compound (COMP).svg';
import usd from '@/assets/coins/USD Coin (USDC).svg';
import ether from '@/assets/coins/Ether (ETH).svg';
import Image from 'next/image';

function CoinRow() {
  const sm = window.matchMedia('(max-width: 640px)').matches;
  const iconsProps = {
    className: 'sm:w-8 sm:h-8 w-4 h-4 rounded-full',
    alt: '',
    width: sm ? 16 : 32,
    height: sm ? 16 : 32,
  };
  const textStyles =
    'sm:text-[28px] text-[16px] font-500 leading-[36px] whitespace-nowrap';
  return (
    <div className="flex items-center gap-[4px]">
      <Image {...iconsProps} src={comp} />
      <span className={textStyles}>Compound -</span>
      <Image {...iconsProps} src={usd} />
      <span className={textStyles}>USDC :</span>
      <Image {...iconsProps} src={ether} className="ml-0 sm:ml-[4px]" />
      <span className={textStyles}>ETH</span>
    </div>
  );
}

export default CoinRow;
