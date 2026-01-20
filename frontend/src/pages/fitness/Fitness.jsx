import React, { useMemo, useState } from "react";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import { useStore } from "../../state/store.jsx";
import { fromDatetimeLocalValue, toDatetimeLocalValue } from "../../lib/datetime.js";
import { numberNonNegative, requiredText } from "../../lib/validators.js";

export default function Fitness() {
  const { state, dispatch, currentUser, nowForDatetimeInput } = useStore();
  const user = currentUser();

  const plans = useMemo(
    () => state.fitness_plans.filter((p) => p.user_id === user?.user_id),
    [state.fitness_plans, user]
  );
  const workouts = useMemo(
    () => state.workouts.filter((w) => w.user_id === user?.user_id),
    [state.workouts, user]
  );
  const diets = useMemo(
    () => state.diets.filter((d) => d.user_id === user?.user_id),
    [state.diets, user]
  );
  const fitnessInfo = useMemo(
    () => state.fitness_info.filter((f) => f.user_id === user?.user_id),
    [state.fitness_info, user]
  );

  const [openPlan, setOpenPlan] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");

  const [openWorkout, setOpenWorkout] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutTime, setWorkoutTime] = useState(nowForDatetimeInput());
  const [workoutDetails, setWorkoutDetails] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [planId, setPlanId] = useState(plans[0]?.fitness_plan_id ?? "");
  const [wError, setWError] = useState(null);

  const [openDiet, setOpenDiet] = useState(false);
  const [consumedAt, setConsumedAt] = useState(nowForDatetimeInput());
  const [itemName, setItemName] = useState("");
  const [dietCalories, setDietCalories] = useState("");
  const [dietNotes, setDietNotes] = useState("");
  const [dError, setDError] = useState(null);

  const [openInfo, setOpenInfo] = useState(false);
  const [recordedAt, setRecordedAt] = useState(nowForDatetimeInput());
  const [weightKg, setWeightKg] = useState("");
  const [bodyFatPct, setBodyFatPct] = useState("");
  const [infoNotes, setInfoNotes] = useState("");
  const [iError, setIError] = useState(null);

  const createPlan = () => {
    const err = requiredText("Plan name", planName);
    if (err) return;

    dispatch({
      type: "fitness_plans/create",
      payload: { user_id: user.user_id, name: planName.trim(), description: planDesc || null, start_date: null, end_date: null },
    });

    setOpenPlan(false);
    setPlanName("");
    setPlanDesc("");
  };

  const deletePlan = (fitness_plan_id) => {
    if (!confirm("Delete this plan?")) return;
    dispatch({ type: "fitness_plans/delete", payload: { fitness_plan_id } });
  };

  const createWorkout = () => {
    setWError(null);
    const errTitle = requiredText("Workout title", workoutTitle);
    if (errTitle) return setWError(errTitle);

    const errDur = numberNonNegative("Duration minutes", durationMinutes);
    if (errDur) return setWError(errDur);

    const errCal = numberNonNegative("Calories burned", caloriesBurned);
    if (errCal) return setWError(errCal);

    dispatch({
      type: "workouts/create",
      payload: {
        user_id: user.user_id,
        fitness_plan_id: planId ? Number(planId) : null,
        workout_time: fromDatetimeLocalValue(workoutTime),
        title: workoutTitle.trim(),
        details: workoutDetails || null,
        duration_minutes: durationMinutes === "" ? null : Number(durationMinutes),
        calories_burned: caloriesBurned === "" ? null : Number(caloriesBurned),
      },
    });

    setOpenWorkout(false);
    setWorkoutTitle("");
    setWorkoutTime(nowForDatetimeInput());
    setWorkoutDetails("");
    setDurationMinutes("");
    setCaloriesBurned("");
  };

  const deleteWorkout = (workout_id) => {
    dispatch({ type: "workouts/delete", payload: { workout_id } });
  };

  const createDiet = () => {
    setDError(null);
    const errName = requiredText("Item name", itemName);
    if (errName) return setDError(errName);

    const errCal = numberNonNegative("Calories", dietCalories);
    if (errCal) return setDError(errCal);

    dispatch({
      type: "diets/create",
      payload: {
        user_id: user.user_id,
        consumed_at: fromDatetimeLocalValue(consumedAt),
        item_name: itemName.trim(),
        calories: dietCalories === "" ? null : Number(dietCalories),
        notes: dietNotes || null,
      },
    });

    setOpenDiet(false);
    setConsumedAt(nowForDatetimeInput());
    setItemName("");
    setDietCalories("");
    setDietNotes("");
  };

  const createInfo = () => {
    setIError(null);
    const errW = numberNonNegative("Weight (kg)", weightKg);
    if (errW) return setIError(errW);
    const errB = numberNonNegative("Body fat %", bodyFatPct);
    if (errB) return setIError(errB);

    dispatch({
      type: "fitness_info/create",
      payload: {
        user_id: user.user_id,
        recorded_at: fromDatetimeLocalValue(recordedAt),
        weight_kg: weightKg === "" ? null : Number(weightKg),
        body_fat_pct: bodyFatPct === "" ? null : Number(bodyFatPct),
        notes: infoNotes || null,
      },
    });

    setOpenInfo(false);
    setRecordedAt(nowForDatetimeInput());
    setWeightKg("");
    setBodyFatPct("");
    setInfoNotes("");
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div>
          <h1 className="h1">Fitness & Diet</h1>
          <div className="muted">Log workouts, update plans, track diet + fitness history.</div>
        </div>
        <div className="spacer" />
        <Button onClick={() => setOpenPlan(true)}>+ New plan</Button>
        <Button onClick={() => setOpenWorkout(true)}>+ Log workout</Button>
        <Button onClick={() => setOpenDiet(true)}>+ Track diet</Button>
        <Button onClick={() => setOpenInfo(true)}>+ Add fitness info</Button>
      </div>

      <div className="grid2">
        <Card title="Fitness plans">
          {plans.length === 0 ? (
            <div className="muted">No plans yet.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.fitness_plan_id}>
                    <td><span className="badge">{p.name}</span></td>
                    <td className="muted">{p.description ?? "—"}</td>
                    <td style={{ textAlign: "right" }}>
                      <Button variant="ghost" onClick={() => deletePlan(p.fitness_plan_id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Fitness history">
          {fitnessInfo.length === 0 ? (
            <div className="muted">No fitness info entries yet.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Recorded</th>
                  <th>Weight (kg)</th>
                  <th>Body fat %</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {fitnessInfo.map((f) => (
                  <tr key={f.fitness_info_id}>
                    <td className="muted">{toDatetimeLocalValue(f.recorded_at)}</td>
                    <td>{f.weight_kg ?? <span className="muted">—</span>}</td>
                    <td>{f.body_fat_pct ?? <span className="muted">—</span>}</td>
                    <td className="muted">{f.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <div className="grid2">
        <Card title="Workouts">
          {workouts.length === 0 ? (
            <div className="muted">No workouts logged yet.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Calories</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((w) => (
                  <tr key={w.workout_id}>
                    <td className="muted">{toDatetimeLocalValue(w.workout_time)}</td>
                    <td>{w.title}</td>
                    <td>{w.duration_minutes ?? <span className="muted">—</span>}</td>
                    <td>{w.calories_burned ?? <span className="muted">—</span>}</td>
                    <td style={{ textAlign: "right" }}>
                      <Button variant="ghost" onClick={() => deleteWorkout(w.workout_id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Diet">
          {diets.length === 0 ? (
            <div className="muted">No diet entries yet.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Consumed</th>
                  <th>Item</th>
                  <th>Calories</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {diets.map((d) => (
                  <tr key={d.diet_id}>
                    <td className="muted">{toDatetimeLocalValue(d.consumed_at)}</td>
                    <td>{d.item_name}</td>
                    <td>{d.calories ?? <span className="muted">—</span>}</td>
                    <td className="muted">{d.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

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

        <div className="grid2">
          <Field label="Workout time">
            <input className="input" type="datetime-local" value={workoutTime} onChange={(e) => setWorkoutTime(e.target.value)} />
          </Field>

          <Field label="Plan (optional)">
            <select className="select" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              <option value="">(none)</option>
              {plans.map((p) => (
                <option key={p.fitness_plan_id} value={p.fitness_plan_id}>{p.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Duration minutes (optional)">
            <input className="input" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
          </Field>

          <Field label="Calories burned (optional)">
            <input className="input" type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} />
          </Field>
        </div>

        <Field label="Details (optional)">
          <textarea className="textarea" value={workoutDetails} onChange={(e) => setWorkoutDetails(e.target.value)} />
        </Field>
      </Modal>

      <Modal
        open={openDiet}
        title="Track diet"
        onClose={() => setOpenDiet(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setOpenDiet(false)}>Cancel</Button>
            <Button onClick={createDiet}>Save</Button>
          </div>
        }
      >
        <Field label="Consumed at" error={dError}>
          <input className="input" type="datetime-local" value={consumedAt} onChange={(e) => setConsumedAt(e.target.value)} />
        </Field>
        <Field label="Item name">
          <input className="input" value={itemName} onChange={(e) => setItemName(e.target.value)} />
        </Field>

        <div className="grid2">
          <Field label="Calories (optional)">
            <input className="input" type="number" value={dietCalories} onChange={(e) => setDietCalories(e.target.value)} />
          </Field>
          <div />
        </div>

        <Field label="Notes (optional)">
          <textarea className="textarea" value={dietNotes} onChange={(e) => setDietNotes(e.target.value)} />
        </Field>
      </Modal>

      <Modal
        open={openInfo}
        title="Add fitness info"
        onClose={() => setOpenInfo(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setOpenInfo(false)}>Cancel</Button>
            <Button onClick={createInfo}>Save</Button>
          </div>
        }
      >
        <Field label="Recorded at" error={iError}>
          <input className="input" type="datetime-local" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} />
        </Field>

        <div className="grid2">
          <Field label="Weight (kg) (optional)">
            <input className="input" type="number" step="0.01" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </Field>
          <Field label="Body fat % (optional)">
            <input className="input" type="number" step="0.01" value={bodyFatPct} onChange={(e) => setBodyFatPct(e.target.value)} />
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea className="textarea" value={infoNotes} onChange={(e) => setInfoNotes(e.target.value)} />
        </Field>
      </Modal>
    </div>
  );
}
