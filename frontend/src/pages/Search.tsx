import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios, { type CancelTokenSource } from "axios";
import { ArrowLeft, Search as SearchIcon, ArrowRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

const AVATAR_GRADIENTS = [
  "from-purple-600 to-fuchsia-700",
  "from-blue-600 to-indigo-700",
  "from-fuchsia-600 to-purple-800",
  "from-violet-600 to-purple-700",
  "from-indigo-600 to-blue-800",
];

const getAvatarGradient = (seed: string): string => {
  const index = seed.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
};

const useDebouncedValue = <T,>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-b-0"
  >
    <div className="h-12 w-12 rounded-full bg-white/5 animate-pulse shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
      <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
    </div>
    <div className="h-4 w-4 rounded bg-white/5 animate-pulse shrink-0" />
  </motion.div>
);

const UserCard = ({ user, index }: { user: User; index: number }) => {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = getInitials(user.firstName, user.lastName);
  const gradient = getAvatarGradient(user.username || user._id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.01 }}
      className="group relative flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-b-0 cursor-pointer overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500/[0.06] via-transparent to-transparent" />

      <div
        className={`relative shrink-0 h-12 w-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-sm shadow-[0_0_16px_rgba(147,51,234,0.35)]`}
      >
        {initials}
      </div>

      <div className="relative flex-1 min-w-0">
        <p className="text-white font-semibold text-[15px] truncate">{fullName}</p>
        <p className="text-purple-400/90 text-sm truncate">@{user.username}</p>
      </div>

      <ChevronRight className="relative h-5 w-5 text-purple-400/80 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
    </motion.div>
  );
};

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const fetchUsers = useCallback(async (filter: string) => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("New search initiated");
    }

    const source = axios.CancelToken.source();
    cancelTokenRef.current = source;

    setStatus("loading");

    try {
      const { data } = await axios.get("http://localhost:3000/api/v1/user/bulk", {
        params: { filter },
        cancelToken: source.token,
      });

     setUsers(data.users);
       setStatus(data.users.length > 0 ? "success" : "empty");
    } catch (err) {
      if (axios.isCancel(err)) return;
      setUsers([]);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!debouncedQuery) {
      setUsers([]);
      setStatus("idle");
      return;
    }

    fetchUsers(debouncedQuery);

    return () => {
      cancelTokenRef.current?.cancel("Component cleanup or query changed");
    };
  }, [debouncedQuery, fetchUsers]);

  const skeletonPlaceholders = useMemo(() => [0, 1, 2], []);

  const showResultsPanel = status !== "idle";

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center px-4 sm:px-6 pt-8 pb-16 relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[700px] flex items-center relative z-10">
        <motion.button
          type="button"
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="h-11 w-11 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/90 backdrop-blur-md hover:bg-white/[0.06] hover:border-purple-500/40 transition-colors duration-300"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[700px] mt-10 relative z-10"
      >
        <div
          className={`relative flex items-center gap-3 rounded-full px-5 py-4 bg-white/[0.03] backdrop-blur-xl border transition-all duration-300 ${
            isFocused
              ? "border-purple-500/60 shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_0_30px_rgba(147,51,234,0.25)]"
              : "border-white/10 shadow-[0_0_20px_rgba(147,51,234,0.08)] hover:border-purple-500/30"
          }`}
        >
          <SearchIcon
            className={`h-5 w-5 shrink-0 transition-colors duration-300 ${
              isFocused ? "text-purple-400" : "text-purple-500/70"
            }`}
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search username..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-[15px] sm:text-base"
            autoComplete="off"
            spellCheck={false}
          />

          <motion.button
            type="button"
            onClick={() => fetchUsers(query.trim())}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            disabled={!query.trim()}
            className="shrink-0 h-11 w-11 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-[0_0_18px_rgba(147,51,234,0.55)] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-300"
            aria-label="Search"
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </motion.div>

      <div className="w-full max-w-[700px] mt-6 relative z-10">
        <AnimatePresence mode="wait">
          {showResultsPanel && (
            <motion.div
              key={status === "loading" ? "loading" : "panel"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {status === "loading" && (
                <div className="rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">
                  {skeletonPlaceholders.map((i) => (
                    <SkeletonCard key={i} index={i} />
                  ))}
                </div>
              )}

              {status === "success" && (
                <motion.div
                  layout
                  className="rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden"
                >
                  <AnimatePresence initial={false}>
                    {users.map((user, index) => (
                      <UserCard key={user._id} user={user} index={index} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {status === "empty" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center text-white/40 text-sm py-10"
                >
                  No users found
                </motion.p>
              )}

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center text-red-400/80 text-sm py-10"
                >
                  Unable to search users.
                  <br />
                  Please try again.
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;