import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { useStore } from "../state/store.jsx";

export default function Dashboard() {
  const { state, currentUser } = useStore();
  const user = currentUser();

  const myBudgets = state.budgets.filter((b) => b.user_id === user?.user_id);
  const myNotes = state.notes.filter((n) => n.user_id === user?.user_id);
  const myEvents = state.calendar_events.filter((e) => e.user_id === user?.user_id);
  const myWorkouts = state.workouts.filter((w) => w.user_id === user?.user_id);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div>
          <h1 className="h1">Dashboard</h1>
          <div className="muted">Single platform: budgeting, fitness/diet, calendar, notes, chatbot.</div>
        </div>
        <div className="spacer" />
        <span className="badge">MVP prototype</span>
      </div>

      <div className="grid2">
        <Card
          title="Budgeting"
          subtitle="Create budgets, add/edit/delete expenses, see totals and remaining balance."
          right={
            <Link to="/budgets">
              <Button>Open</Button>
            </Link>
          }
        >
          <div className="row">
            <span className="badge">{myBudgets.length} budgets</span>
          </div>
        </Card>

        <Card
          title="Fitness & Diet"
          subtitle="Log workouts, maintain plans, track diet and fitness history."
          right={
            <Link to="/fitness">
              <Button>Open</Button>
            </Link>
          }
        >
          <div className="row">
            <span className="badge">{myWorkouts.length} workouts</span>
          </div>
        </Card>

        <Card
          title="Calendar"
          subtitle="Create/edit/delete events (basic checks for invalid times)."
          right={
            <Link to="/calendar">
              <Button>Open</Button>
            </Link>
          }
        >
          <div className="row">
            <span className="badge">{myEvents.length} events</span>
          </div>
        </Card>

        <Card
          title="Notes"
          subtitle="Create, edit, delete notes. Autosave when editing."
          right={
            <Link to="/notes">
              <Button>Open</Button>
            </Link>
          }
        >
          <div className="row">
            <span className="badge">{myNotes.length} notes</span>
          </div>
        </Card>

        <Card
          title="AI Chatbot"
          subtitle="Send messages; responses are stored."
          right={
            <Link to="/chatbot">
              <Button>Open</Button>
            </Link>
          }
        >
          <div className="row">
            <span className="badge">{state.chatbot_messages.length} messages</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
