'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

// import google from "@/assets/google-icon 1.svg";
// import Image from 'next/image';

function Signin() {
  const [showPass, setShowPass] = useState<boolean>(false);
  return (
    <main className="auth flex justify-center items-center py-16 md:py-[74px] px-5 md:px-0 bg-[#F6F6F6]">
      <form className="w-full max-w-[426px] p-6 rounded-2xl form-border bg-white">
        <div className="space-y-6">
          <h1 className="text-center text-2xl font-[500]">Welcome back</h1>
          {/* //!Email-filed-start */}
          <div>
            <label
              aria-label="email"
              htmlFor="email"
              className="text-sm font-semibold mb-2 block"
            >
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Type your email here..."
              id="email"
              className="text-sm px-4 py-[10px] rounded-[10px] form-border w-full form-focus"
            />
          </div>
          {/* //!Email-filed-end */}
          {/* //!Password-filed-start */}
          <div className="pb-3">
            <div className="mb-2 flex justify-between">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <Link href="#" className="text-[#2C3B8D] text-sm">
                Forgot Password
              </Link>
            </div>
            <input
              type={showPass ? 'text' : 'password'}
              required
              placeholder="Type your password here..."
              id="password"
              className="text-sm px-4 py-[10px] rounded-[10px] form-border w-full form-focus"
            />
            {showPass ? (
              <AiFillEye
                className="h-5 w-5 ml-auto mr-4 -mt-8 cursor-pointer"
                onClick={() => setShowPass(false)}
              />
            ) : (
              <AiFillEyeInvisible
                className="h-5 w-5 ml-auto mr-4 -mt-8 cursor-pointer"
                onClick={() => setShowPass(true)}
              />
            )}
          </div>
          {/* //!Password-filed-end */}
          {/* //!Button-start */}
          <button
            type="submit"
            className="w-full flex justify-center py-[14px] bg-[#2C3B8D] text-white rounded-[999px]"
          >
            Login
          </button>
          {/* //!Button-end */}
          <p className="text-center">
            Don’t have an account?{' '}
            <Link href="/auth/signup" className="text-[#2C3B8D]">
              Sign up
            </Link>
          </p>
          {/* //!Divider-start */}
          <div className="flex items-center">
            <div className="form-border w-full h-[1px]" />
            <p className="px-3">OR</p>
            <div className="form-border w-full h-[1px]" />
          </div>
          {/* //!Divider-end */}
          {/* //!SocialBtn-start */}
          <button className="w-full form-border rounded-lg px-4 py-[14px] flex items-center gap-x-3">
            {/* <Image src={google} height={24} width={24} alt="google-icon" /> */}
            <span>Continue with Google</span>
          </button>
          {/* //!SocialBtn-end */}
        </div>
      </form>
    </main>
  );
}

export default Signin;
