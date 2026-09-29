import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./AddFoodPanel.css";
import {
  defaultPortionGrams,
  localDateKey,
  nutrientsPer100g,
  scaleNutrients,
  toMySqlDateTime,
} from "../helpers/nutrition";

const pad = (n) => String(n).padStart(2, "0");

// Branded USDA names arrive in capitals ("OATS"); show them in sentence case.
const displayName = (description = "") =>
  description === description.toUpperCase()
    ? description.charAt(0) + description.slice(1).toLowerCase()
    : description;

const brandOf = (food) => {
  const brand = food.brandName || food.brandOwner;
  return brand ? displayName(brand) : null;
};

const timeOptions = (meal) => {
  const options = [];
  for (let h = meal.start; h < meal.end; h++) {
    options.push(`${pad(h)}:00`, `${pad(h)}:30`);
  }
  return options;
};

// Today, inside this meal's hours: now (rounded down to the half hour).
// Otherwise the meal's usual time.
const defaultTime = (meal, day) => {
  const now = new Date();
  const isToday = localDateKey(now) === localDateKey(day);
  const hour = now.getHours();
  if (isToday && hour >= meal.start && hour < meal.end) {
    return `${pad(hour)}:${now.getMinutes() < 30 ? "00" : "30"}`;
  }
  return meal.defaultTime;
};

const formatTimeLabel = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

function FoodResult({ food, meal, day, isSelected, onSelect, onAdded }) {
  const per100 = nutrientsPer100g(food);
  const [grams, setGrams] = useState(() => defaultPortionGrams(food));
  const [time, setTime] = useState(() => defaultTime(meal, day));
  const [status, setStatus] = useState("idle"); // idle | saving | error
  const gramsValue = Number(grams);
  const validGrams = gramsValue > 0 && gramsValue <= 5000;
  const portion = scaleNutrients(per100, validGrams ? gramsValue : 0);
  const name = displayName(food.description);
  const brand = brandOf(food);

  const add = async (event) => {
    event.preventDefault();
    if (!validGrams) return;
    setStatus("saving");
    const [h, m] = time.split(":").map(Number);
    const loggedAt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);
    try {
      await axios.post(
        "/api/log/food",
        {
          food_id: String(food.fdcId),
          description: `${name} (${gramsValue} g)`,
          log_time: toMySqlDateTime(loggedAt),
          ...portion,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setStatus("idle");
      onAdded(`${name} added to ${meal.label.toLowerCase()}.`);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <li className={`food-result${isSelected ? " is-selected" : ""}`}>
      <button
        type="button"
        className="food-result-summary"
        onClick={onSelect}
        aria-expanded={isSelected}
      >
        <span className="food-result-name">
          {name}
          {brand && <span className="food-result-brand">{brand}</span>}
        </span>
        <span className="food-result-per100 num">
          {Math.round(per100.calories)} kcal
          <span className="food-result-basis">per 100 g</span>
        </span>
      </button>

      {isSelected && (
        <form className="food-result-form" onSubmit={add}>
          <div className="portion-fields">
            <label className="portion-field">
              <span>Amount</span>
              <span className="portion-input">
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="5000"
                  step="any"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  aria-describedby={`portion-${food.fdcId}`}
                  required
                />
                <span className="unit" aria-hidden="true">g</span>
              </span>
            </label>
            <label className="portion-field">
              <span>Time</span>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {timeOptions(meal).map((t) => (
                  <option key={t} value={t}>
                    {formatTimeLabel(t)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="portion-preview num" id={`portion-${food.fdcId}`}>
            <strong>{portion.calories} kcal</strong>
            <span>Protein {portion.protein} g</span>
            <span>Carbs {portion.carbs} g</span>
            <span>Fat {portion.fats} g</span>
          </p>

          <div className="food-result-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!validGrams || status === "saving"}
            >
              {status === "saving" ? "Adding…" : `Add to ${meal.label.toLowerCase()}`}
            </button>
            <Link to={`/food/${food.fdcId}`} className="food-result-details">
              Full nutrition details
            </Link>
          </div>
          {status === "error" && (
            <p className="food-result-error" role="alert">
              Couldn&rsquo;t add this food. Try again.
            </p>
          )}
        </form>
      )}
    </li>
  );
}

function AddFoodPanel({ id, meal, day, onAdded, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const search = async (event) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setIsSearching(true);
    setError(null);
    setSelectedId(null);
    try {
      const response = await axios.post("/api/food/search", { query: term });
      const foods = response.data.foods || [];
      setResults(foods);
      if (foods.length === 1) setSelectedId(foods[0].fdcId);
    } catch (err) {
      setResults(null);
      setError(
        err.response?.data?.message || "Couldn't search foods. Try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdded = async (message) => {
    setSelectedId(null);
    setConfirmation(message);
    await onAdded();
  };

  return (
    <div className="add-food" id={id}>
      <form className="add-food-search" onSubmit={search} role="search">
        <label htmlFor={`${id}-query`} className="visually-hidden">
          Search foods to add to {meal.label.toLowerCase()}
        </label>
        <span className="add-food-input">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="add-food-icon" />
          <input
            ref={inputRef}
            id={`${id}-query`}
            type="search"
            placeholder="Search foods, e.g. oats, banana, chicken breast"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </span>
        <button type="submit" className="btn btn-primary" disabled={isSearching}>
          {isSearching ? "Searching…" : "Search"}
        </button>
      </form>

      <p className="add-food-status" role="status">
        {confirmation && (
          <>
            <FontAwesomeIcon icon={faCheck} /> {confirmation}
          </>
        )}
      </p>

      {error && (
        <p className="state-message is-flag" role="alert">
          {error}
        </p>
      )}

      {isSearching && (
        <ul className="food-results is-loading" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="food-result-skeleton" />
          ))}
        </ul>
      )}

      {!isSearching && results && results.length === 0 && (
        <p className="state-message">
          No foods match &ldquo;{query.trim()}&rdquo;. Try a simpler name, like
          &ldquo;apple&rdquo; instead of &ldquo;green apple slices&rdquo;.
        </p>
      )}

      {!isSearching && results && results.length > 0 && (
        <ul className="food-results">
          {results.map((food) => (
            <FoodResult
              key={food.fdcId}
              food={food}
              meal={meal}
              day={day}
              isSelected={selectedId === food.fdcId}
              onSelect={() =>
                setSelectedId(selectedId === food.fdcId ? null : food.fdcId)
              }
              onAdded={handleAdded}
            />
          ))}
        </ul>
      )}

      <div className="add-food-footer">
        <button type="button" className="add-food-done" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

export default AddFoodPanel;
