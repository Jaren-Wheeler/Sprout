import { useState, useEffect } from 'react';
import {getDietItems} from '../../../api/health';

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
    return (
        <div className="rounded-2xl border bg-[red] w-[30%] p-5 m-auto max-h-[520px] overflow-y-auto">
            <h2 className="mb-2">Your Daily Log</h2>
            <div className="rounded-2xl w-[95%] m-auto flex flex-col gap-5">
                {(items || []).map(item => (
                <div key={item.id}>
                    {item.name} || {item.meal} || {item.calories} cal || <button>x</button>
                </div>
                ))}
            </div>
        </div>
    )
}