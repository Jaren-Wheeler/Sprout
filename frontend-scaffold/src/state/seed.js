import { nowIsoLocal } from "../lib/datetime.js";

export function seedState() {
  const user = {
    user_id: 1,
    email: "demo@sprout.local",
    display_name: "Demo User",
    created_at: nowIsoLocal(),
    updated_at: nowIsoLocal(),
  };

  return {
    session: {
      currentUserId: user.user_id,
      isAuthenticated: true,
    },
    users: [user],
    user_settings: [
      {
        user_settings_id: 1,
        user_id: user.user_id,
        timezone: "Local",
        theme: "dark",
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      },
    ],

    budgets: [
      {
        budget_id: 1,
        user_id: user.user_id,
        name: "Monthly Budget",
        limit_amount: 2000.0,
        start_date: null,
        end_date: null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      },
    ],
    expenses: [
      {
        expense_id: 1,
        budget_id: 1,
        amount: 25.5,
        occurred_at: nowIsoLocal(),
        description: "Groceries",
        category: "Food",
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      },
    ],
    financial_history: [],

    fitness_plans: [
      {
        fitness_plan_id: 1,
        user_id: user.user_id,
        name: "Starter Plan",
        description: "Basic weekly plan",
        start_date: null,
        end_date: null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      },
    ],
    workouts: [
      {
        workout_id: 1,
        user_id: user.user_id,
        fitness_plan_id: 1,
        workout_time: nowIsoLocal(),
        title: "Workout Log",
        details: "Example workout details",
        duration_minutes: 30,
        calories_burned: 200,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      },
    ],
    fitness_info: [],
    diets: [],

    notes: [
      {
        note_id: 1,
        user_id: user.user_id,
        title: "Welcome Note",
        content: "This is a low-fidelity prototype. Notes autosave when you type.",
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      },
    ],

    calendar_events: [
      {
        calendar_event_id: 1,
        user_id: user.user_id,
        title: "Sample Event",
        details: "Optional details",
        start_time: nowIsoLocal(),
        end_time: null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      },
    ],

    chatbot_messages: [
      {
        chatbot_message_id: 1,
        user_id: user.user_id,
        user_message: "Hello",
        ai_response: "Hi! (Prototype) Ask me about productivity, fitness, or planning.",
        created_at: nowIsoLocal(),
      },
    ],
  };
}
