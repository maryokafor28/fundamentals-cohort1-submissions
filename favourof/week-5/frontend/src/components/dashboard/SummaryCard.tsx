interface SummaryCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
}

const SummaryCard = ({ title, value, icon, color }: SummaryCardProps) => {
  return (
    <div
      className={`flex items-center justify-between p-5 rounded-2xl shadow-md text-white ${
        color || "bg-blue-600"
      }`}
    >
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  );
};

export default SummaryCard;
