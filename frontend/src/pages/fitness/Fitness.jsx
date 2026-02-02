// frontend/src/pages/fitness/Fitness.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api.js";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import { fromDatetimeLocalValue } from "../../lib/datetime.js";

// ✅ Shared app-page layout styles (panel + header + responsiveness)
import "../../styles/layout/appPages.css";

const nowForDatetimeInput = () => new Date().toISOString().slice(0, 16);

export default function Fitness() {
  const nav = useNavigate();

  const [plans, setPlans] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const load = async (signal) => {
    setLoading(true);
    setLoadError("");

    try {
      const res = await api.get("/api/fitness", signal ? { signal } : undefined);
      setPlans(Array.isArray(res.data?.plans) ? res.data.plans : []);
      setWorkouts(Array.isArray(res.data?.workouts) ? res.data.workouts : []);
    } catch (err) {
      if (err?.name === "CanceledError" || err?.name === "AbortError") return;

      console.error("Fitness load failed:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load fitness data. (Are you logged in? Is the server running?)";
      setLoadError(msg);
      setPlans([]);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overview = useMemo(() => {
    const workoutCount = workouts.length;
    const totalMinutes = workouts.reduce(
      (sum, w) => sum + Number(w?.duration_minutes ?? 0),
      0
    );
    const totalCalories = workouts.reduce(
      (sum, w) => sum + Number(w?.calories_burned ?? 0),
      0
    );
    return { workoutCount, totalMinutes, totalCalories };
  }, [workouts]);

  const [openPlan, setOpenPlan] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [planError, setPlanError] = useState("");

  const createPlan = async () => {
    setPlanError("");

    if (!planName.trim()) {
      setPlanError("Plan name is required.");
      return;
    }

    try {
      const res = await api.post("/api/fitness-plans", {
        name: planName.trim(),
        description: planDesc || null,
      });

      setPlans((p) => [res.data, ...p]);
      setOpenPlan(false);
      setPlanName("");
      setPlanDesc("");
    } catch (err) {
      console.error("Create plan failed:", err);
      setPlanError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create plan."
      );
    }
  };

  const deletePlan = async (id) => {
    if (!confirm("Delete this plan?")) return;

    try {
      await api.delete(`/api/fitness-plans/${id}`);
      setPlans((p) => p.filter((x) => x.fitness_plan_id !== id));
    } catch (err) {
      console.error("Delete plan failed:", err);
      alert(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete plan."
      );
    }
  };

  const [openWorkout, setOpenWorkout] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutTime, setWorkoutTime] = useState(nowForDatetimeInput());
  const [durationMinutes, setDurationMinutes] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [workoutError, setWorkoutError] = useState("");

  const createWorkout = async () => {
    setWorkoutError("");

    if (!workoutTitle.trim()) {
      setWorkoutError("Workout title is required.");
      return;
    }

    const dur = durationMinutes ? Number(durationMinutes) : null;
    const cal = caloriesBurned ? Number(caloriesBurned) : null;

    if (dur != null && (Number.isNaN(dur) || dur < 0)) {
      setWorkoutError("Duration must be a number (0 or higher).");
      return;
    }

    if (cal != null && (Number.isNaN(cal) || cal < 0)) {
      setWorkoutError("Calories must be a number (0 or higher).");
      return;
    }

    try {
      const res = await api.post("/api/workouts", {
        title: workoutTitle.trim(),
        workout_time: fromDatetimeLocalValue(workoutTime),
        duration_minutes: dur,
        calories_burned: cal,
      });

      setWorkouts((w) => [res.data, ...w]);
      setOpenWorkout(false);
      setWorkoutTitle("");
      setWorkoutTime(nowForDatetimeInput());
      setDurationMinutes("");
      setCaloriesBurned("");
    } catch (err) {
      console.error("Create workout failed:", err);
      setWorkoutError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save workout."
      );
    }
  };

  const deleteWorkout = async (id) => {
    if (!confirm("Delete this workout?")) return;

    try {
      await api.delete(`/api/workouts/${id}`);
      setWorkouts((w) => w.filter((x) => x.workout_id !== id));
    } catch (err) {
      console.error("Delete workout failed:", err);
      alert(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete workout."
      );
    }
  };

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <div className="page">
      <div className="panel">
        <div className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">Fitness</h1>
            <div className="pageSubtitle">Plans and workouts</div>

            {loadError ? (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,0,0,0.08)",
                }}
              >
                {loadError}
              </div>
            ) : null}
          </div>

          <div className="pageHeaderRight">
            <Button variant="ghost" onClick={() => nav("/dashboard")}>
              Dashboard
            </Button>

            <Button variant="ghost" onClick={() => load()}>
              Refresh
            </Button>
            <Button onClick={() => setOpenPlan(true)}>+ New plan</Button>
            <Button onClick={() => setOpenWorkout(true)}>+ Log workout</Button>
          </div>
        </div>

        <div className="pageBody" style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              alignItems: "start",
            }}
          >
            <Card title="Overview" subtitle="Quick totals from your logged workouts.">
              <div style={{ display: "grid", gap: 10 }}>
                <div className="row">
                  <div className="muted">Workouts</div>
                  <div className="spacer" />
                  <div style={{ fontWeight: 900 }}>{overview.workoutCount}</div>
                </div>

                <div className="row">
                  <div className="muted">Total minutes</div>
                  <div className="spacer" />
                  <div style={{ fontWeight: 900 }}>{overview.totalMinutes}</div>
                </div>

                <div className="row">
                  <div className="muted">Total calories</div>
                  <div className="spacer" />
                  <div style={{ fontWeight: 900 }}>{overview.totalCalories}</div>
                </div>

                <div className="muted" style={{ fontSize: 12 }}>
                  Tables scroll horizontally on small screens.
                </div>
              </div>
            </Card>

            <Card title="Fitness plans" subtitle="Your plan list.">
              {plans.length === 0 ? (
                <div className="muted">No plans yet.</div>
              ) : (
                <div className="tableWrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ minWidth: 160 }}>Name</th>
                        <th style={{ minWidth: 220 }}>Description</th>
                        <th style={{ width: 140 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.map((p) => (
                        <tr key={p.fitness_plan_id}>
                          <td>
                            <span className="badge">{p.name}</span>
                          </td>
                          <td className="muted">{p.description ?? "—"}</td>
                          <td style={{ textAlign: "right" }}>
                            <Button
                              variant="ghost"
                              onClick={() => deletePlan(p.fitness_plan_id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card title="Workouts" subtitle="Your logged workouts.">
              {workouts.length === 0 ? (
                <div className="muted">No workouts logged yet.</div>
              ) : (
                <div className="tableWrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ minWidth: 180 }}>Title</th>
                        <th style={{ minWidth: 140 }}>Minutes</th>
                        <th style={{ minWidth: 140 }}>Calories</th>
                        <th style={{ width: 140 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {workouts.map((w) => (
                        <tr key={w.workout_id}>
                          <td>{w.title}</td>
                          <td>{w.duration_minutes ?? "—"}</td>
                          <td>{w.calories_burned ?? "—"}</td>
                          <td style={{ textAlign: "right" }}>
                            <Button
                              variant="ghost"
                              onClick={() => deleteWorkout(w.workout_id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Modal
        open={openPlan}
        title="Create fitness plan"
        onClose={() => setOpenPlan(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}>
            <Button variant="ghost" onClick={() => setOpenPlan(false)}>
              Cancel
            </Button>
            <Button onClick={createPlan}>Create</Button>
          </div>
        }
      >
        {planError ? (
          <div
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,0,0,0.25)",
              background: "rgba(255,0,0,0.08)",
              fontSize: 13,
            }}
          >
            {planError}
          </div>
        ) : null}

        <Field label="Plan name">
          <input
            className="input"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </Field>

        <Field label="Description (optional)">
          <textarea
            className="textarea"
            value={planDesc}
            onChange={(e) => setPlanDesc(e.target.value)}
          />
        </Field>
      </Modal>

      <Modal
        open={openWorkout}
        title="Log workout"
        onClose={() => setOpenWorkout(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}>
            <Button variant="ghost" onClick={() => setOpenWorkout(false)}>
              Cancel
            </Button>
            <Button onClick={createWorkout}>Save</Button>
          </div>
        }
      >
        {workoutError ? (
          <div
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,0,0,0.25)",
              background: "rgba(255,0,0,0.08)",
              fontSize: 13,
            }}
          >
            {workoutError}
          </div>
        ) : null}

        <Field label="Workout title">
          <input
            className="input"
            value={workoutTitle}
            onChange={(e) => setWorkoutTitle(e.target.value)}
          />
        </Field>

        <Field label="Workout time">
          <input
            className="input"
            type="datetime-local"
            value={workoutTime}
            onChange={(e) => setWorkoutTime(e.target.value)}
          />
        </Field>

        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <Field label="Duration minutes (optional)">
            <input
              className="input"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </Field>

          <Field label="Calories burned (optional)">
            <input
              className="input"
              type="number"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}