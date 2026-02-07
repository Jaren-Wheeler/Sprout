import { useNavigate } from 'react-router-dom';
import { features } from './features';
import Sprout from "../../components/chatbot/Sprout";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted mt-1">Choose a feature to get started</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => navigate(feature.path)}
            className="
              rounded-xl border border-border bg-panel p-4 text-left
              hover:border-accent hover:bg-white/5
              transition
            "
          >
            <h2 className="font-medium">{feature.title}</h2>
            <p className="text-sm text-muted mt-1">{feature.description}</p>
          </button>
        ))}
      </div>
      <Sprout></Sprout>
    </div>
  );
}
