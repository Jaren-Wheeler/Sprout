export default function CategoryAddCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        min-w-[260px] max-w-[260px]
        border-2 border-dashed border-green-400
        rounded-xl p-4 flex flex-col items-center justify-center
        cursor-pointer hover:bg-green-50 transition
      "
    >
      <div className="text-green-500 text-3xl font-bold">+</div>

      <p className="text-green-600 font-medium mt-2">
        Add Category
      </p>
    </div>
  );
}
