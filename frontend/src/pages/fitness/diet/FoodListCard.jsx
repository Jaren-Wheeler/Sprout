import { useState, useEffect } from 'react';
import {getDietItems, deleteDietItem} from '../../../api/health';

export default function FoodListCard({diet}) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function loadItems() {
            const data = await getDietItems(diet.id);
            setItems(data);
        }

        if (diet?.id) {
            loadItems();
        }
    }, [diet.id])

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
        <div className="rounded-2xl border bg-[red] w-[30%] p-5 max-h-[520px] overflow-y-auto ">
            <h2 className="mb-2">Your Daily Log</h2>
            <div className="rounded-2xl w-[95%] m-auto flex flex-col gap-5">
                {(items || []).map(item => (
                <div key={item.id}>
                    {item.name} || {item.meal} || {item.calories} cal || <button onClick={() => handleDelete(item.id)}>x</button>
                </div>
                ))}
            </div>
        </div>
    )
}