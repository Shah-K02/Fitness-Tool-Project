import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Macro.css";
import BackButton from "./BackButton";
import {
  ACTIVITY_LEVELS,
  GOALS,
  HEIGHT_RANGE,
  WEIGHT_RANGE,
  ageFromBirthday,
  bmiCategory,
  calculateMacroPlan,
} from "../helpers/nutrition";

// Mifflin-St Jeor was developed and validated on adults.
const AGE_RANGE = { min: 18, max: 100 };

const FIELDS = [
  { name: "height", label: "Height", unit: "cm", range: HEIGHT_RANGE, example: "175" },
  { name: "weight", label: "Weight", unit: "kg", range: WEIGHT_RANGE, example: "70.5" },
  { name: "age", label: "Age", unit: "years", range: AGE_RANGE, example: "30" },
];

const fmt = (n) => Math.round(n).toLocaleString();
const pct = (share) => `${Math.round(share * 100)}%`;

const MacroCalculator = () => {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    age: "",
    sex: "",
    activityLevel: "",
    goal: "maintain",
  });
  const [fromProfile, setFromProfile] = useState(false);

  // Signed-in users start from their saved profile.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("/api/user/info", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        const age = ageFromBirthday(data.birthday);
        const prefill = {
          height: data.height ? String(Number(data.height)) : "",
          weight: data.weight ? String(Number(data.weight)) : "",
          age: age != null ? String(age) : "",
          sex: ["male", "female"].includes(data.gender) ? data.gender : "",
          activityLevel: data.activityLevel || "",
        };
        if (Object.values(prefill).some(Boolean)) {
          setForm((current) => ({ ...current, ...prefill }));
          setFromProfile(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const errors = Object.fromEntries(
    FIELDS.map(({ name, range, unit }) => {
      const value = form[name];
      if (value === "") return [name, null];
      const n = Number(value);
      return [
        name,
        Number.isFinite(n) && n >= range.min && n <= range.max
          ? null
          : `Enter ${range.min}–${range.max} ${unit}.`,
      ];
    })
  );

  const isComplete =
    FIELDS.every(({ name }) => form[name] !== "" && !errors[name]) &&
    form.sex &&
    form.activityLevel &&
    form.goal;

  const plan = useMemo(
    () =>
      isComplete
        ? calculateMacroPlan({
            height: Number(form.height),
            weight: Number(form.weight),
            age: Number(form.age),
            sex: form.sex,
            activityLevel: form.activityLevel,
            goal: form.goal,
          })
        : null,
    [isComplete, form]
  );

  const activity = ACTIVITY_LEVELS.find((a) => a.value === form.activityLevel);
  const goal = GOALS.find((g) => g.value === form.goal);
  const macros = plan
    ? [
        { key: "protein", label: "Protein", ...plan.protein },
        { key: "carbs", label: "Carbohydrate", ...plan.carbs },
        { key: "fats", label: "Fat", ...plan.fats },
      ]
    : [];

  return (
    <div className="macro-page">
      <BackButton className="back-button" backText=" Back" />
      <header className="macro-header">
        <h1>Macro calculator</h1>
        <p>
          Estimates the calories you burn in a day and splits a daily target
          into protein, carbohydrate and fat for your goal.
        </p>
      </header>

      <div className="macro-layout">
        <form className="macro-form" onSubmit={(e) => e.preventDefault()} noValidate>
          {fromProfile && (
            <p className="macro-prefill">Filled in from your profile. Changes here aren&rsquo;t saved.</p>
          )}

          <fieldset className="calc-section">
            <legend>Your body</legend>
            <div className="calc-measures">
              {FIELDS.map(({ name, label, unit, range, example }) => (
                <div className="calc-field" key={name}>
                  <label htmlFor={`calc-${name}`}>{label}</label>
                  <span className={`calc-unit-input${errors[name] ? " has-error" : ""}`}>
                    <input
                      id={`calc-${name}`}
                      name={name}
                      type="number"
                      inputMode="decimal"
                      min={range.min}
                      max={range.max}
                      step={name === "age" ? 1 : 0.1}
                      value={form[name]}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors[name])}
                      aria-describedby={`calc-${name}-hint`}
                    />
                    <span className="unit" aria-hidden="true">{unit}</span>
                  </span>
                  <span id={`calc-${name}-hint`} className={`calc-hint${errors[name] ? " is-flag" : ""}`}>
                    {errors[name] || `e.g. ${example}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="calc-field calc-sex">
              <span className="calc-label" id="calc-sex-label">Sex</span>
              <div className="calc-segmented" role="radiogroup" aria-labelledby="calc-sex-label">
                {["male", "female"].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="sex"
                      value={value}
                      checked={form.sex === value}
                      onChange={handleChange}
                    />
                    <span>{value === "male" ? "Male" : "Female"}</span>
                  </label>
                ))}
              </div>
              <span className="calc-hint">The formula has separate male and female versions.</span>
            </div>
          </fieldset>

          <fieldset className="calc-section">
            <legend>Activity level</legend>
            <div className="calc-options">
              {ACTIVITY_LEVELS.map((level) => (
                <label key={level.value} className="calc-option">
                  <input
                    type="radio"
                    name="activityLevel"
                    value={level.value}
                    checked={form.activityLevel === level.value}
                    onChange={handleChange}
                  />
                  <span className="calc-option-text">
                    <span className="calc-option-name">{level.label}</span>
                    <span className="calc-option-desc">{level.description}</span>
                  </span>
                  <span className="calc-option-meta num">×{level.factor}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="calc-section">
            <legend>Goal</legend>
            <div className="calc-options">
              {GOALS.map((g) => (
                <label key={g.value} className="calc-option">
                  <input
                    type="radio"
                    name="goal"
                    value={g.value}
                    checked={form.goal === g.value}
                    onChange={handleChange}
                  />
                  <span className="calc-option-text">
                    <span className="calc-option-name">{g.label}</span>
                    <span className="calc-option-desc">{g.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <section className="macro-results" aria-live="polite" aria-labelledby="results-heading">
          <h2 id="results-heading">Your daily plan</h2>

          {!plan ? (
            <p className="macro-results-empty">
              Fill in your height, weight, age, sex and activity level to see
              your daily calories and macros.
            </p>
          ) : (
            <>
              <p className="macro-target">
                <span className="num">{fmt(plan.calories)}</span> kcal a day
              </p>

              <div className="ledger macro-working">
                <div className="ledger-row">
                  <span>Resting energy <small>Mifflin-St Jeor</small></span>
                  <span className="num">{fmt(plan.resting)} kcal</span>
                </div>
                <div className="ledger-row">
                  <span>
                    Maintenance <small>{activity.label.toLowerCase()}, ×{plan.activityFactor}</small>
                  </span>
                  <span className="num">{fmt(plan.maintenance)} kcal</span>
                </div>
                <div className="ledger-row">
                  <span>{goal.label}</span>
                  <span className="num">
                    {plan.goalAdjustment === 0
                      ? "±0 kcal"
                      : `${plan.goalAdjustment > 0 ? "+" : "−"}${fmt(Math.abs(plan.goalAdjustment))} kcal`}
                  </span>
                </div>
                <div className="ledger-total">
                  <span>Daily target</span>
                  <span className="num">{fmt(plan.calories)} kcal</span>
                </div>
              </div>

              {plan.hitFloor && (
                <p className="macro-note">
                  Raised to {fmt(plan.floor)} kcal. Eating less than this without
                  medical supervision isn&rsquo;t recommended, so weight loss will
                  be slower than 0.5 kg a week.
                </p>
              )}

              <h3 className="macro-subheading">Macros</h3>
              <div className="calc-macro-bar" aria-hidden="true">
                {macros.map((m) => (
                  <span key={m.key} className={`calc-macro-${m.key}`} style={{ width: pct(m.share) }} />
                ))}
              </div>
              <table className="macro-table">
                <thead>
                  <tr>
                    <th scope="col">Macro</th>
                    <th scope="col">Per day</th>
                    <th scope="col">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {macros.map((m) => (
                    <tr key={m.key}>
                      <th scope="row">
                        <span className={`legend-swatch calc-macro-${m.key}`} />
                        {m.label}
                      </th>
                      <td className="num">
                        {m.grams} g
                        {m.key === "protein" && <small> · {m.perKg} g/kg</small>}
                      </td>
                      <td className="num">
                        {fmt(m.kcal)} <small>{pct(m.share)}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {plan.bmi != null && (
                <p className="macro-bmi">
                  BMI <strong className="num">{plan.bmi.toFixed(1)}</strong> · {bmiCategory(plan.bmi)}
                </p>
              )}
            </>
          )}

          <details className="macro-sources">
            <summary>How this is worked out</summary>
            <ul>
              <li>
                <strong>Resting energy</strong> uses the Mifflin-St Jeor equation
                (1990), the most accurate of the common equations in a 2005
                systematic review. It&rsquo;s usually within 10% of a measured
                value, but individuals vary.
              </li>
              <li>
                <strong>Maintenance</strong> multiplies resting energy by the
                standard activity factors (1.2 to 1.9).
              </li>
              <li>
                <strong>Weight loss</strong> uses the NHS and NICE guide of about
                600 kcal a day under maintenance, and never goes below
                1,200 kcal (women) or 1,500 kcal (men).
              </li>
              <li>
                <strong>Protein</strong> follows the International Society of
                Sports Nutrition range of 1.4–2.0 g per kg for active adults,
                higher when losing weight. <strong>Fat</strong> is set to about
                25% of calories and <strong>carbohydrate</strong> makes up the
                rest, all within the Institute of Medicine&rsquo;s recommended
                ranges.
              </li>
              <li>These are estimates for healthy adults, not medical advice.</li>
            </ul>
          </details>
        </section>
      </div>
    </div>
  );
};

export default MacroCalculator;
