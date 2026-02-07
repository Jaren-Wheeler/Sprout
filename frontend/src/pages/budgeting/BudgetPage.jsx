import BudgetList from "../budgeting/BudgetList";
import BudgetDetail from "../budgeting/BudgetDetail";
import BudgetChart from "../budgeting/BudgetChart";
import BudgetSummary  from "../budgeting/BudgetSummary";
import Sprout from "../../components/chatbot/Sprout";

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🌱 Sprout Budget
        </h1>
        <p className="text-muted">
          Track your spending and watch your savings grow
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left */}
        <div className="space-y-4">
          <BudgetList />
        </div>

        {/* Right */}
        <div className="space-y-6">
          <BudgetDetail />
          <BudgetSummary />
          <BudgetChart />
        </div>
      </div>
      <Sprout></Sprout>
    </div>
  );
}
