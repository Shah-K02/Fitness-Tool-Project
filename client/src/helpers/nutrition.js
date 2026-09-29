// Shared body-metric and nutrition maths for the profile and food log pages.

export const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little or no exercise, mostly sitting",
    factor: 1.2,
  },
  {
    value: "lightly_active",
    label: "Lightly active",
    description: "Light exercise or sport 1–3 days a week",
    factor: 1.375,
  },
  {
    value: "moderately_active",
    label: "Moderately active",
    description: "Moderate exercise or sport 3–5 days a week",
    factor: 1.55,
  },
  {
    value: "very_active",
    label: "Very active",
    description: "Hard exercise or sport 6–7 days a week",
    factor: 1.725,
  },
  {
    value: "extra_active",
    label: "Extra active",
    description: "Very hard training twice a day or a physical job",
    factor: 1.9,
  },
];

export const HEIGHT_RANGE = { min: 100, max: 250 }; // cm
export const WEIGHT_RANGE = { min: 30, max: 300 }; // kg

const toNumber = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
};

export const ageFromBirthday = (birthday) => {
  if (!birthday) return null;
  const born = new Date(`${String(birthday).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(born.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const hadBirthday =
    today.getMonth() > born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());
  if (!hadBirthday) age -= 1;
  return age >= 0 && age < 130 ? age : null;
};

export const calculateBmi = (heightCm, weightKg) => {
  const h = toNumber(heightCm);
  const w = toNumber(weightKg);
  const inRange = (n, { min, max }) => n != null && n >= min && n <= max;
  if (!inRange(h, HEIGHT_RANGE) || !inRange(w, WEIGHT_RANGE)) return null;
  const metres = h / 100;
  return Math.round((w / (metres * metres)) * 10) / 10;
};

// Standard adult BMI bands (WHO).
export const BMI_BANDS = [
  { max: 18.5, label: "Underweight" },
  { max: 25, label: "Healthy weight" },
  { max: 30, label: "Overweight" },
  { max: Infinity, label: "Obese" },
];

export const bmiCategory = (bmi) =>
  bmi == null ? null : BMI_BANDS.find((band) => bmi < band.max).label;

// Mifflin-St Jeor resting energy, multiplied by the activity factor.
// "Other" uses the midpoint of the male and female constants.
export const estimateDailyCalories = ({
  birthday,
  gender,
  height,
  weight,
  activityLevel,
}) => {
  const age = ageFromBirthday(birthday);
  const h = toNumber(height);
  const w = toNumber(weight);
  const activity = ACTIVITY_LEVELS.find((a) => a.value === activityLevel);
  if (age == null || !activity || !gender) return null;
  if (calculateBmi(h, w) == null) return null; // height/weight missing or out of range
  const genderConstant = { male: 5, female: -161, other: -78 }[gender];
  if (genderConstant === undefined) return null;
  const resting = 10 * w + 6.25 * h - 5 * age + genderConstant;
  return Math.round((resting * activity.factor) / 10) * 10;
};

// Dates are handled in the user's local time zone throughout; toISOString()
// would shift late-evening entries onto the next day.
const pad = (n) => String(n).padStart(2, "0");

export const localDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const toMySqlDateTime = (date) =>
  `${localDateKey(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

// USDA search results report nutrients per 100 g.
export const nutrientsPer100g = (food) => {
  const find = (name, unit) =>
    food.foodNutrients?.find(
      (n) => n.nutrientName === name && (!unit || n.unitName === unit)
    )?.value ?? 0;
  return {
    calories: find("Energy", "KCAL"),
    protein: find("Protein"),
    carbs: find("Carbohydrate, by difference"),
    fats: find("Total lipid (fat)"),
  };
};

export const scaleNutrients = (per100g, grams) => {
  const factor = grams / 100;
  const round1 = (n) => Math.round(n * factor * 10) / 10;
  return {
    calories: Math.round(per100g.calories * factor),
    protein: round1(per100g.protein),
    carbs: round1(per100g.carbs),
    fats: round1(per100g.fats),
  };
};

// A sensible default amount: the branded serving size when it's in grams,
// otherwise 100 g.
export const defaultPortionGrams = (food) =>
  food.servingSize && /^(g|grm)$/i.test(food.servingSizeUnit || "")
    ? Math.round(food.servingSize)
    : 100;
