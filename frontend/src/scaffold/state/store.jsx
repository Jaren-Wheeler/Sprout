import React, { createContext, useContext, useMemo, useReducer } from "react";
import { seedState } from "./seed.js";
import { nextId } from "../lib/id.js";
import { nowIsoLocal, toDatetimeLocalValue } from "../lib/datetime.js";
import { fakeChatbotReply } from "../lib/fakeChatbot.js";

const StoreContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "auth/register": {
      const { email, display_name } = action.payload;
      const newUser = {
        user_id: nextId(state.users, "user_id"),
        email,
        display_name: display_name || null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return {
        ...state,
        users: [newUser, ...state.users],
        session: { currentUserId: newUser.user_id, isAuthenticated: true },
      };
    }
    case "auth/login": {
      const { email } = action.payload;
      const existing = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!existing) return state;
      return { ...state, session: { currentUserId: existing.user_id, isAuthenticated: true } };
    }
    case "auth/logout": {
      return { ...state, session: { currentUserId: null, isAuthenticated: false } };
    }

    case "budgets/create": {
      const { user_id, name, limit_amount, start_date, end_date } = action.payload;
      const budget = {
        budget_id: nextId(state.budgets, "budget_id"),
        user_id,
        name,
        limit_amount,
        start_date: start_date || null,
        end_date: end_date || null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return { ...state, budgets: [budget, ...state.budgets] };
    }
    case "budgets/update": {
      const { budget_id, patch } = action.payload;
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.budget_id === budget_id ? { ...b, ...patch, updated_at: nowIsoLocal() } : b
        ),
      };
    }
    case "budgets/delete": {
      const { budget_id } = action.payload;
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.budget_id !== budget_id),
        expenses: state.expenses.filter((e) => e.budget_id !== budget_id),
      };
    }

    case "expenses/create": {
      const { budget_id, amount, occurred_at, description, category } = action.payload;
      const expense = {
        expense_id: nextId(state.expenses, "expense_id"),
        budget_id,
        amount,
        occurred_at: occurred_at || nowIsoLocal(),
        description: description || null,
        category: category || null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return { ...state, expenses: [expense, ...state.expenses] };
    }
    case "expenses/update": {
      const { expense_id, patch } = action.payload;
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.expense_id === expense_id ? { ...e, ...patch, updated_at: nowIsoLocal() } : e
        ),
      };
    }
    case "expenses/delete": {
      const { expense_id } = action.payload;
      return { ...state, expenses: state.expenses.filter((e) => e.expense_id !== expense_id) };
    }

    case "fitness_plans/create": {
      const { user_id, name, description, start_date, end_date } = action.payload;
      const plan = {
        fitness_plan_id: nextId(state.fitness_plans, "fitness_plan_id"),
        user_id,
        name,
        description: description || null,
        start_date: start_date || null,
        end_date: end_date || null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return { ...state, fitness_plans: [plan, ...state.fitness_plans] };
    }
    case "fitness_plans/delete": {
      const { fitness_plan_id } = action.payload;
      return {
        ...state,
        fitness_plans: state.fitness_plans.filter((p) => p.fitness_plan_id !== fitness_plan_id),
        workouts: state.workouts.filter((w) => w.fitness_plan_id !== fitness_plan_id),
      };
    }

    case "workouts/create": {
      const { user_id, fitness_plan_id, workout_time, title, details, duration_minutes, calories_burned } =
        action.payload;
      const workout = {
        workout_id: nextId(state.workouts, "workout_id"),
        user_id,
        fitness_plan_id: fitness_plan_id || null,
        workout_time: workout_time || nowIsoLocal(),
        title,
        details: details || null,
        duration_minutes: duration_minutes ?? null,
        calories_burned: calories_burned ?? null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return { ...state, workouts: [workout, ...state.workouts] };
    }
    case "workouts/delete": {
      const { workout_id } = action.payload;
      return { ...state, workouts: state.workouts.filter((w) => w.workout_id !== workout_id) };
    }

    case "fitness_info/create": {
      const { user_id, recorded_at, weight_kg, body_fat_pct, notes } = action.payload;
      const info = {
        fitness_info_id: nextId(state.fitness_info, "fitness_info_id"),
        user_id,
        recorded_at: recorded_at || nowIsoLocal(),
        weight_kg: weight_kg ?? null,
        body_fat_pct: body_fat_pct ?? null,
        notes: notes || null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return { ...state, fitness_info: [info, ...state.fitness_info] };
    }

    case "diets/create": {
      const { user_id, consumed_at, item_name, calories, notes } = action.payload;
      const diet = {
        diet_id: nextId(state.diets, "diet_id"),
        user_id,
        consumed_at: consumed_at || nowIsoLocal(),
        item_name,
        calories: calories ?? null,
        notes: notes || null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return { ...state, diets: [diet, ...state.diets] };
    }

    case "notes/create": {
      const { user_id, title, content } = action.payload;
      const note = {
        note_id: nextId(state.notes, "note_id"),
        user_id,
        title,
        content: content ?? "",
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return { ...state, notes: [note, ...state.notes] };
    }
    case "notes/update": {
      const { note_id, patch } = action.payload;
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.note_id === note_id ? { ...n, ...patch, updated_at: nowIsoLocal() } : n
        ),
      };
    }
    case "notes/delete": {
      const { note_id } = action.payload;
      return { ...state, notes: state.notes.filter((n) => n.note_id !== note_id) };
    }

    case "calendar/create": {
      const { user_id, title, details, start_time, end_time } = action.payload;
      const ev = {
        calendar_event_id: nextId(state.calendar_events, "calendar_event_id"),
        user_id,
        title,
        details: details || null,
        start_time: start_time || nowIsoLocal(),
        end_time: end_time || null,
        created_at: nowIsoLocal(),
        updated_at: nowIsoLocal(),
      };
      return { ...state, calendar_events: [ev, ...state.calendar_events] };
    }
    case "calendar/delete": {
      const { calendar_event_id } = action.payload;
      return {
        ...state,
        calendar_events: state.calendar_events.filter((e) => e.calendar_event_id !== calendar_event_id),
      };
    }

    case "chatbot/send": {
      const { user_id, user_message } = action.payload;
      const msg = {
        chatbot_message_id: nextId(state.chatbot_messages, "chatbot_message_id"),
        user_id,
        user_message,
        ai_response: fakeChatbotReply(user_message),
        created_at: nowIsoLocal(),
      };
      return { ...state, chatbot_messages: [...state.chatbot_messages, msg] };
    }

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, seedState);

  const api = useMemo(() => {
    return {
      state,
      dispatch,
      currentUser() {
        return state.users.find((u) => u.user_id === state.session.currentUserId) || null;
      },
      isAuthed() {
        return Boolean(state.session.isAuthenticated && state.session.currentUserId);
      },
      nowForDatetimeInput() {
        return toDatetimeLocalValue(nowIsoLocal());
      },
    };
  }, [state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
