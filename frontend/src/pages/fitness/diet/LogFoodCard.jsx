
export default function LogFoodCard() {
    return (
        <div className="rounded-2xl border bg-[red] w-[30%] p-5 m-auto">
            <h2 className="mb-2">Log Foods</h2>
            <div className="
                rounded-2xl w-[95%] m-auto flex flex-col gap-5
                [&>button]:bg-white
                [&>button]:rounded-lg
                [&>button]:h-[6rem]
                [&>button]:py-2
                [&>button:hover]:bg-gray-100"
            >
                <button>Breakfast</button>
                <button>Lunch</button>
                <button>Dinner</button>
                <button>Snacks</button>
            </div>
        </div>
    )
}