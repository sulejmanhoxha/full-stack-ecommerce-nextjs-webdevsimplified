import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/luciaAuth";

import { SignUpForm } from "@/components/auth/SignUpForm";

export default async function SignUpPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 dark:bg-gray-900 md:h-screen">
      <Link
        href="#"
        className="mb-8 flex items-center justify-center text-2xl font-semibold dark:text-white lg:mb-10"
      >
        <Image
          src="/vercel.svg"
          width={100}
          height={100}
          alt="vercel logo"
          className="W-22 mr-4 h-11"
        />
      </Link>
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create a Free Account
        </h2>
        <SignUpForm />
      </div>
    </div>
  );
}
