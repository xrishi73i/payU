import { useState } from "react";
import { signup } from "../services/auth";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";



const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignup = async () => {
  try {
    setLoading(true);

    const response = await signup({
      firstName,
      lastName,
      username,
      password,
    });

    console.log(response);

    alert("Account created successfully!");
} catch (error: unknown) {
  console.error("Signup Error:", error);
  console.log("Response:", error.response);
  console.log("Data:", error.response?.data);

  alert(error.response?.data?.message || error.message);
} finally {
    setLoading(false);//
  }
};

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 animate-[fadeSlideIn_0.4s_ease_both]">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-md bg-[#111111] border border-neutral-800 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-6">

        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-[#1e1e1e] border border-neutral-700 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-white text-sm font-medium tracking-wide">PayU</span>
        </div>

        <div className="text-center">
          <h1 className="text-white text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-neutral-400 text-sm mt-1.5">Enter your details below to create your account</p>
        </div>

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-white text-sm font-medium">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Enter your first name"
              className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-500 outline-none transition-all duration-200 hover:border-neutral-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-600"
              value={firstName}
               onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-white text-sm font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Enter your last name"
              className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-500 outline-none transition-all duration-200 hover:border-neutral-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-600"
              value={lastName}
               onChange={(e) => setLastName(e.target.value)}       
            
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-white text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-500 outline-none transition-all duration-200 hover:border-neutral-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-600"
              value={username}
                onChange={(e) => setUsername(e.target.value)}
            
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-white text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password"
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-neutral-500 outline-none transition-all duration-200 hover:border-neutral-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-600"
              value={password}
               onChange={(e) => setPassword(e.target.value)}
              
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors duration-150"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

           <button
             type="button"
             onClick={handleSignup}
              disabled={loading}
               className="w-full bg-white text-black font-semibold text-sm rounded-xl py-3 transition-all duration-200 hover:bg-neutral-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
  {loading ? "Creating Account..." : "Create Account"}
</button>

        <p className="text-neutral-400 text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-[#6366f1] hover:text-[#818cf8] transition-colors duration-150 font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>

      <p className="text-neutral-500 text-xs text-center mt-6 leading-relaxed max-w-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline text-neutral-300 hover:text-white transition-colors duration-150">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline text-neutral-300 hover:text-white transition-colors duration-150">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default SignUp;