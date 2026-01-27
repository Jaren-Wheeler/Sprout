import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";


const nowForDatetimeInput = () =>
  new Date().toISOString().slice(0, 16);

export default function Fitness() {
  /* -------- DATA -------- */
  const [plans, setPlans] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/fitness");
      setPlans(res.data.plans);
      setWorkouts(res.data.workouts);
    };
    load();
  }, []);

  /* -------- PLAN MODAL -------- */
  const [openPlan, setOpenPlan] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");

  const createPlan = async () => {
    if (!planName.trim()) return;

    const res = await axios.post("/api/fitness-plans", {
      name: planName.trim(),
      description: planDesc || null,
    });

    setPlans((p) => [...p, res.data]);
    setOpenPlan(false);
    setPlanName("");
    setPlanDesc("");
  };

  const deletePlan = async (id) => {
    if (!confirm("Delete this plan?")) return;
    await axios.delete(`/api/fitness-plans/${id}`);
    setPlans((p) => p.filter((x) => x.fitness_plan_id !== id));
  };

  /* -------- WORKOUT MODAL -------- */
  const [openWorkout, setOpenWorkout] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutTime, setWorkoutTime] = useState(nowForDatetimeInput());
  const [durationMinutes, setDurationMinutes] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [wError, setWError] = useState(null);

  const createWorkout = async () => {
    setWError(null);

    if (!workoutTitle.trim()) {
      setWError("Workout title is required");
      return;
    }

    const res = await axios.post("/api/workouts", {
      title: workoutTitle.trim(),
      duration_minutes: durationMinutes ? Number(durationMinutes) : null,
      calories_burned: caloriesBurned ? Number(caloriesBurned) : null,
    });

    setWorkouts((w) => [...w, res.data]);
    setOpenWorkout(false);
    setWorkoutTitle("");
    setWorkoutTime(nowForDatetimeInput());
    setDurationMinutes("");
    setCaloriesBurned("");
  };

  const deleteWorkout = async (id) => {
    await axios.delete(`/api/workouts/${id}`);
    setWorkouts((w) => w.filter((x) => x.workout_id !== id));
  };

  /* -------- RENDER -------- */
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div>
          <h1 className="h1">Fitness</h1>
          <div className="muted">Plans and workouts</div>
        </div>
        <div className="spacer" />
        <Button onClick={() => setOpenPlan(true)}>+ New plan</Button>
        <Button onClick={() => setOpenWorkout(true)}>+ Log workout</Button>
      </div>

      <Card title="Fitness plans">
        {plans.length === 0 ? (
          <div className="muted">No plans yet.</div>
        ) : (
          <table className="table">
            <tbody>
              {plans.map((p) => (
                <tr key={p.fitness_plan_id}>
                  <td><span className="badge">{p.name}</span></td>
                  <td className="muted">{p.description ?? "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="ghost" onClick={() => deletePlan(p.fitness_plan_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="Workouts">
        {workouts.length === 0 ? (
          <div className="muted">No workouts logged yet.</div>
        ) : (
          <table className="table">
            <tbody>
              {workouts.map((w) => (
                <tr key={w.workout_id}>
                  <td>{w.title}</td>
                  <td>{w.duration_minutes ?? "—"}</td>
                  <td>{w.calories_burned ?? "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="ghost" onClick={() => deleteWorkout(w.workout_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Create Plan Modal */}
      <Modal
        open={openPlan}
        title="Create fitness plan"
        onClose={() => setOpenPlan(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setOpenPlan(false)}>Cancel</Button>
            <Button onClick={createPlan}>Create</Button>
          </div>
        }
      >
        <Field label="Plan name">
          <input className="input" value={planName} onChange={(e) => setPlanName(e.target.value)} />
        </Field>
        <Field label="Description (optional)">
          <textarea className="textarea" value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} />
        </Field>
      </Modal>

      {/* Create Workout Modal */}
      <Modal
        open={openWorkout}
        title="Log workout"
        onClose={() => setOpenWorkout(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setOpenWorkout(false)}>Cancel</Button>
            <Button onClick={createWorkout}>Save</Button>
          </div>
        }
      >
        <Field label="Workout title" error={wError}>
          <input className="input" value={workoutTitle} onChange={(e) => setWorkoutTitle(e.target.value)} />
        </Field>
        <Field label="Workout time">
          <input
            className="input"
            type="datetime-local"
            value={workoutTime}
            onChange={(e) => setWorkoutTime(e.target.value)}
          />
        </Field>
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
      </Modal>
    </div>
  );
}
