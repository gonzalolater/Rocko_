import Link from 'next/link';

const Status = () => (
  <div className="bg-white shadow-md rounded-lg p-8">
    <h1 className="text-2xl font-semibold mb-8 text-center">
      New Loans Paused
    </h1>
    <p>
      We are currently not accepting new loan bookings, please check for{' '}
      <a
        className="underline text-blue-500"
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/rockodefi"
      >
        status updates on X
      </a>
      .
    </p>
    <p>
      If you have an existing loan on Rocko, you can still manage it in your{' '}
      <Link className="underline text-blue-500" href="/loan-dashboard">
        loan servicing dashboard
      </Link>
    </p>
  </div>
);

export default Status;
