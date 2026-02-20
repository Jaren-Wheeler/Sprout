import { useLocation, useParams } from 'react-router-dom';

export default function DietPage() {
    const { id } = useParams();
    const location = useLocation();

    const diet = location.state?.diet;

    if (!diet) {
        return <div>Loading diet {diet.name}...</div>
    }

    return (
        <>
            
            <div className="rounded-2xl border bg-white w-[95%] p-8 m-8 m-auto flex flex-col gap-5">
                <div>
                    <h1>Diet Page for {diet.name}</h1>
                </div>
                <div className="flex">
                    <div className="rounded-2xl border bg-white w-[20%] p-8 m-auto">
                        <h2>Log Foods</h2>
                    </div>
                    <div className=" w-[95%] p-8 m-auto flex flex-col gap-5">
                        <div className="rounded-2xl border bg-white">
                            <h2>Meal planning</h2>
                        </div>
                        <div className="rounded-2xl border bg-white">
                            <h2>See results</h2>
                        </div>
                    </div>
                </div> 
            </div>
        </>
    );
}