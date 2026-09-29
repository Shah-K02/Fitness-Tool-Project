import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserInfoPage from "./UserInfoPage";
import { UserProvider } from "../helpers/UserContext";

// The page talks to the API through useAxios; give it a stable mock client.
const mockApi = { get: jest.fn(), post: jest.fn() };
jest.mock("../helpers/useAxios", () => () => mockApi);

const savedProfile = {
  name: "John Doe",
  email: "john@example.com",
  birthday: "1990-01-01",
  gender: "male",
  height: "180.00",
  weight: "80.00",
  bmi: "24.70",
  activityLevel: "moderately_active",
};

const renderSignedIn = () => {
  localStorage.setItem("user", JSON.stringify({ id: 1, email: "john@example.com" }));
  localStorage.setItem("token", "test-token");
  return render(
    <MemoryRouter>
      <UserProvider>
        <UserInfoPage />
      </UserProvider>
    </MemoryRouter>
  );
};

beforeEach(() => {
  localStorage.clear();
  mockApi.get.mockReset().mockResolvedValue({ data: savedProfile });
  mockApi.post.mockReset().mockResolvedValue({ data: "Profile updated successfully" });
});

test("asks signed-out visitors to sign in", () => {
  render(
    <MemoryRouter>
      <UserProvider>
        <UserInfoPage />
      </UserProvider>
    </MemoryRouter>
  );
  expect(screen.getByText(/to view and edit your profile/i)).toBeInTheDocument();
});

test("loads the saved profile with units", async () => {
  renderSignedIn();
  expect(await screen.findByDisplayValue("John Doe")).toBeInTheDocument();
  // Decimal columns arrive as "180.00"; they're shown as plain numbers.
  expect(screen.getByLabelText("Height")).toHaveValue(180);
  expect(screen.getByLabelText("Weight")).toHaveValue(80);
  expect(screen.getByText("cm")).toBeInTheDocument();
  expect(screen.getByText("kg")).toBeInTheDocument();
  expect(screen.getByLabelText("Male")).toBeChecked();
});

test("works out BMI from height and weight", async () => {
  renderSignedIn();
  await screen.findByDisplayValue("John Doe");
  // 80 / 1.8² = 24.69
  expect(screen.getByText("24.7")).toBeInTheDocument();
  expect(screen.getByText("Healthy weight", { selector: ".bmi-category" })).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Weight"), { target: { value: "100" } });
  // 100 / 1.8² = 30.86
  expect(screen.getByText("30.9")).toBeInTheDocument();
  expect(screen.getByText("Obese", { selector: ".bmi-category" })).toBeInTheDocument();
});

test("flags an out-of-range height and doesn't save", async () => {
  renderSignedIn();
  await screen.findByDisplayValue("John Doe");
  fireEvent.change(screen.getByLabelText("Height"), { target: { value: "1800" } });
  expect(screen.getByText("Enter a value between 100 and 250 cm.")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  expect(await screen.findByText(/fix the highlighted fields/i)).toBeInTheDocument();
  expect(mockApi.post).not.toHaveBeenCalled();
});

test("saves numbers and the calculated BMI", async () => {
  renderSignedIn();
  await screen.findByDisplayValue("John Doe");
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

  expect(await screen.findByText("Changes saved")).toBeInTheDocument();
  expect(mockApi.post).toHaveBeenCalledWith(
    "/api/user/update",
    expect.objectContaining({ name: "Jane Doe", height: 180, weight: 80, bmi: 24.7 })
  );
});

test("shows an error when the profile can't be loaded", async () => {
  mockApi.get.mockReset().mockRejectedValue(new Error("Network down"));
  renderSignedIn();
  expect(await screen.findByText("Network error")).toBeInTheDocument();
});
