import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./UserInfoPage.css";
import BackButton from "./BackButton";
import ErrorMessage from "./ErrorMessage";
import useAxios from "../helpers/useAxios";
import { useUser } from "../helpers/UserContext";
import {
  ACTIVITY_LEVELS,
  BMI_BANDS,
  HEIGHT_RANGE,
  WEIGHT_RANGE,
  ageFromBirthday,
  bmiCategory,
  calculateBmi,
  estimateDailyCalories,
  localDateKey,
} from "../helpers/nutrition";

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// The BMI scale drawn under the reading runs from 15 to 40.
const BMI_SCALE = { min: 15, max: 40 };
const bmiPosition = (value) =>
  ((Math.min(Math.max(value, BMI_SCALE.min), BMI_SCALE.max) - BMI_SCALE.min) /
    (BMI_SCALE.max - BMI_SCALE.min)) *
  100;

const trimNumber = (value) =>
  value === null || value === undefined || value === ""
    ? ""
    : String(Number(value));

const rangeError = (value, { min, max }, unit) => {
  if (value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) {
    return `Enter a value between ${min} and ${max} ${unit}.`;
  }
  return null;
};

function MeasurementField({ id, label, unit, value, onChange, range, hint, error, step }) {
  const hintId = `${id}-hint`;
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <span className={`input-with-unit${error ? " has-error" : ""}`}>
        <input
          id={id}
          name={id}
          type="number"
          inputMode="decimal"
          min={range.min}
          max={range.max}
          step={step}
          value={value}
          onChange={onChange}
          aria-describedby={hintId}
          aria-invalid={Boolean(error)}
        />
        <span className="unit" aria-hidden="true">
          {unit}
        </span>
      </span>
      <span id={hintId} className={`field-hint${error ? " is-flag" : ""}`}>
        {error || `In ${unit === "cm" ? "centimetres" : "kilograms"}, e.g. ${hint}`}
      </span>
    </div>
  );
}

