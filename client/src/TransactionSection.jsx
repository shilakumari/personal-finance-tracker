import { useState } from "react";

function TransactionSection({ onAddClick, onDelete, transactions = [] }) {
  const [filters, setFilters] = useState({ startDate: "", endDate: "", category: "", type: "", });

  const categories = [
    ...new Set(transactions.map((transaction) => transaction.category).filter(Boolean)),
  ].sort();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStartDate =
      !filters.startDate || transaction.date >= filters.startDate;
    const matchesEndDate =
      !filters.endDate || transaction.date <= filters.endDate;
    const matchesCategory =
      !filters.category || transaction.category === filters.category;
    const matchesType =
      !filters.type || transaction.type === filters.type;

    return (
      matchesStartDate &&
      matchesEndDate &&
      matchesCategory &&
      matchesType
    );
  });

  function updateFilter(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({ ...currentFilters, [name]: value, }));
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR",
    }).format(Number(amount));
  }  

  return (
    <section
      id="transactions"
      className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">Recent Transactions</h3>
          <p className="mt-1 text-sm text-slate-500">
            Your income and expenses will appear here.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700"
        >
          + Add Transaction
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-slate-600">
          From
          <input type="date" name="startDate" value={filters.startDate}
            onChange={updateFilter}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium text-slate-600">
          To
          <input type="date" name="endDate" value={filters.endDate}
            onChange={updateFilter}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium text-slate-600">
          Category
          <select name="category" value={filters.category} 
            onChange={updateFilter}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-600">
          Type
          <select name="type" value={filters.type}
            onChange={updateFilter}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </label>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[500px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="py-3 pr-4 font-medium">Title</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Date</th>
              <th className="py-3 text-right font-medium">Amount</th>
              <th className="py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  {transactions.length === 0
                    ? "No transactions yet. Add your first transaction soon."
                    : "No transactions match these filters."}
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4">{transaction.title}</td>
                  <td className="py-3 pr-4">{transaction.category || "Uncategorized"}</td>
                  <td className="py-3 pr-4">{formatDate(transaction.date)}</td>
                  <td className={`py-3 text-right font-medium ${transaction.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                    {transaction.type === "EXPENSE" ? "−" : "+"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <button type="button" onClick={() => onDelete(transaction.id)}
                      className="rounded-lg border border-rose-200 px-3 py-1 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TransactionSection;