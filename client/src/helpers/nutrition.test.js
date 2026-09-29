import {
  AMDR,
  bmiCategory,
  calculateBmi,
  calculateMacroPlan,
  restingEnergy,
} from "./nutrition";

// Expected values below are worked by hand from the published formulas,
// not taken from the implementation.

describe("restingEnergy (Mifflin-St Jeor)", () => {
  test("man, 30 y, 80 kg, 180 cm", () => {
    // 10×80 + 6.25×180 − 5×30 + 5 = 800 + 1125 − 150 + 5
    expect(restingEnergy({ weight: 80, height: 180, age: 30, sex: "male" })).toBe(1780);
  });

  test("woman, 25 y, 60 kg, 165 cm", () => {
    // 10×60 + 6.25×165 − 5×25 − 161 = 600 + 1031.25 − 125 − 161
    expect(restingEnergy({ weight: 60, height: 165, age: 25, sex: "female" })).toBe(1345.25);
  });

  test("men and women differ by exactly 166 kcal for the same body", () => {
    const body = { weight: 70, height: 170, age: 40 };
    expect(
      restingEnergy({ ...body, sex: "male" }) - restingEnergy({ ...body, sex: "female" })
    ).toBe(166);
  });
});

describe("BMI (WHO bands)", () => {
  test("70 kg at 175 cm is 22.9, healthy weight", () => {
    // 70 / 1.75² = 22.857
    expect(calculateBmi(175, 70)).toBe(22.9);
    expect(bmiCategory(22.9)).toBe("Healthy weight");
  });

  test("band edges", () => {
    expect(bmiCategory(18.4)).toBe("Underweight");
    expect(bmiCategory(18.5)).toBe("Healthy weight");
    expect(bmiCategory(25)).toBe("Overweight");
    expect(bmiCategory(30)).toBe("Obese");
  });
});

describe("calculateMacroPlan", () => {
  test("moderately active man maintaining weight", () => {
    const plan = calculateMacroPlan({
      height: 180, weight: 80, age: 30, sex: "male",
      activityLevel: "moderately_active", goal: "maintain",
    });
    // Maintenance: 1780 × 1.55 = 2759 → 2760 kcal
    expect(plan.resting).toBe(1780);
    expect(plan.maintenance).toBe(2760);
    expect(plan.calories).toBe(2760);
    // Protein 1.4 g/kg × 80 = 112 g (448 kcal)
    expect(plan.protein.grams).toBe(112);
    // Fat 25% of 2760 = 690 kcal → 76.7 g
    expect(plan.fats.grams).toBe(77);
    // Carbs = 2760 − 448 − 690 = 1622 kcal → 405.5 g
    expect(plan.carbs.kcal).toBe(1622);
    expect(plan.hitFloor).toBe(false);
  });

  test("losing weight takes 600 kcal off maintenance and raises protein", () => {
    const plan = calculateMacroPlan({
      height: 180, weight: 80, age: 30, sex: "male",
      activityLevel: "moderately_active", goal: "lose",
    });
    // 2759 − 600 = 2159 → 2160 kcal
    expect(plan.calories).toBe(2160);
    expect(plan.goalAdjustment).toBe(-600);
    // 1.8 g/kg × 80 = 144 g
    expect(plan.protein.grams).toBe(144);
    expect(plan.protein.perKg).toBe(1.8);
  });

  test("building muscle adds 10% and uses 1.6 g/kg protein", () => {
    const plan = calculateMacroPlan({
      height: 180, weight: 80, age: 30, sex: "male",
      activityLevel: "very_active", goal: "gain_muscle",
    });
    // 1780 × 1.725 = 3070.5; × 1.1 = 3377.55 → 3380 kcal
    expect(plan.calories).toBe(3380);
    // 1.6 × 80 = 128 g
    expect(plan.protein.grams).toBe(128);
  });

  test("never goes below the safe floor, and says so", () => {
    const plan = calculateMacroPlan({
      height: 165, weight: 60, age: 25, sex: "female",
      activityLevel: "sedentary", goal: "lose",
    });
    // 1345.25 × 1.2 = 1614.3; − 600 = 1014.3, under the 1,200 kcal floor
    expect(plan.hitFloor).toBe(true);
    expect(plan.calories).toBe(1200);
    // 1.8 g/kg × 60 = 108 g = 432 kcal = 36%, capped at 35% → 420 kcal = 105 g
    expect(plan.protein.grams).toBe(105);
    // Fat drops from 25% to 20% so carbs reach 45%: 240 kcal fat, 540 kcal carbs
    expect(plan.fats.kcal).toBe(240);
    expect(plan.carbs.kcal).toBe(540);
  });

  test("sedentary adult maintaining weight gets 1.0 g/kg protein", () => {
    const plan = calculateMacroPlan({
      height: 165, weight: 60, age: 25, sex: "female",
      activityLevel: "sedentary", goal: "maintain",
    });
    expect(plan.protein.perKg).toBe(1);
  });

  // Every combination of sex, activity and goal across a spread of bodies
  // must add up and stay inside the Institute of Medicine ranges.
  test("every plan adds up and stays within the AMDR", () => {
    const bodies = [
      { height: 150, weight: 45, age: 19 },
      { height: 165, weight: 60, age: 25 },
      { height: 180, weight: 80, age: 30 },
      { height: 190, weight: 120, age: 55 },
      { height: 160, weight: 95, age: 70 },
    ];
    const activities = ["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"];
    const goals = ["lose", "maintain", "gain_muscle", "gain"];
    const tolerance = 0.005; // rounding to whole kcal
    for (const body of bodies)
      for (const sex of ["male", "female"])
        for (const activityLevel of activities)
          for (const goal of goals) {
            const p = calculateMacroPlan({ ...body, sex, activityLevel, goal });
            expect(p.protein.kcal + p.carbs.kcal + p.fats.kcal).toBeGreaterThanOrEqual(p.calories - 2);
            expect(p.protein.kcal + p.carbs.kcal + p.fats.kcal).toBeLessThanOrEqual(p.calories + 2);
            expect(p.protein.share).toBeLessThanOrEqual(AMDR.protein.max + tolerance);
            expect(p.protein.share).toBeGreaterThanOrEqual(AMDR.protein.min - tolerance);
            expect(p.fats.share).toBeGreaterThanOrEqual(AMDR.fats.min - tolerance);
            expect(p.fats.share).toBeLessThanOrEqual(AMDR.fats.max + tolerance);
            expect(p.carbs.share).toBeGreaterThanOrEqual(AMDR.carbs.min - tolerance);
            expect(p.carbs.share).toBeLessThanOrEqual(AMDR.carbs.max + tolerance);
            expect(p.calories).toBeGreaterThanOrEqual(sex === "male" ? 1500 : 1200);
          }
  });
});
