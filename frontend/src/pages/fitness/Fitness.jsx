import { useState, useEffect } from 'react';
import FitnessProfile from './FitnessProfile';
import CreateFitnessProfileModal from './CreateFitnessProfileModal';
import Sprout from '../../components/chatbot/Sprout';
import { getFitnessInfo, updateFitnessInfo } from '../../api/health';

export default function Fitness() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFitnessInfo()
      .then(setProfile)
      .finally(() => setLoading(false))
  },[]);

  if (loading) return null;

  if (!profile) {
        return (
            <CreateFitnessProfileModal
                onClose={() => {}}
                
                onSubmit={
                  async (data) => {
                    const saved = await updateFitnessInfo(data);
                    setProfile(saved);
                  }
                }
            />
        );
    }

  return (
    <div className="min-h-[calc(100vh-160px)] m-6 px-6">
      <FitnessProfile profile={profile}></FitnessProfile>

      <div className="flex justify-center">
        <button className="w-[25%] rounded-2xl border bg-white p-5 m-5 shadow-sm">My Diets</button>
        <button className="w-[25%] rounded-2xl border bg-white p-5 m-5 shadow-sm">My Workouts</button>
      </div>
      <Sprout></Sprout>
    </div>
  );
}
