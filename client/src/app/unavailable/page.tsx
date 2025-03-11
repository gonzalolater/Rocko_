'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const alert = {
  vpn: {
    title: (
      <h1 className="text-2xl font-semibold mb-8 text-center">VPN Detected</h1>
    ),
    content: (
      <p>
        If you are trying to access rocko.co using a VPN, please disconnect and
        try again. VPNs are not supported.
      </p>
    ),
  },
  region: {
    title: (
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Not Available in Your Region
      </h1>
    ),
    content: (
      <p>
        Our service is not available in your region. If you believe this is a
        mistake, please contact support@rocko.co
      </p>
    ),
  },
  inactive: {
    title: (
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Your account is restricted.
      </h1>
    ),
    content: (
      <p>
        Our service is not available for you. If you believe this is a mistake,
        please contact support@rocko.co
      </p>
    ),
  },
  loansPaused: {
    title: (
      <h1 className="text-2xl font-semibold mb-8 text-center">
        New Loans Paused
      </h1>
    ),
    content: (
      <p>
        We are currently not accepting new loan bookings, please check for{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/rockodefi"
        >
          status updates on X
        </a>
        . If you have an existing loan on Rocko, you can still manage it in your
        servicing dashboard
        <Link href="/loan-dashboard">servicing dashboard</Link>
      </p>
    ),
  },
};

function Unavailable() {
  const router = useSearchParams(); //! use the hooks for getting the URL parameters
  const reason = router.get('reason'); //! get the URL parameter reason value

  return (
    <main className="container mx-auto px-4 lg:py-10 flex justify-center">
      <div className="bg-gray-100 rounded-lg p-8 pb-24 max-w-md w-full mt-[8%]">
        {reason === 'region' && (
          <>
            {alert.region.title}
            {alert.region.content}
          </>
        )}
        {reason === 'vpn' && (
          <>
            {alert.vpn.title}
            {alert.vpn.content}
          </>
        )}
        {reason === 'inactive' && (
          <>
            {alert.inactive.title}
            {alert.inactive.content}
          </>
        )}
      </div>
    </main>
  );
}

export default Unavailable;