const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    birthday: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | "saved" | "error"
  const [saveError, setSaveError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [errorTimestamp, setErrorTimestamp] = useState(null);
  const axios = useAxios();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/user/info");
        const data = response.data;
        setUserInfo({
          name: data.name === "Unknown" ? "" : data.name || "",
          email: data.email || "",
          birthday: data.birthday ? data.birthday.split("T")[0] : "",
          gender: data.gender || "",
          height: trimNumber(data.height),
          weight: trimNumber(data.weight),
          activityLevel: data.activityLevel || "",
        });
      } catch (err) {
        setError(err.response ? err.response.data.message : "Network error");
        setErrorTimestamp(Date.now());
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [axios, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaveStatus(null);
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const age = ageFromBirthday(userInfo.birthday);
  const bmi = calculateBmi(userInfo.height, userInfo.weight);
  const category = bmiCategory(bmi);
  const dailyCalories = estimateDailyCalories(userInfo);

  const errors = {
    height: rangeError(userInfo.height, HEIGHT_RANGE, "cm"),
    weight: rangeError(userInfo.weight, WEIGHT_RANGE, "kg"),
    email: userInfo.email.includes("@") ? null : "Enter a valid email address.",
    gender: userInfo.gender ? null : "Choose one to continue.",
    activityLevel: userInfo.activityLevel ? null : "Choose the closest match.",
  };
  // Required-choice messages only appear after a save attempt.
  const visibleErrors = {
    ...errors,
    gender: submitted ? errors.gender : null,
    activityLevel: submitted ? errors.activityLevel : null,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setSaveStatus(null);
    if (Object.values(errors).some(Boolean)) return;

    setIsSaving(true);
    try {
      await axios.post("/api/user/update", {
        ...userInfo,
        // Empty optional fields are stored as NULL rather than "".
        birthday: userInfo.birthday || null,
        height: userInfo.height === "" ? null : Number(userInfo.height),
        weight: userInfo.weight === "" ? null : Number(userInfo.weight),
        bmi,
      });
      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err.response?.data?.message || null);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="user-info-page">
        <h1 className="user-info-title">Profile</h1>
        <p className="state-message">
          <Link to="/login" state={{ activeForm: "login" }}>
            Sign in
          </Link>{" "}
          to view and edit your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="user-info-page">
      <BackButton className="back-button" backText=" Back" />
      <ErrorMessage message={error} timestamp={errorTimestamp} />

      <header className="user-info-header">
        <h1 className="user-info-title">Profile</h1>
        <p className="user-info-intro">
          Your measurements work out your BMI and the daily calorie target on
          your food log.
        </p>
      </header>

      {isLoading ? (
        <p className="state-message">Loading your profile&hellip;</p>
      ) : (
        <form className="user-info-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="profile-section">
            <legend>About you</legend>
            <div className="field-grid">
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={userInfo.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  aria-invalid={submitted && Boolean(errors.email)}
                  aria-describedby="email-hint"
                />
                {submitted && errors.email && (
                  <span id="email-hint" className="field-hint is-flag">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="birthday">Date of birth</label>
                <input
                  id="birthday"
                  type="date"
                  name="birthday"
                  autoComplete="bday"
                  max={localDateKey(new Date())}
                  value={userInfo.birthday}
                  onChange={handleChange}
                  aria-describedby="birthday-hint"
                />
                <span id="birthday-hint" className="field-hint">
                  {age != null ? (
                    <>
                      Age <strong className="num">{age}</strong>
                    </>
                  ) : (
                    "Used to work out your age"
                  )}
                </span>
              </div>
              <div className="form-field">
                <span className="form-field-label" id="sex-label">
                  Sex
                </span>
                <div
                  className={`segmented${visibleErrors.gender ? " has-error" : ""}`}
                  role="radiogroup"
                  aria-labelledby="sex-label"
                  aria-describedby="sex-hint"
                >
                  {SEX_OPTIONS.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={userInfo.gender === option.value}
                        onChange={handleChange}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <span
                  id="sex-hint"
                  className={`field-hint${visibleErrors.gender ? " is-flag" : ""}`}
                >
                  {visibleErrors.gender ||
                    "Used in the calorie formula. Other uses the average of both."}
                </span>
              </div>
            </div>
          </fieldset>

          <fieldset className="profile-section">
            <legend>Body measurements</legend>
            <div className="field-grid">
              <MeasurementField
                id="height"
                label="Height"
                unit="cm"
                hint="175"
                step="0.1"
                range={HEIGHT_RANGE}
                value={userInfo.height}
                onChange={handleChange}
                error={errors.height}
              />
              <MeasurementField
                id="weight"
                label="Weight"
                unit="kg"
                hint="70.5"
                step="0.1"
                range={WEIGHT_RANGE}
                value={userInfo.weight}
                onChange={handleChange}
                error={errors.weight}
              />
            </div>

            <div className="bmi-readout" aria-live="polite">
              <div className="bmi-reading">
                <span className="bmi-label">Body mass index</span>
                {bmi != null ? (
                  <>
                    <span className="bmi-value num">{bmi.toFixed(1)}</span>
                    <span className="bmi-category">{category}</span>
                  </>
                ) : (
                  <span className="bmi-placeholder">
                    Enter your height and weight to calculate it.
                  </span>
                )}
              </div>
              <div className="bmi-scale" aria-hidden="true">
                <div className="bmi-track">
                  {BMI_BANDS.slice(0, -1).map((band) => (
                    <span
                      key={band.max}
                      className="bmi-tick"
                      style={{ left: `${bmiPosition(band.max)}%` }}
                    />
                  ))}
                  {bmi != null && (
                    <span
                      className="bmi-marker"
                      style={{ left: `${bmiPosition(bmi)}%` }}
                    />
                  )}
                </div>
                <div className="bmi-band-labels">
                  {BMI_BANDS.map((band, i) => {
                    const from = i === 0 ? BMI_SCALE.min : BMI_BANDS[i - 1].max;
                    const to = Math.min(band.max, BMI_SCALE.max);
                    return (
                      <span
                        key={band.label}
                        style={{ width: `${bmiPosition(to) - bmiPosition(from)}%` }}
                      >
                        {band.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="profile-section">
            <legend>Activity level</legend>
            <p className="section-hint">
              Pick the one closest to a typical week.
            </p>
            <div
              className={`activity-options${
                visibleErrors.activityLevel ? " has-error" : ""
              }`}
            >
              {ACTIVITY_LEVELS.map((level) => (
                <label key={level.value} className="activity-option">
                  <input
                    type="radio"
                    name="activityLevel"
                    value={level.value}
                    checked={userInfo.activityLevel === level.value}
                    onChange={handleChange}
                  />
                  <span className="activity-text">
                    <span className="activity-name">{level.label}</span>
                    <span className="activity-desc">{level.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {visibleErrors.activityLevel && (
              <p className="field-hint is-flag">{visibleErrors.activityLevel}</p>
            )}
          </fieldset>

          <section className="calorie-estimate" aria-live="polite">
            <span className="calorie-estimate-label">Estimated daily calories</span>
            {dailyCalories != null ? (
              <>
                <span className="calorie-estimate-value num">
                  {dailyCalories.toLocaleString()} <span>kcal</span>
                </span>
                <span className="calorie-estimate-note">
                  This is the daily target on your{" "}
                  <Link to="/log-food">food log</Link>.
                </span>
              </>
            ) : (
              <span className="calorie-estimate-note">
                Fill in your date of birth, sex, height, weight and activity
                level to see this.
              </span>
            )}
          </section>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
            <p className="save-status" role="status">
              {saveStatus === "saved" && (
                <span className="is-logged">
                  <FontAwesomeIcon icon={faCheck} /> Changes saved
                </span>
              )}
              {saveStatus === "error" && (
                <span className="is-flag">
                  {saveError || "Couldn’t save your changes. Try again."}
                </span>
              )}
              {submitted && saveStatus == null && Object.values(errors).some(Boolean) && (
                <span className="is-flag">Fix the highlighted fields to save.</span>
              )}
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserInfoPage;
