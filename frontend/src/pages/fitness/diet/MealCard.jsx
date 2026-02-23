import { useState } from 'react';
export default function MealCard({item}) {

    const [items, setItems] = useState([]);
    // delete a diet item
    async function handleDelete(id) {
        try {
            await deleteDietItem(diet.id, id);

            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            return err;
        }
    }

    return (
        <div className='flex gap-5'>
            <h2>{item.name}</h2>
            <button onClick={handleDelete}>x</button>
        </div>
        
    )
}