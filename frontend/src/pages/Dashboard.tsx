import { useNavigate, useLocation } from "react-router-dom";
import { Send, Search, History, User, ChevronDown, ArrowRight } from "lucide-react";
import logo from "../assets/logo.jpeg";

const NAV_ITEMS = [
  { label: "Send Money", icon: Send, path: "/send-money" },
  { label: "Search User", icon: Search, path: "/search-user" },
  { label: "Transactions", icon: History, path: "/transactions" },
  { label: "Profile", icon: User, path: "/profile" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col animate-[pageFade_0.5s_ease_both]">
      <style>{`
        @keyframes pageFade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.55; }
        }
        @keyframes underlineExpand {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      {/* ── Navbar ── */}
      <header className="flex justify-center pt-6 px-6">
        <nav className="w-full max-w-5xl flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-[0_4px_32px_rgba(0,0,0,0.6)]">

          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <img
              src={logo}
              alt="PayU Logo"
              className="w-11 h-11 rounded-xl object-cover"
            />
            <span className="text-white font-bold text-lg tracking-tight">PayU</span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group
                    ${isActive ? "text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-[#6366f1] rounded-full"
                      style={{ animation: "underlineExpand 0.25s ease both" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Avatar */}
          <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-sm font-bold">
              R
            </div>
            <span className="text-sm font-medium text-white">Rishi G</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors duration-200" />
          </button>
        </nav>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6">

        {/* Radial purple glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 45% at 50% 52%, rgba(99,102,241,0.18) 0%, transparent 75%)",
            animation: "glowPulse 4s ease-in-out infinite",
          }}
        />

        <div
          className="relative flex flex-col items-center gap-6 text-center"
          style={{ animation: "heroFade 0.6s ease 0.15s both" }}
        >
          {/* Logo */}
          <div className="w-[120px] h-[120px] rounded-2xl bg-[#0e0e1a] border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.15)] flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt="PayU"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Welcome back, Rishi 👋
            </h1>
            <p className="text-neutral-400 text-base md:text-lg">
              Send money, search users and view your transactions
            </p>
          </div>

          {/* Transaction History Button */}
          <button
            onClick={() => navigate("/transactions")}
            className="group flex items-center gap-4 px-8 py-4 rounded-2xl border border-[#6366f1]/60 bg-transparent hover:bg-[#6366f1]/10 hover:border-[#6366f1] hover:shadow-[0_0_32px_rgba(99,102,241,0.25)] transition-all duration-300 cursor-pointer mt-2"
          >
            <History className="w-5 h-5 text-[#6366f1] group-hover:scale-110 transition-transform duration-200" />
            <span className="text-white font-semibold text-base tracking-wide">
              Transaction History
            </span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 text-center text-neutral-600 text-sm">
        © 2025 PayU. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;