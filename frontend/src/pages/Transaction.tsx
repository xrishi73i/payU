import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  RefreshCw,
} from "lucide-react";

interface TransactionUser {
  firstName: string;
  lastName: string;
  username: string;
}

interface Transaction {
  id: string;
  amount: number;
  createdAt: string;
  fromUserId: string;
  toUserId: string;
  fromUser: TransactionUser;
  toUser: TransactionUser;
}

interface JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
  [key: string]: unknown;
}

type FetchStatus = "loading" | "success" | "error";
type TransactionDirection = "sent" | "received";
type TransactionGroupLabel = "Today" | "Yesterday" | "Older";

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = decodeJwt(token);
  return payload?.id ?? payload?.userId ?? payload?._id ?? null;
};

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getGroupLabel = (dateString: string): TransactionGroupLabel => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return "Older";
};

const formatDate = (dateString: string): string => {
  const label = getGroupLabel(dateString);
  if (label === "Today" || label === "Yesterday") return label;

  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const GROUP_ORDER: TransactionGroupLabel[] = ["Today", "Yesterday", "Older"];

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
  >
    <div className="h-12 w-12 shrink-0 rounded-full bg-white/10 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
      <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
    </div>
    <div className="space-y-2 text-right">
      <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
      <div className="h-3 w-12 rounded bg-white/10 animate-pulse ml-auto" />
    </div>
  </motion.div>
);

const TransactionCard = ({
  transaction,
  currentUserId,
  index,
}: {
  transaction: Transaction;
  currentUserId: string | null;
  index: number;
}) => {
  const direction: TransactionDirection =
    transaction.fromUserId === currentUserId ? "sent" : "received";

  const counterparty =
    direction === "sent" ? transaction.toUser : transaction.fromUser;

  const fullName = `${counterparty.firstName} ${counterparty.lastName}`.trim();
  const initials = getInitials(counterparty.firstName, counterparty.lastName);

  const isSent = direction === "sent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-colors duration-300 hover:border-purple-500/40"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 bg-gradient-to-r from-purple-500/[0.08] via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 shadow-[0_0_30px_rgba(168,85,247,0.35)] transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-700 text-sm font-semibold text-white shadow-[0_0_16px_rgba(147,51,234,0.35)]">
        {initials}
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-white">{fullName}</p>
        <p className="truncate text-sm text-purple-400/90">@{counterparty.username}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
          {isSent ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-red-400" />
          ) : (
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" />
          )}
          <span>{isSent ? "Sent" : "Received"}</span>
        </div>
      </div>

      <div className="relative shrink-0 text-right">
        <p
          className={`text-base font-bold sm:text-lg ${
            isSent ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {isSent ? "-" : "+"} ₹{transaction.amount.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs text-white/40">{formatDate(transaction.createdAt)}</p>
        <p className="text-xs text-white/30">{formatTime(transaction.createdAt)}</p>
      </div>
    </motion.div>
  );
};

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTransactions = async () => {
      setStatus("loading");
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get<{ transactions: Transaction[] }>(
          "/api/v1/account/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        setTransactions(data.transactions);
        setStatus("success");
      } catch (err) {
        if (axios.isCancel(err)) return;
        setStatus("error");
      }
    };

    fetchTransactions();

    return () => controller.abort();
  }, [refreshKey]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<TransactionGroupLabel, Transaction[]> = {
      Today: [],
      Yesterday: [],
      Older: [],
    };

    const sorted = [...transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    sorted.forEach((transaction) => {
      const label = getGroupLabel(transaction.createdAt);
      groups[label].push(transaction);
    });

    return groups;
  }, [transactions]);

  const hasTransactions = transactions.length > 0;

  return (
    <div className="min-h-screen w-full bg-black px-4 py-8 sm:px-6">
      <div className="pointer-events-none fixed top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-[130px]" />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto mb-8 flex w-full max-w-[850px] items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-2xl"
      >
        <motion.button
          type="button"
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 transition-colors duration-300 hover:border-purple-500/40 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </motion.button>

        <div className="text-center">
          <h1 className="text-lg font-semibold text-white sm:text-xl">
            Transaction History
          </h1>
          <p className="text-xs text-white/40 sm:text-sm">
            View all your payment activity.
          </p>
        </div>

        <div className="w-[76px]" />
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 mx-auto w-full max-w-[850px] rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_60px_rgba(147,51,234,0.15)] backdrop-blur-2xl sm:p-8"
      >
        {status === "loading" && (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <p className="text-white/60">Unable to load transactions.</p>
            <motion.button
              type="button"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_18px_rgba(147,51,234,0.5)]"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </motion.button>
          </div>
        )}

        {status === "success" && !hasTransactions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 py-24 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] border border-white/10">
              <Wallet className="h-8 w-8 text-purple-400/80" />
            </div>
            <div>
              <p className="text-base font-medium text-white">No transactions yet</p>
              <p className="mt-1 text-sm text-white/40">
                Your payments will appear here.
              </p>
            </div>
          </motion.div>
        )}

        {status === "success" && hasTransactions && (
          <div className="space-y-8">
            {GROUP_ORDER.map((label) => {
              const groupTransactions = groupedTransactions[label];
              if (groupTransactions.length === 0) return null;

              return (
                <section key={label}>
                  <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-white/40">
                    {label}
                  </h2>
                  <div className="space-y-3">
                    {groupTransactions.map((transaction, index) => (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        currentUserId={currentUserId}
                        index={index}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default Transactions;