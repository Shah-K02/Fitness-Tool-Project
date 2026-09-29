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

// Resting energy expenditure, Mifflin-St Jeor (1990):
//   10 × weight(kg) + 6.25 × height(cm) − 5 × age(y) + 5 (men) / −161 (women)
// The Frankenfield et al. 2005 systematic review found it the most accurate
// common prediction equation (within ±10% of measured for most adults).
// The equation only has male and female constants; "other" uses their
// midpoint as an approximation.
const SEX_CONSTANT = { male: 5, female: -161, other: -78 };

export const restingEnergy = ({ weight, height, age, sex }) =>
  10 * weight + 6.25 * height - 5 * age + SEX_CONSTANT[sex];

const roundTo10 = (n) => Math.round(n / 10) * 10;

// Maintenance calories from the profile: resting energy × activity factor.
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
  if (age == null || !activity || SEX_CONSTANT[gender] === undefined) return null;
  if (calculateBmi(h, w) == null) return null; // height/weight missing or out of range
  return roundTo10(restingEnergy({ weight: w, height: h, age, sex: gender }) * activity.factor);
};

// Goals and how each changes calories and protein. Sources:
// - lose: ~600 kcal/day deficit for 0.5–1 kg a week (NICE PH53 / NHS).
// - gain muscle: ~10% surplus, the low end of the 10–20% range for lean
//   gain (Iraki et al. 2019, Sports).
// - gain weight: ~500 kcal/day surplus, roughly 0.5 kg a week.
// - protein: 1.4–2.0 g/kg for exercising adults (ISSN position stand,
//   Jäger et al. 2017), more when in a deficit to keep muscle; gains from
//   extra protein plateau around 1.6 g/kg (Morton et al. 2018, BJSM).
//   Sedentary adults maintaining weight get 1.0 g/kg, above the 0.8 g/kg RDA.
export const GOALS = [
  {
    value: "lose",
    label: "Lose weight",
    description: "About 600 kcal under maintenance, for 0.5–1 kg a week",
    adjust: (maintenance) => maintenance - 600,
    proteinPerKg: () => 1.8,
  },
  {
    value: "maintain",
    label: "Maintain weight",
    description: "Eat what you burn",
    adjust: (maintenance) => maintenance,
    proteinPerKg: (activityLevel) => (activityLevel === "sedentary" ? 1.0 : 1.4),
  },
  {
    value: "gain_muscle",
    label: "Build muscle",
    description: "A small 10% surplus alongside strength training",
    adjust: (maintenance) => maintenance * 1.1,
    proteinPerKg: () => 1.6,
  },
  {
    value: "gain",
    label: "Gain weight",
    description: "About 500 kcal over maintenance, roughly 0.5 kg a week",
    adjust: (maintenance) => maintenance + 500,
    proteinPerKg: () => 1.4,
  },
];

// Lowest daily target the calculator will suggest. NHLBI low-calorie diets
// run 1,000–1,200 kcal (women) and 1,200–1,500 kcal (men); going lower
// needs medical supervision, so the calculator stops at the top of each
// range. "Other" uses the midpoint.
export const CALORIE_FLOOR = { male: 1500, female: 1200, other: 1350 };

// Acceptable Macronutrient Distribution Ranges (Institute of Medicine):
// protein 10–35%, fat 20–35%, carbohydrate 45–65% of calories.
export const AMDR = {
  protein: { min: 0.1, max: 0.35 },
  fats: { min: 0.2, max: 0.35 },
  carbs: { min: 0.45, max: 0.65 },
};
const DEFAULT_FAT_SHARE = 0.25;

export const calculateMacroPlan = ({ height, weight, age, sex, activityLevel, goal }) => {
  const activity = ACTIVITY_LEVELS.find((a) => a.value === activityLevel);
  const goalInfo = GOALS.find((g) => g.value === goal);
  if (!activity || !goalInfo || SEX_CONSTANT[sex] === undefined) return null;

  const resting = restingEnergy({ weight, height, age, sex });
  const maintenance = resting * activity.factor;
  const goalCalories = goalInfo.adjust(maintenance);
  const floor = CALORIE_FLOOR[sex];
  const hitFloor = goalCalories < floor;
  const calories = roundTo10(Math.max(goalCalories, floor));

  // Protein by body weight, kept within its AMDR (10–35% of calories).
  const proteinKcal = Math.min(
    Math.max(goalInfo.proteinPerKg(activityLevel) * weight * 4, calories * AMDR.protein.min),
    calories * AMDR.protein.max
  );
  // Fat at 25%, lowered towards 20% if carbohydrate would fall under 45%.
  let fatKcal = calories * DEFAULT_FAT_SHARE;
  const minCarbKcal = calories * AMDR.carbs.min;
  if (calories - proteinKcal - fatKcal < minCarbKcal) {
    fatKcal = Math.max(calories * AMDR.fats.min, calories - proteinKcal - minCarbKcal);
  }
  const carbKcal = calories - proteinKcal - fatKcal;

  const macro = (kcal, perGram) => ({
    grams: Math.round(kcal / perGram),
    kcal: Math.round(kcal),
    share: kcal / calories,
  });

  return {
    bmi: calculateBmi(height, weight),
    resting: Math.round(resting),
    activityFactor: activity.factor,
    maintenance: roundTo10(maintenance),
    goalAdjustment: roundTo10(goalCalories - maintenance),
    calories,
    hitFloor,
    floor,
    protein: { ...macro(proteinKcal, 4), perKg: Math.round((proteinKcal / 4 / weight) * 10) / 10 },
    carbs: macro(carbKcal, 4),
    fats: macro(fatKcal, 9),
  };
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
