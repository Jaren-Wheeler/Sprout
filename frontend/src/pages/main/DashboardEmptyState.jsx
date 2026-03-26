export default function DashboardEmptyState({ message = "There's nothing here" }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[20px] border border-dashed border-[rgba(150,97,38,0.18)] bg-white/26 px-4 text-center text-[rgba(113,64,25,0.76)]">
      <p className="text-sm italic">
        {message}
      </p>
    </div>
  );
}
