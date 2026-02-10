
import FitnessProfile from './FitnessProfile';
import Sprout from '../../components/chatbot/Sprout';

export default function Fitness(profile) {

  if (!profile) {
        return (
            <CreateFitnessProfileModal
                onSubmit={(profile) => {
                    // Save to DB here
                    console.log(profile);
                }}
            />
        );
    }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-6">
      <FitnessProfile></FitnessProfile>
      <Sprout></Sprout>
    </div>
  );
}
