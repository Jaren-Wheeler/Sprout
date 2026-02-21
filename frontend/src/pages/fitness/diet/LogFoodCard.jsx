import { useState, useEffect } from 'react';
import AddDietItemModal from './addDietItemModal';
import {addDietItem} from '../../../api/health';
export default function LogFoodCard() {
    const [item, setItem] = useState([]);
    const [showModal, setShowModal] = useState(false);

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
                <button onClick={() => setShowModal(true)}>Breakfast</button>
                <button onClick={() => setShowModal(true)}>Lunch</button>
                <button onClick={() => setShowModal(true)}>Dinner</button>
                <button onClick={() => setShowModal(true)}>Snacks</button>
            </div>

            <AddDietItemModal
                isOpen = {showModal}
                onClose = {() => setShowModal(false)}
                onCreate = {async (data) => {
                    const newItem = await addDietItem(data);
                    
                    setItem(prev => [...prev, newItem]);
                    setShowModal(false);
                }}
            >
        
            </AddDietItemModal>
        </div>
    )
}