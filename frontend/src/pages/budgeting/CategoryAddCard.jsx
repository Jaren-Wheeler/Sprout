export default function CategoryAddCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        min-w-[300px] max-w-[300px] min-h-[130px]
        sprout-add-card p-4
      "
    >
      <div className="text-green-500 text-3xl font-bold">+</div>

      <p className="text-green-600 font-medium mt-2">Add Category</p>
    </div>
  );
}
