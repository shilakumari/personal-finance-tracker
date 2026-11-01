//import { React } from "react";

function TransactionForm({ onSubmit, onCancel }) {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      title: formData.get("title"),
      amount: Number(formData.get("amount")),
      type: formData.get("type"),
      category: formData.get("category"),
      date: formData.get("date"),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">Add Transaction</h3>

      <label className="block text-sm font-medium text-slate-700">
        Title
        <input name="title" required maxLength={100}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Amount
        <input name="amount" type="number" min="0.01" step="0.01" required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Type
        <select name="type" required defaultValue=""
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="" disabled>Select income or expense</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Category
        <input name="category" required maxLength={100}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Date
        <input name="date" type="date" required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <div className="flex gap-3">
        <button type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Save Transaction
        </button>
        <button type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;