'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ROCKO_WEBSITE_URL } from '@/constants';
import { useRockoDisconnect } from '@/hooks/useRockoDisconnect';
import { useRockoAccount } from '@/hooks/useRockoAccount';
import user from '@/assets/images/user.png';
import logo from '@/assets/logo.png';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useLoanDB } from '@/db/loanDb';
import { useUserDB } from '@/db/userDb';
import usePlatformStatus from '@/hooks/usePlatformStatus';
import AlreadyOpenModal from '../AlreadyOpenModal/AlreadyOpenModal';
import ModalContainer from '../ModalContainer/ModalContainer';

function Header() {
  const { platformStatusMessage } = usePlatformStatus();
  const loginRef: any = useRef();
  const router = useRouter();
  const pathName = usePathname();
  const [toggle, setToggle] = useState(false);
  const [toggleDown, setToggleDown] = useState(false);
  const [openModalFor, setOpenModalFor] = useState('');
  const { disconnect } = useRockoDisconnect();
  const { address, isConnected } = useRockoAccount();
  const { userInfo, setUserInfo, loginUser } = useUserInfo();
  const { getLoanData } = useLoanDB();
  const {
    getUserData,
    getUserId,
    addUser,
    updateCountry,
    isVPN,
    isInActive,
    isReadOnly,
  } = useUserDB();
  const [isUnavailable, setIsUnavailable] = useState(false);

  const profilePic = userInfo?.verifiedCredentials?.find(
    (info: any) => info.format === 'oauth',
  )?.oauthAccountPhotos?.[0];
  const OnLogin = () => {
    loginUser();
  };

  const OnLogout = () => {
    sessionStorage.removeItem('token');
    disconnect();
    setUserInfo(null);
  };

  const handleClickOutside = (event: { target: any }) => {
    if (loginRef.current && !loginRef.current.contains(event.target)) {
      setToggleDown(false);
    }
  };

  const detectInActive = () => {
    if (!userInfo) return;

    if (sessionStorage.getItem('isActive') !== 'true') {
      isInActive(userInfo.email).then((response) => {
        if (response !== null) {
          if (response === 0) {
            sessionStorage.setItem('isActive', 'true');
          } else {
            setIsUnavailable(true);
            router.push(`/unavailable?reason=inactive`);
          }
        }
      });
    }
  };

  const detectReadOnly = () => {
    if (!userInfo) return;

    isReadOnly(userInfo.email).then((response) => {
      if (response !== null) {
        response === 0
          ? sessionStorage.setItem('isReadOnly', 'false')
          : sessionStorage.setItem('isReadOnly', 'true');
      }
    });
  };

  const detectVPN = () => {
    if (sessionStorage.getItem('clientAllowed') !== 'true') {
      isVPN().then((response) => {
        if (response) {
          if (response.status === 200) {
            sessionStorage.setItem('clientAllowed', 'true');
          } else {
            setIsUnavailable(true);

            if (response.data === 'Failed region/vpn test') {
              router.push(`/unavailable?reason=region`);
            } else {
              router.push(`/unavailable?reason=vpn`);
            }
          }
        }
      });
    }
  };

  const detectUserExist = async () => {
    if (userInfo && userInfo.sessionId) {
      getUserData(userInfo.email).then(async (res) => {
        /* if user not exist */
        if (!res || (res && res.length === 0 && address)) {
          addUser({
            email: userInfo.email,
            walletAddress: address as `0x${string}`,
            inactive: false,
          });
        } else {
          /* if user exist */
          await updateCountry(userInfo?.email); // log country_lastlogin

          const user_id = await getUserId(userInfo?.email);
          const result = await getLoanData(user_id);
          if (result) {
            const active_loans = result.filter(
              (loan: any) => loan.loan_active === 1,
            );

            if (active_loans?.length > 0 && pathName === '/') {
              /* if there is an active loan */
              setOpenModalFor('Already Open');
            }
          }
        }
      });
    }
  };

  /* search user in users table and add userInfo to table if nothing */
  useEffect(() => {
    detectUserExist();

    if (pathName === '/unavailable') {
      setIsUnavailable(true);
    } else {
      detectVPN();
      detectInActive();
      detectReadOnly();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, address]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1023) setToggle(false);
      });
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`header-custom sticky top-0 left-0 z-50 ${
        isUnavailable ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="w-full bg-white">
        <div className="container mx-auto px-[15px] bg-white ">
          <div className="flex justify-between  py-[10px] items-center">
            {/* close button here */}
            <button onClick={() => setToggle(!toggle)} className="lg:hidden ">
              <div className="flex flex-col items-center justify-center gap-1">
                <div
                  className={`w-4 h-[2px] rounded-full bg-slate-700 transform  relative duration-300  ${
                    toggle ? 'rotate-45 top-[6px]' : ' rotate-0  top-0'
                  } `}
                />
                <div
                  className={` duration-300 w-4 h-[2px] rounded-full bg-slate-700 ${
                    toggle ? 'opacity-0 invisible' : 'opacity-100 visible'
                  } `}
                />
                <div
                  className={` duration-300 w-4 h-[2px] rounded-full bg-slate-700 transform relative  ${
                    toggle ? ' -rotate-45  -top-[6px]' : ' rotate-0  top-0'
                  } `}
                />
              </div>
            </button>
            <a href={ROCKO_WEBSITE_URL}>
              <Image
                className="w-[56px] lg:w-[97px] inline-block pb-2"
                src={logo}
                alt="logo"
                width={97}
                height={51.728}
              />
            </a>
            <div className="flex items-center gap-12 justify-end">
              <div className="hidden  lg:flex items-center gap-8 justify-end">
                {!userInfo ? null : (
                  <Link
                    href="/loan-dashboard"
                    className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm "
                    onClick={() => setToggle(false)}
                  >
                    DASHBOARD
                  </Link>
                )}
                <Link
                  onClick={() => setToggle(false)}
                  href="/"
                  className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm "
                >
                  BORROW
                </Link>
                <Link
                  href={`${ROCKO_WEBSITE_URL}/why-defi/`}
                  className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm "
                >
                  WHY DEFI?
                </Link>
                <Link
                  href={`${ROCKO_WEBSITE_URL}/about/`}
                  className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm "
                >
                  ABOUT US
                </Link>
                <Link
                  href={`${ROCKO_WEBSITE_URL}/faq/`}
                  className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm "
                >
                  FAQ
                </Link>
                <Link
                  href={`${ROCKO_WEBSITE_URL}/contact-us/`}
                  className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm "
                >
                  CONTACT
                </Link>
                <Link
                  href={`${ROCKO_WEBSITE_URL}/learn/`}
                  className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm "
                >
                  LEARN
                </Link>
              </div>

              {isConnected ? (
                <div className="relative inline-block text-left" ref={loginRef}>
                  <button
                    type="button"
                    onClick={() => setToggleDown(!toggleDown)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                  >
                    <Image
                      className="h-7 rounded-full"
                      src={profilePic || user}
                      alt="user"
                      width={30}
                      height={30}
                    />
                  </button>
                  {toggleDown && (
                    <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="" role="menu" aria-orientation="vertical">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm w-full hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                        >
                          View Profile
                        </Link>
                        <button
                          type="button"
                          className="block px-4 py-2 text-sm w-full hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={OnLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="bg-[#293992] py-[11px] px-[24.6px] text-sm font-semibold rounded-full text-white hover:bg-[#6b3493] duration-500 uppercase"
                  onClick={OnLogin}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {toggle && (
        <div
          className={`responsive-navContainer fade-in absolute top-full left-0 `}
        >
          <div className="container mx-auto md:px-10 py-4  bg-white ">
            <Link
              onClick={() => setToggle(false)}
              href="/loan-dashboard"
              className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm py-4 block border-b border-b-[#e0e0e0] "
            >
              DASHBOARD
            </Link>

            <Link
              onClick={() => setToggle(false)}
              href="/"
              className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm py-4 block border-b border-b-[#e0e0e0] "
            >
              BORROW
            </Link>

            <Link
              href={`${ROCKO_WEBSITE_URL}/why-defi/`}
              className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm py-4 block border-b border-b-[#e0e0e0] "
            >
              WHY DEFI?
            </Link>

            <Link
              href={`${ROCKO_WEBSITE_URL}/about/`}
              className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm py-4 block border-b border-b-[#e0e0e0] "
            >
              ABOUT US
            </Link>

            <Link
              href={`${ROCKO_WEBSITE_URL}/faq/`}
              className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm py-4 block border-b border-b-[#e0e0e0] "
            >
              FAQ
            </Link>

            <Link
              href={`${ROCKO_WEBSITE_URL}/contact-us/`}
              className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm py-4 block"
            >
              CONTACT
            </Link>
            <Link
              href={`${ROCKO_WEBSITE_URL}/learn/`}
              className="text-blackPrimary font-semibold hover:text-[#6b3493] duration-200 text-sm py-4 block"
            >
              LEARN
            </Link>
          </div>
        </div>
      )}
      {openModalFor && openModalFor === 'Already Open' && (
        <ModalContainer>
          <AlreadyOpenModal setOpenModalFor={setOpenModalFor} />
        </ModalContainer>
      )}
      {platformStatusMessage ? (
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 85, 85, 1)',
            textAlign: 'center',
            color: 'white',
            padding: '8px',
          }}
        >
          {platformStatusMessage}, please visit{' '}
          <a
            href="https://x.com/rockodefi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            @rockodefi
          </a>{' '}
          for more information.
        </div>
      ) : null}
    </nav>
  );
}

export default Header;
