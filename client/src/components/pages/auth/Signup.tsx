'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

interface ShowPass {
  pass: boolean;
  confirmPass: boolean;
}

function Signup() {
  const [showPass, setShowPass] = useState<ShowPass>({
    pass: false,
    confirmPass: false,
  });
  return (
    <main className="auth flex justify-center items-center py-12 md:py-[74px] px-5 md:px-0 bg-[#F6F6F6]">
      <form className="w-full max-w-[426px] p-6 rounded-2xl form-border bg-white">
        <div className="space-y-6">
          <h1 className="text-center text-2xl font-[500]">
            Sign up to finish creating your loan
          </h1>
          {/* //!Name-filed-start */}
          <div>
            <label htmlFor="name" className="text-sm font-semibold mb-2 block">
              Name
            </label>
            <input
              type="text"
              required
              placeholder="Type your name here..."
              id="name"
              className="text-sm px-4 py-[10px] rounded-[10px] form-border w-full form-focus"
            />
          </div>
          {/* //!Name-filed-end */}
          {/* //!Email-filed-start */}
          <div>
            <label htmlFor="email" className="text-sm font-semibold mb-2 block">
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
            <label
              htmlFor="password"
              className="text-sm font-semibold mb-2 block"
            >
              Password
            </label>
            <input
              type={showPass.pass ? 'text' : 'password'}
              required
              placeholder="Type your password here..."
              id="password"
              className="text-sm px-4 py-[10px] rounded-[10px] form-border w-full form-focus"
            />
            {showPass.pass ? (
              <AiFillEye
                className="h-5 w-5 ml-auto mr-4 -mt-8 cursor-pointer"
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, pass: false }))
                }
              />
            ) : (
              <AiFillEyeInvisible
                className="h-5 w-5 ml-auto mr-4 -mt-8 cursor-pointer"
                onClick={() => setShowPass((prev) => ({ ...prev, pass: true }))}
              />
            )}
          </div>
          {/* //!Password-filed-end */}
          {/* //!ConfirmPassword-filed-start */}
          <div className="pb-3">
            <label
              htmlFor="confirmpassword"
              className="text-sm font-semibold mb-2 block"
            >
              Confirm Password
            </label>
            <input
              type={showPass.confirmPass ? 'text' : 'password'}
              required
              placeholder="Confirm your password..."
              id="confirmpassword"
              className="text-sm px-4 py-[10px] rounded-[10px] form-border w-full form-focus"
            />
            {showPass.confirmPass ? (
              <AiFillEye
                className="eye-icon"
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, confirmPass: false }))
                }
              />
            ) : (
              <AiFillEyeInvisible
                className="eye-icon"
                onClick={() =>
                  setShowPass((prev) => ({ ...prev, confirmPass: true }))
                }
              />
            )}
          </div>
          {/* //!ConfirmPassword-filed-end */}
          {/* //!Button-start */}
          <button
            type="submit"
            className="w-full flex justify-center py-[14px] bg-[#2C3B8D] text-white rounded-[999px]"
          >
            Sign Up
          </button>
          {/* //!Button-end */}
          <p className="text-center">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#2C3B8D]">
              Login
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

export default Signup;
