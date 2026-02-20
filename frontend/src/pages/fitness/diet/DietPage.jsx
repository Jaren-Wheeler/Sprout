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
            <h1>Diet Page for {diet.name}</h1>
        </>
    );
}