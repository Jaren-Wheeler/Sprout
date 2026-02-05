// src/pages/fitness/Fitness.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SproutSection from "../../components/Sprout.jsx";

import {
  getFitnessInfo,
  updateFitnessInfo,
  getWorkouts,
  createWorkout,
  deleteWorkout,
  getDiets,
  createDiet,
  deleteDiet,
} from "../../api/health";

import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";

import "../../styles/layout/appPages.css";

export default function Fitness() {
  const nav = useNavigate();

  const [fitness, setFitness] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openWorkout, setOpenWorkout] = useState(false);
  const [openDiet, setOpenDiet] = useState(false);

  const [workoutName, setWorkoutName] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");

  const [dietName, setDietName] = useState("");
  const [dietDesc, setDietDesc] = useState("");

  const loadAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [fi, ws, ds] = await Promise.all([
        getFitnessInfo(),
        getWorkouts(),
        getDiets(),
      ]);

      setFitness(fi);
      setWorkouts(ws || []);
      setDiets(ds || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load fitness data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const saveFitness = async () => {
    try {
      const updated = await updateFitnessInfo({
        currentWeight: fitness?.currentWeight
          ? Number(fitness.currentWeight)
          : null,
        goalWeight: fitness?.goalWeight ? Number(fitness.goalWeight) : null,
        calorieGoal: fitness?.calorieGoal ? Number(fitness.calorieGoal) : null,
      });

      setFitness(updated);
    } catch (err) {
      alert(err.message || "Failed to save fitness info.");
    }
  };

  const addWorkout = async () => {
    if (!workoutName.trim()) return;

    try {
      const w = await createWorkout({
        name: workoutName.trim(),
        notes: workoutNotes || null,
      });

      setWorkouts((x) => [w, ...x]);
      setWorkoutName("");
      setWorkoutNotes("");
      setOpenWorkout(false);
    } catch (err) {
      alert(err.message || "Failed to create workout.");
    }
  };

  const addDiet = async () => {
    if (!dietName.trim()) return;

    try {
      const d = await createDiet({
        name: dietName.trim(),
        description: dietDesc || null,
      });

      setDiets((x) => [d, ...x]);
      setDietName("");
      setDietDesc("");
      setOpenDiet(false);
    } catch (err) {
      alert(err.message || "Failed to create diet.");
    }
  };

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <div className="page">
      <div className="panel">
        <div className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">Fitness</h1>
            <div className="pageSubtitle">
              Fitness info, workout templates, and diet templates.
            </div>

            {error && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,0,0,0.08)",
                }}
              >
                {error}
              </div>
            )}
          </div>

          <div className="pageHeaderRight">
            <Button variant="ghost" onClick={() => nav("/dashboard")}>
              Dashboard
            </Button>

            <Button variant="ghost" onClick={loadAll}>
              Refresh
            </Button>

            <Button onClick={() => setOpenWorkout(true)}>+ Workout</Button>
            <Button onClick={() => setOpenDiet(true)}>+ Diet</Button>
          </div>
        </div>

        <div className="pageBody" style={{ display: "grid", gap: 16 }}>
          <Card title="Fitness Info" subtitle="Basic goals and metrics.">
            <div style={{ display: "grid", gap: 12 }}>
              <Field label="Current weight">
                <input
                  className="input"
                  value={fitness?.currentWeight ?? ""}
                  onChange={(e) =>
                    setFitness((f) => ({ ...f, currentWeight: e.target.value }))
                  }
                />
              </Field>

              <Field label="Goal weight">
                <input
                  className="input"
                  value={fitness?.goalWeight ?? ""}
                  onChange={(e) =>
                    setFitness((f) => ({ ...f, goalWeight: e.target.value }))
                  }
                />
              </Field>

              <Field label="Daily calorie goal">
                <input
                  className="input"
                  value={fitness?.calorieGoal ?? ""}
                  onChange={(e) =>
                    setFitness((f) => ({ ...f, calorieGoal: e.target.value }))
                  }
                />
              </Field>

              <Button onClick={saveFitness}>Save</Button>
            </div>
          </Card>

          <Card title="Workouts" subtitle="Workout templates.">
            {workouts.length === 0 ? (
              <div className="muted">No workouts yet.</div>
            ) : (
              workouts.map((w) => (
                <div key={w.id} className="row" style={{ marginBottom: 8 }}>
                  <div>
                    <strong>{w.name}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {w.notes ?? ""}
                    </div>
                  </div>

                  <div className="spacer" />

                  <Button
                    variant="ghost"
                    onClick={() => deleteWorkout(w.id).then(loadAll)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </Card>

          <Card title="Diets" subtitle="Diet templates.">
            {diets.length === 0 ? (
              <div className="muted">No diets yet.</div>
            ) : (
              diets.map((d) => (
                <div key={d.id} className="row" style={{ marginBottom: 8 }}>
                  <div>
                    <strong>{d.name}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {d.description ?? ""}
                    </div>
                  </div>

                  <div className="spacer" />

                  <Button
                    variant="ghost"
                    onClick={() => deleteDiet(d.id).then(loadAll)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* ✅ Floating chatbot (does not take layout space) */}
      <SproutSection subtitle="Quick access to AI Chatbot while tracking fitness & diet." />

      <Modal
        open={openWorkout}
        title="Create workout"
        onClose={() => setOpenWorkout(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end", gap: 10 }}>
            <Button variant="ghost" onClick={() => setOpenWorkout(false)}>
              Cancel
            </Button>
            <Button onClick={addWorkout}>Create</Button>
          </div>
        }
      >
        <Field label="Workout name">
          <input
            className="input"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </Field>

        <Field label="Notes (optional)">
          <textarea
            className="textarea"
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
          />
        </Field>
      </Modal>

      <Modal
        open={openDiet}
        title="Create diet"
        onClose={() => setOpenDiet(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end", gap: 10 }}>
            <Button variant="ghost" onClick={() => setOpenDiet(false)}>
              Cancel
            </Button>
            <Button onClick={addDiet}>Create</Button>
          </div>
        }
      >
        <Field label="Diet name">
          <input
            className="input"
            value={dietName}
            onChange={(e) => setDietName(e.target.value)}
          />
        </Field>

        <Field label="Description (optional)">
          <textarea
            className="textarea"
            value={dietDesc}
            onChange={(e) => setDietDesc(e.target.value)}
          />
        </Field>
      </Modal>
    </div>
  );
}