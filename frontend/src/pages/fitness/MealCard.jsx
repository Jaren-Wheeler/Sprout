
export default function MealCard({item, onDelete}) {

    return (
        <div className='flex gap-5'>
            <h2>{item.name}</h2>
            <button onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
            }}>x</button>
        </div>
    )
}