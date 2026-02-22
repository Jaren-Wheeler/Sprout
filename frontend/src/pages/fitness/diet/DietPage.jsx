import { useLocation, useParams } from 'react-router-dom';
import LogFoodCard from './LogFoodCard'
import MealPlanningCard from './MealPlanningCard';
import DietCharts from './DietCharts';
import FoodListCard from './FoodListCard';
export default function DietPage() {
    const { id } = useParams();
    const location = useLocation();

    const diet = location.state?.diet;

    if (!diet) {
        return <div>Loading diet {diet.name}...</div>
    }

    return (
        <div className="rounded-2xl border bg-white w-[95%] p-8 mt-8 m-auto flex flex-col gap-5">
            <div>
                <h1>Diet Page for {diet.name}</h1>
            </div>
            <div className="flex gap-5">
                <LogFoodCard diet={diet}></LogFoodCard>
                <FoodListCard diet={diet}></FoodListCard>
                <div className=" w-[95%] p-8 m-auto flex flex-col gap-5">
                    <MealPlanningCard></MealPlanningCard>
                    <DietCharts></DietCharts>
                </div>
            </div> 
        </div>
    );
}