
export default function MealCard({item}) {


    function handleDelete() {

    }

    return (
        <div className='flex gap-5'>
            <h2>{item.name}</h2>
            <button onClick={handleDelete}>x</button>
        </div>
        
    )
}