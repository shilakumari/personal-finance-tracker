import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

import TransactionSection from "./TransactionSection.jsx";
import TransactionForm from "./TransactionForm.jsx";
import { createTransaction, deleteTransaction, getTransactions, } from "./transactionApi.js";
const summaryCards = [
  { title: "Total Balance", amount: "₹0", color: "text-slate-900" },
  { title: "Total Income", amount: "₹0", color: "text-emerald-600" },
  { title: "Total Expenses", amount: "₹0", color: "text-rose-600" },
];

function App() {
  const { user, loading, logout, request } = useAuth();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsError, setTransactionsError] = useState("");

  const totals = transactions.reduce(
    (result, transaction) => {
      const amount = Number(transaction.amount) || 0;

      if (transaction.type === "INCOME") result.income += amount;
      if (transaction.type === "EXPENSE") result.expenses += amount;

      return result;
    },
    { income: 0, expenses: 0 }
  );

  const formatINR = (amount) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const summaryCards = [
    {
      title: "Total Balance",
      amount: formatINR(totals.income - totals.expenses),
      color: "text-slate-900",
    },
    {
      title: "Total Income",
      amount: formatINR(totals.income),
      color: "text-emerald-600",
    },
    {
      title: "Total Expenses",
      amount: formatINR(totals.expenses),
      color: "text-rose-600",
    },
  ];

  useEffect(() => {
    if (!user?.id) return;
    let active = true;

    async function loadTransactions() {
      try {
        const data = await getTransactions(request);

        if (active) {
          setTransactions(data);
          setTransactionsError("");
        }
      } catch (error) {
        if (active) {
          setTransactionsError(error.message || "Could not load transactions.");
        }
      }
    }

    loadTransactions();

    return () => {
      active = false;
    };
  }, [user?.id, request]);

  async function handleTransactionDelete(id) {
    try {
      await deleteTransaction(request, id);

      setTransactions((currentTransactions) =>
        currentTransactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error("Could not delete transaction:", error);
    }
  }

  async function handleTransactionSubmit(transaction) {
    try {
      const savedTransaction = await createTransaction(request, transaction);

      //adds the returned transaction to the front of the current list
      setTransactions((currentTransactions) => [savedTransaction,...currentTransactions,]);
      setShowTransactionForm(false);//after save, closes form.
    } catch (error) {
      console.error("Could not save transaction:", error);
    }
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-slate-500">Loading...</main>;
  }

  if (!user) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      {/* Sidebar */}
      <aside className="bg-slate-900 p-6 text-white md:min-h-screen md:w-64">
        <h1 className="text-2xl font-bold">
          <span className="text-emerald-400">₹</span> FinTrack
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Personal Finance Tracker
        </p>

        <nav className="mt-8 flex gap-3 md:flex-col">
          <a
            href="#dashboard"
            className="rounded-lg bg-emerald-600 px-4 py-3"
          >
            Dashboard
          </a>
          <a
            href="#transactions"
            className="rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Transactions
          </a>
        </nav>
      </aside>

      {/* Main dashboard */}
      <main id="dashboard" className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Your money at a glance</p>
              <h2 className="mt-1 text-3xl font-bold">Dashboard</h2>
              <p className="mt-2 text-slate-500">Welcome{user.name ? `, ${user.name}` : ""}.</p>
            </div>
            <button type="button" onClick={logout} className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-white">
              Sign out
            </button>
          </div>
        </header>

        {/* Summary cards */}
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {card.title}
              </p>
              <p className={`mt-3 text-3xl font-bold ${card.color}`}>
                {card.amount}
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Your summary will appear here.
              </p>
            </div>
          ))}
        </section>

        {/* Transaction section */}
        <TransactionSection transactions={transactions} 
          onAddClick={() => setShowTransactionForm(true)}
          onDelete={handleTransactionDelete}
        />
        {showTransactionForm && (
          <TransactionForm 
            onSubmit={handleTransactionSubmit}
            onCancel={() => setShowTransactionForm(false)}
          />
        )}

        <footer className="mt-6 text-center text-sm text-slate-400">
          FinTrack · Your money, made clearer.
        </footer>
      </main>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const credentials = Object.fromEntries(formData.entries());

    try {
      await (isRegister ? register(credentials) : login(credentials));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg shadow-slate-900/5 sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">FinTrack</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-slate-500">{isRegister ? "Start keeping your finances in view." : "Sign in to continue to your dashboard."}</p>

        <div className="mt-7 grid grid-cols-2 border-b border-slate-200" role="tablist" aria-label="Authentication mode">
          <button type="button" role="tab" aria-selected={!isRegister} onClick={() => changeMode("login")} className={`border-b-2 px-3 py-3 text-sm font-semibold ${!isRegister ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500"}`}>
            Sign in
          </button>
          <button type="button" role="tab" aria-selected={isRegister} onClick={() => changeMode("register")} className={`border-b-2 px-3 py-3 text-sm font-semibold ${isRegister ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500"}`}>
            Create account
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input name="name" type="text" autoComplete="name" required maxLength={100} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input name="email" type="email" autoComplete="email" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 8 : 1} maxLength={72} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            {isRegister && <span className="mt-1.5 block text-xs font-normal text-slate-500">Use 8 to 72 characters.</span>}
          </label>

          {error && <p role="alert" className="rounded-lg bg-rose-50 px-3.5 py-3 text-sm text-rose-700">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
