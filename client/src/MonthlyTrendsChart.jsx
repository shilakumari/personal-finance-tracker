import { Bar, BarChart, CartesianGrid, ResponsiveContainer, 
  Tooltip, XAxis, YAxis,
} from "recharts";

function MonthlyTrendsChart({ transactions = [] }) {
  const monthlyTotals = transactions.reduce((totals, transaction) => {
    const month = transaction.date?.slice(0, 7);

    if (!month) return totals;

    if (!totals[month]) {
      totals[month] = { income: 0, expenses: 0 };
    }

    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "INCOME") {
      totals[month].income += amount;
    } else if (transaction.type === "EXPENSE") {
      totals[month].expenses += amount;
    }

    return totals;
  }, {});

  const chartData = Object.entries(monthlyTotals)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, totals]) => ({
      month,
      income: totals.income,
      expenses: totals.expenses,
    }));

  return (
    <section>
      <h2>Monthly Trends</h2>
      {chartData.length === 0 ? (
        <p>Add transactions to see monthly trends.</p>
      ) : (
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#f43f5e" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </section>
  );
}

export default MonthlyTrendsChart;