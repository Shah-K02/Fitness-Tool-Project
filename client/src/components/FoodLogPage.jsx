import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./FoodLogPage.css";
import BackButton from "./BackButton";
import LogEntry from "./LogEntry";
import AddFoodPanel from "./AddFoodPanel";
import { estimateDailyCalories, localDateKey } from "../helpers/nutrition";

// Entries are grouped by the hour they were eaten. Each meal owns a span of
// hours; the exact time of every entry is still shown and chosen when adding.
export const MEALS = [
  { key: "breakfast", label: "Breakfast", range: "Until 11 AM", start: 0, end: 11, defaultTime: "08:00" },
  { key: "lunch", label: "Lunch", range: "11 AM – 3 PM", start: 11, end: 15, defaultTime: "12:30" },
  { key: "snacks", label: "Snacks", range: "3 PM – 6 PM", start: 15, end: 18, defaultTime: "16:00" },
  { key: "dinner", label: "Dinner", range: "After 6 PM", start: 18, end: 24, defaultTime: "19:00" },
];

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const startOfWeek = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const mondayOffset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const sameDay = (a, b) => localDateKey(a) === localDateKey(b);

const formatKcal = (n) => Math.round(n).toLocaleString();

const sumEntries = (entries) =>
  entries.reduce(
    (totals, e) => ({
      calories: totals.calories + Number(e.calories || 0),
      protein: totals.protein + Number(e.protein || 0),
      carbs: totals.carbs + Number(e.carbs || 0),
      fats: totals.fats + Number(e.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

function DayBalance({ totals, target, isLoading }) {
  const remaining = target != null ? target - totals.calories : null;
  const isOver = remaining != null && remaining < 0;
  const eatenShare = target ? Math.min(totals.calories / target, 1) : 0;

  // Share of calories from each macro (4 kcal/g protein and carbs, 9 kcal/g fat).
  const macroKcal = {
    protein: totals.protein * 4,
    carbs: totals.carbs * 4,
    fats: totals.fats * 9,
  };
  const macroTotal = macroKcal.protein + macroKcal.carbs + macroKcal.fats;
  const macros = [
    { key: "protein", label: "Protein", grams: totals.protein },
    { key: "carbs", label: "Carbs", grams: totals.carbs },
    { key: "fats", label: "Fat", grams: totals.fats },
  ];

  return (
    <section
      className={`day-balance${isLoading ? " is-loading" : ""}`}
      aria-label="Day totals"
      aria-busy={isLoading}
    >
      <dl className="balance-figures">
        <div>
          <dt>Eaten</dt>
          <dd className="num">
            {formatKcal(totals.calories)} <span className="unit">kcal</span>
          </dd>
        </div>
        <div>
          <dt>Daily target</dt>
          <dd className="num">
            {target != null ? (
              <>
                {formatKcal(target)} <span className="unit">kcal</span>
              </>
            ) : (
              <Link to="/profile" className="balance-setup">
                Set up in profile
              </Link>
            )}
          </dd>
        </div>
        <div>
          <dt>{isOver ? "Over target" : "Remaining"}</dt>
          <dd className={`num ${isOver ? "is-flag" : "is-logged"}`}>
            {remaining != null ? (
              <>
                {formatKcal(Math.abs(remaining))} <span className="unit">kcal</span>
              </>
            ) : (
              <span className="balance-empty">&mdash;</span>
            )}
          </dd>
        </div>
      </dl>

      {target != null && (
        <div
          className={`calorie-meter${isOver ? " is-over" : ""}`}
          role="progressbar"
          aria-label="Calories eaten against daily target"
          aria-valuemin={0}
          aria-valuemax={target}
          aria-valuenow={Math.round(totals.calories)}
        >
          <span style={{ transform: `scaleX(${eatenShare})` }} />
        </div>
      )}

      <div className="macro-split">
        <div className="macro-bar" aria-hidden="true">
          {macroTotal > 0 &&
            macros.map((m) => (
              <span
                key={m.key}
                className={`macro-bar-${m.key}`}
                style={{ width: `${(macroKcal[m.key] / macroTotal) * 100}%` }}
              />
            ))}
        </div>
        <ul className="macro-legend">
          {macros.map((m) => (
            <li key={m.key}>
              <span className={`legend-swatch macro-swatch-${m.key}`} />
              {m.label}
              <strong className="num">{Math.round(m.grams)} g</strong>
              {macroTotal > 0 && (
                <span className="macro-share num">
                  {Math.round((macroKcal[m.key] / macroTotal) * 100)}%
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FoodLogPage() {
  const [currentDay, setCurrentDay] = useState(() => new Date());
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMeal, setOpenMeal] = useState(null);
  const isSignedIn = Boolean(localStorage.getItem("token"));

  const today = new Date();
  const weekStart = startOfWeek(currentDay);
  const week = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dateKey = localDateKey(currentDay);

  const fetchEntries = useCallback(async () => {
    const response = await axios.get(`/api/logs/${dateKey}`, {
      headers: authHeaders(),
    });
    setEntries(response.data);
  }, [dateKey]);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchEntries()
      .catch((err) => {
        if (cancelled) return;
        setError(
          err.response?.status === 401
            ? "Your session has expired. Sign in again to see your log."
            : "Couldn't load this day's log. Check your connection and try again."
        );
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [fetchEntries, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) return;
    axios
      .get("/api/user/info", { headers: authHeaders() })
      .then((response) => setProfile(response.data))
      .catch(() => setProfile(null));
  }, [isSignedIn]);

  const target = useMemo(
    () => (profile ? estimateDailyCalories(profile) : null),
    [profile]
  );

  const entriesByMeal = useMemo(() => {
    const grouped = Object.fromEntries(MEALS.map((m) => [m.key, []]));
    entries.forEach((entry) => {
      const hour = new Date(entry.log_time).getHours();
      const meal = MEALS.find((m) => hour >= m.start && hour < m.end);
      grouped[meal.key].push(entry);
    });
    return grouped;
  }, [entries]);

  const totals = useMemo(() => sumEntries(entries), [entries]);

  const changeDay = (date) => {
    setOpenMeal(null);
    setCurrentDay(date);
  };

  const removeEntry = async (entry) => {
    const previous = entries;
    setEntries((current) => current.filter((e) => e.id !== entry.id));
    try {
      await axios.delete(`/api/log/food/${entry.id}`, { headers: authHeaders() });
    } catch (err) {
      setEntries(previous);
      setError("Couldn't remove that entry. Try again.");
    }
  };

  if (!isSignedIn) {
    return (
      <div className="food-log-page">
        <h1 className="food-log-title">Food log</h1>
        <p className="state-message">
          <Link to="/login" state={{ activeForm: "login" }}>
            Sign in
          </Link>{" "}
          to start logging what you eat.
        </p>
      </div>
    );
  }

  const isToday = sameDay(currentDay, today);

  return (
    <div className="food-log-page">
      <BackButton className="back-button" backText=" Back" />

      <header className="food-log-header">
        <div>
          <h1 className="food-log-title">Food log</h1>
          <p className="food-log-date">
            {currentDay.toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {!isToday && (
          <button
            type="button"
            className="btn btn-secondary today-button"
            onClick={() => changeDay(new Date())}
          >
            Back to today
          </button>
        )}
      </header>

      {/* Not a <nav>: index.css styles every nav element as the site masthead. */}
      <div className="week-strip" role="group" aria-label="Choose a day">
        <button
          type="button"
          className="week-step"
          onClick={() => changeDay(addDays(currentDay, -7))}
          aria-label="Previous week"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <ol className="week-days">
          {week.map((date) => {
            const selected = sameDay(date, currentDay);
            return (
              <li key={localDateKey(date)}>
                <button
                  type="button"
                  className={`week-day${selected ? " is-active" : ""}${
                    sameDay(date, today) ? " is-today" : ""
                  }`}
                  onClick={() => changeDay(date)}
                  aria-current={selected ? "date" : undefined}
                  aria-label={date.toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                >
                  <span className="week-day-name">
                    {date.toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                  <span className="week-day-num num">{date.getDate()}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          className="week-step"
          onClick={() => changeDay(addDays(currentDay, 7))}
          aria-label="Next week"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {error && (
        <p className="state-message is-flag" role="alert">
          {error}
        </p>
      )}

      <DayBalance totals={totals} target={target} isLoading={isLoading} />

      <div className="meals">
        {MEALS.map((meal) => {
          const mealEntries = entriesByMeal[meal.key];
          const mealKcal = sumEntries(mealEntries).calories;
          const isOpen = openMeal === meal.key;
          return (
            <section
              key={meal.key}
              className="meal"
              aria-labelledby={`meal-${meal.key}`}
            >
              <header className="meal-head">
                <h2 id={`meal-${meal.key}`}>{meal.label}</h2>
                <span className="meal-range">{meal.range}</span>
                <span className="meal-kcal num">
                  {mealEntries.length > 0 ? `${formatKcal(mealKcal)} kcal` : ""}
                </span>
                <button
                  type="button"
                  className={`meal-add${isOpen ? " is-open" : ""}`}
                  onClick={() => setOpenMeal(isOpen ? null : meal.key)}
                  aria-expanded={isOpen}
                  aria-controls={`add-${meal.key}`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add food
                </button>
              </header>

              <div className="meal-entries">
                {isLoading ? (
                  <div className="entry-skeleton" aria-hidden="true">
                    <span />
                    <span />
                  </div>
                ) : mealEntries.length > 0 ? (
                  mealEntries.map((entry) => (
                    <LogEntry key={entry.id} entry={entry} onRemove={removeEntry} />
                  ))
                ) : (
                  !isOpen && <p className="meal-empty">Nothing logged</p>
                )}
              </div>

              {isOpen && (
                <AddFoodPanel
                  id={`add-${meal.key}`}
                  meal={meal}
                  day={currentDay}
                  onAdded={fetchEntries}
                  onClose={() => setOpenMeal(null)}
                />
              )}
            </section>
          );
        })}
      </div>

      <p className="food-log-footnote">
        {target != null
          ? "Your daily target is estimated from the height, weight, age, sex and activity level in your profile."
          : "Add your height, weight, birthday, sex and activity level to your profile to see a daily calorie target."}
      </p>
    </div>
  );
}

export default FoodLogPage;
