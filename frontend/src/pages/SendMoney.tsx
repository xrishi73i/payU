import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Send, ArrowLeft, ChevronDown, History, User } from "lucide-react";
import logo from "../assets/logo.jpeg";

interface UserResult {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

const NAV_ITEMS = [
  { label: "Send Money", icon: Send, path: "/send-money" },
  { label: "Search User", icon: Search, path: "/search-user" },
  { label: "Transactions", icon: History, path: "/transactions" },
  { label: "Profile", icon: User, path: "/profile" },
];

const MOCK_USERS: UserResult[] = [
  { id: "1", firstName: "Rahul", lastName: "Sharma", username: "rahul" },
  { id: "2", firstName: "Priya", lastName: "Mehta", username: "priya" },
  { id: "3", firstName: "Arjun", lastName: "Verma", username: "arjun" },
  { id: "4", firstName: "Sneha", lastName: "Kapoor", username: "sneha" },
  { id: "5", firstName: "Vikram", lastName: "Nair", username: "vikram" },
];

const SendMoney = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [amount, setAmount] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulate debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      const filtered = MOCK_USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.firstName.toLowerCase().includes(query.toLowerCase()) ||
          u.lastName.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (user: UserResult) => {
    setSelectedUser(user);
    setQuery("");
    setResults([]);
  };

  const handleReset = () => {
    setSelectedUser(null);
    setAmount("");
  };

  const handleSend = () => {
    if (!selectedUser || !amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    console.log({ to: selectedUser.id, amount: Number(amount) });
  };

  const getInitials = (first: string, last: string) =>
    `${first[0]}${last[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col animate-[pageFade_0.4s_ease_both]">
      <style>{`
        @keyframes pageFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardFade {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes resultFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Navbar ── */}
      <header className="flex justify-center pt-6 px-6">
        <nav className="w-full max-w-5xl flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-[0_4px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <img src={logo} alt="PayU Logo" className="w-11 h-11 rounded-xl object-cover" />
            <span className="text-white font-bold text-lg tracking-tight">PayU</span>
          </div>

          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
              const isActive = path === "/send-money";
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isActive ? "text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-[#6366f1] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-sm font-bold">R</div>
            <span className="text-sm font-medium text-white">Rishi G</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors duration-200" />
          </button>
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md bg-[#111111] border border-neutral-800 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-6"
          style={{ animation: "cardFade 0.5s ease 0.1s both" }}
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-xl bg-[#1e1e1e] border border-neutral-700 overflow-hidden">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight">Send Money</h1>
              <p className="text-neutral-400 text-sm mt-1">Search for a user to transfer money.</p>
            </div>
          </div>

          {/* ── State 1: Search ── */}
          {!selectedUser && (
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search username..."
                  autoComplete="off"
                  className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-neutral-500 outline-none transition-all duration-200 hover:border-neutral-500 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/40"
                />
              </div>

              {/* Results */}
              {isSearching && (
                <p className="text-neutral-500 text-xs text-center py-2">Searching...</p>
              )}

              {!isSearching && query.trim() && results.length === 0 && (
                <p className="text-neutral-500 text-xs text-center py-2">No users found.</p>
              )}

              {!isSearching && results.length > 0 && (
                <div className="flex flex-col gap-2">
                  {results.map((user, i) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-3 hover:border-neutral-600 transition-all duration-200"
                      style={{ animation: `resultFade 0.25s ease ${i * 0.05}s both` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] text-xs font-bold shrink-0">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-neutral-500 text-xs">@{user.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelect(user)}
                        className="text-xs font-semibold text-[#6366f1] border border-[#6366f1]/40 px-3 py-1.5 rounded-lg hover:bg-[#6366f1]/10 hover:border-[#6366f1] transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── State 2: Selected + Amount ── */}
          {selectedUser && (
            <div className="flex flex-col gap-5" style={{ animation: "cardFade 0.3s ease both" }}>

              {/* Back */}
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors duration-150 cursor-pointer w-fit"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change user
              </button>

              {/* Selected User Card */}
              <div className="flex items-center gap-4 bg-[#1a1a1a] border border-[#6366f1]/30 rounded-xl px-4 py-4">
                <div className="w-12 h-12 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#6366f1] font-bold text-sm shrink-0">
                  {getInitials(selectedUser.firstName, selectedUser.lastName)}
                </div>
                <div>
                  <p className="text-white font-semibold text-base">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-neutral-400 text-sm">@{selectedUser.username}</p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="amount" className="text-white text-sm font-medium">
                  Amount
                </label>
                <div className="relative flex items-center bg-[#1a1a1a] border border-neutral-700 rounded-xl px-4 py-3 focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1]/40 hover:border-neutral-500 transition-all duration-200">
                  <span className="text-neutral-400 text-lg font-semibold mr-2">₹</span>
                  <input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-white text-lg font-semibold placeholder-neutral-600 outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm rounded-xl py-3.5 transition-all duration-200 hover:bg-neutral-100 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send Money
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 text-center text-neutral-600 text-sm">
        © 2025 PayU. All rights reserved.
      </footer>
    </div>
  );
};

export default SendMoney;