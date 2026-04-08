"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  const { isSignedIn } = useUser();
  const { sessionClaims } = useAuth();
  
  return (
    <header className="header px-5 md:px-16 py-4">
      {/* Logo part */}
      <div>
        <Link
          href="/"
          className="text-[16px] sm:text-[20px] font-semibold brandName"
          aria-label="Homepage"
        >
          Sahil-it
        </Link>
      </div>
      <nav>
        <ul className="flex justify-center items-center gap-4 lg:gap-6 text-white text-[15px] sm:text-[17px] font-semibold">
          {isSignedIn && sessionClaims?.metadata.role === "admin" && (
            <li className="flex justify-center items-center text-[16px]">
              <Link href={"/dashboard"}>Dashboard</Link>
            </li>
          )}

          <li className="flex justify-center items-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-purple-600 px-2 py-1 mr-2 sm:mr-4 hover:text-amber-400 transition-colors rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 bg-gradient-to-t from-slate-950">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-purple-600 px-2 py-1 rounded-md hover:text-amber-400 transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 bg-gradient-to-t from-slate-950">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
