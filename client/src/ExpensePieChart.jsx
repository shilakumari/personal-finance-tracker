import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#f43f5e"];

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
  }).format(Number(amount));
}


function ExpensePieChart({ transactions = [] }) {
  const expensesByCategory = transactions.reduce((totals, transaction) => {
    if (transaction.type !== "EXPENSE") return totals;

    const category = transaction.category?.trim() || "Uncategorized";
    const amount = Number(transaction.amount);
    totals[category] = (totals[category] || 0) + amount;
    return totals;
  }, {});
  
  const chartData = Object.entries(expensesByCategory).map(
    ([category, amount], index) => ({
      category,
      amount,
      fill: COLORS[index % COLORS.length],
    })
  );


  return (
    <section>
      <h2>Expenses by Category</h2>

      {chartData.length === 0 ? (
        <p>Add an expense to see the category breakdown.</p>
      ) : (
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="amount" nameKey="category" outerRadius={100}/>
              <Tooltip formatter={(value) => formatINR(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ExpensePieChart;