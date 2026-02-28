import { useState, useEffect } from 'react';
import {getDietItems, deleteDietItem} from '../../../api/health';
import FoodItem from './FoodItem';
export default function FoodListCard({diet, items, setItems}) {

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
        <div className="rounded-2xl border bg-[red] w-[30%] pt-5 pl-1 pr-1 max-h-[520px] overflow-y-auto ">
            <h2 className="mb-2 text-center">Your Daily Log</h2>
            <div className="rounded-2xl w-[95%] m-auto flex flex-col gap-5">
                {(items || []).map(item => (
                <div key={item.id}>
                    <FoodItem item={item} onDelete={handleDelete}></FoodItem>
                </div>
                ))}
            </div>
        </div>
    )
}