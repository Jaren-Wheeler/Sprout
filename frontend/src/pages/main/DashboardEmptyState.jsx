export default function DashboardEmptyState({ message = "There's nothing here" }) {

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-amber-800/70">

      <p className="text-sm italic">
        {message}
      </p>

    </div>
  );

}