import { useState, useEffect } from 'react';
import AddDietItemModal from './addDietItemModal';
import {addDietItem} from '../../../api/health';

export default function LogFoodCard({diet}) {
    const [item, setItem] = useState([]);
    const [activeMeal, setActiveMeal] = useState(null);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="rounded-2xl border bg-[red] w-[15%] p-5 m-auto">
            <h2 className="mb-2">Log Foods</h2>
            <div className="
                rounded-2xl w-[95%] m-auto flex flex-col gap-5
                [&>button]:bg-white
                [&>button]:rounded-lg
                [&>button]:h-[6rem]
                [&>button]:py-2
                [&>button:hover]:bg-gray-100"
            >
                <button onClick={() => {setShowModal(true); setActiveMeal("BREAKFAST");}}>Breakfast</button>
                <button onClick={() => {setShowModal(true); setActiveMeal("LUNCH");}}>Lunch</button>
                <button onClick={() => {setShowModal(true); setActiveMeal("DINNER");}}>Dinner</button>
                <button onClick={() => {setShowModal(true); setActiveMeal("SNACKS");}}>Snacks</button>
            </div>

            <AddDietItemModal
                isOpen = {showModal}
                meal = {activeMeal}
                onClose = {() => setShowModal(false)}
                onCreate = {async (data) => {
                    const newItem = await addDietItem({
                        ...data,
                        id: diet.id});
                    
                    setItem(prev => [...prev, newItem]);
                    setShowModal(false);
                }}
            >
            </AddDietItemModal>
        </div>
    )
}