import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserInfoPage from "./UserInfoPage";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponseOnce(
    JSON.stringify({
      name: "John Doe",
      email: "john@example.com",
      birthday: "1990-01-01",
      gender: "male",
      height: "180",
      weight: "80",
      bmi: "24.7",
      activityLevel: "moderately_active",
    })
  );
});

test("fetches user info and displays it", async () => {
  render(
    <MemoryRouter>
      <UserInfoPage />
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
  );
  await waitFor(() =>
    expect(screen.queryByText("Error:")).not.toBeInTheDocument()
  );

  expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
});

test("updates input values on change", async () => {
  render(
    <MemoryRouter>
      <UserInfoPage />
    </MemoryRouter>
  );

  const nameInput = await screen.findByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
  expect(nameInput.value).toBe("Jane Doe");
});

test("validates and submits the form correctly", async () => {
  render(
    <MemoryRouter>
      <UserInfoPage />
    </MemoryRouter>
  );

  // Trigger validation error
  const emailInput = await screen.findByLabelText(/email/i);
  fireEvent.change(emailInput, { target: { value: "wrongemail" } });
  const saveButton = screen.getByRole("button", { name: /save changes/i });
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(
      screen.getByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
  });

  // Correct email and submit
  fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).toBeNull();
  });
});

test("displays loading and error messages", async () => {
  fetch.resetMocks();
  fetch.mockReject(new Error("Failed to fetch"));

  render(
    <MemoryRouter>
      <UserInfoPage />
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });
});
