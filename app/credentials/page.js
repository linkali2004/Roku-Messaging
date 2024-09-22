"use client";
import React, { useContext, useState, useEffect, useCallback } from 'react';
import DiamondIcon from '@mui/icons-material/Diamond';
import { Checkbox, CircularProgress, Link, Stack } from '@mui/material';
import Btn from '@/components/Btn';
import InputBox from '@/components/InputBox';
import { RegistrationContext } from '../../context/RegistrationContext';
import { useRouter } from 'next/navigation';
import { OverallContext } from '@/context/OverallContext';

export default function Page() {
  const { errors, fieldValues, setSignInSuccess, setSignUpSuccess, signInSuccess, signUpSuccess } = useContext(RegistrationContext);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setSnackbarMsg, setSnackOpen } = useContext(OverallContext);

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    if (signInSuccess || signUpSuccess) {
      router.replace("/");
    }
  }, [signInSuccess, signUpSuccess, router]);



  const handleSubmitSignup = useCallback(async () => {
    setIsLoading(true);
    setSignUpSuccess(false);
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldValues),
      cache: "no-store"
    });
    const data = await response.json();
    setIsLoading(false);
    setSnackbarMsg(data.message);
    setSnackOpen(true);

    if (response.ok) {
      setSignUpSuccess(true);
      router.replace("/");
    }
  }, [fieldValues, setSignUpSuccess, setSnackbarMsg, setSnackOpen]);

  const handleSubmitSignin = useCallback(async () => {
    setIsLoading(true);
    setSignInSuccess(false);
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(fieldValues)
    });
    const data = await response.json();
    setSnackbarMsg(data.message);
    setIsLoading(false);
    setSnackOpen(true);

    if (response.ok) {
      setSignInSuccess(true);
      router.replace("/");
    }
  }, [fieldValues, setSignInSuccess, setSnackbarMsg, setSnackOpen]);

  return (
    <div className='w-full h-screen p-4 flex items-center justify-center'>
      <div className='bg-white w-full max-w-3xl h-full md:h-3/4 rounded-md p-4 flex flex-col lg:flex-row relative overflow-x-hidden'>
        <div className='flex flex-col justify-center gap-3 w-full lg:w-1/2 items-center'>
          <div className='flex gap-2 items-center justify-center lg:justify-start'>
            <DiamondIcon className='mt-1 text-gray-950' />
            <h1 className='font-semibold text-xl text-gray-950 text-center'>{isSignUp ? 'Sign Up' : 'Login'}</h1>
          </div>
          <p className='font-light text-sm text-gray-800'>
            {isSignUp ? 'Free Forever. No Credit Card Needed.' : 'Welcome back! Please login.'}
          </p>
          <Stack direction="row" className="mt-2">
            <h1 className='text-sm mr-1 text-gray-950'>{isSignUp ? 'Have an Account?' : 'Need an Account?'}</h1>
            <p className="text-[#FF3B30] font-bold text-sm cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Login' : 'Sign Up'}
            </p>
          </Stack>
        </div>

        <div className='flex flex-col justify-center gap-3 w-full lg:w-1/2 items-center'>
          {isSignUp ? (
            <div className='w-full px-4 flex flex-col gap-3'>
              <InputBox label="Username" name="username" />
              <InputBox label="Email" name="email" />
              <InputBox label="Password" name="password" />
              <div className='flex items-center mt-2'>
                <Checkbox size="small" />
                <small className='text-gray-400'>
                  I agree to all <Link>Terms</Link>, <Link>Privacy Policy</Link>.
                </small>
              </div>
              {isLoading
                ? <div className='flex justify-center'><CircularProgress /></div>
                : <Btn type="submit" text="Submit" variant="contained" bg="black" disabled={errors} onClick={handleSubmitSignup} />}
            </div>
          ) : (
            <div className='w-full px-4 flex flex-col gap-3'>
              <InputBox label="Email" name="email" />
              <InputBox label="Password" name="password" />
              {isLoading
                ? <div className='flex justify-center'><CircularProgress /></div>
                : <Btn type="submit" text="Login" variant="contained" bg="black" disabled={errors} onClick={handleSubmitSignin} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
