

function StatsCard({ title, amount, color }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`mt-3 text-3xl font-bold ${color}`}>{amount}</p>
      <p className="mt-3 text-sm text-slate-400">
        Your summary will appear here.
      </p>
    </article>
  );
}

export default StatsCard;