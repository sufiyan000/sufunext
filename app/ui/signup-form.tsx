'use client';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { registerUser } from '@/app/lib/actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function SignupForm() {
   const router = useRouter();
  const [errorMessage, formAction, isPending] = useActionState(
    registerUser,
    undefined,
  );

   useEffect(() => {
    if (errorMessage === 'success') {
      router.replace('/login');
    }
  }, [errorMessage, router]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Create your account
        </h1>

        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-xs font-medium text-gray-900 mb-1">
            First Name
          </label>
          <div className="relative">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter your first name"
            />
            <UserIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-xs font-medium text-gray-900 mb-1">
            Last Name
          </label>
          <div className="relative">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter your last name"
            />
            <UserIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="mt-4">
  <label
    htmlFor="phoneNumber"
    className="mb-3 block text-xs font-medium text-gray-900"
  >
    Mobile Number
  </label>
  <div className="relative">
    <input
      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
      id="phoneNumber"
      name="phoneNumber"
      type="tel"
      placeholder="Enter your mobile number"
      required
    />
  </div>
</div>


        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-900 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter your email address"
            />
            <AtSymbolIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-gray-900 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter your password"
            />
            <KeyIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Submit Button */}
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        {/* Error Message */}
        <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
