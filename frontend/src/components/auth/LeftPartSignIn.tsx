import logo from "@/assets/logo.jpeg";
import { useState } from "react";

interface LeftPartSignInProps {
  username: string;
  password: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSignin: () => void;
  loading: boolean;
}

const LeftPartSignIn = ({
  username,
  password,
  setUsername,
  setPassword,
   handleSignin,
  loading,
}: LeftPartSignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a] px-10 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <img
          src={logo}
          alt="PayU Logo"
          className="w-14 h-14 object-contain rounded-xl"
        />

        <div className="text-center">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Login to continue to your account
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-white text-sm font-medium"
            >
              Email address
            </label>
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-neutral-700 rounded-lg px-3 py-2.5 focus-within:border-neutral-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-neutral-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75"
                />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-transparent text-white text-sm placeholder-neutral-500 outline-none w-full"
                value={username}
               onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-white text-sm font-medium"
            >
              Password
            </label>
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-neutral-700 rounded-lg px-3 py-2.5 focus-within:border-neutral-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-neutral-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
                <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="bg-transparent text-white text-sm placeholder-neutral-500 outline-none w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="text-neutral-400 hover:text-neutral-200 transition-colors shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
            </div>
            <div className="flex justify-end">
              <a
                href="#"
                className="text-[#6366f1] text-sm hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
        <button
              type="button"
              onClick={handleSignin}
              disabled={loading}
              className="w-full bg-white text-black font-semibold text-sm rounded-lg py-3 hover:bg-neutral-100 transition-colors"
            >
              {loading ? "Signing In..." : "Continue"}
            </button>
        

        <p className="text-neutral-500 text-xs text-center leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="#" className="underline text-neutral-300 hover:text-white">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline text-neutral-300 hover:text-white">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LeftPartSignIn;