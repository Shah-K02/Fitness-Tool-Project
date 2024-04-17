import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("axios", () => ({
  post: jest.fn(),
}));

describe("LoginPage", () => {
  const setup = () =>
    render(
      <Router>
        <LoginPage />
      </Router>
    );

  test("renders login and signup forms", () => {
    setup();
    expect(screen.getByTestId("signup-email")).toBeInTheDocument();
    expect(screen.getByTestId("signup-password")).toBeInTheDocument();
    expect(screen.getByTestId("signup-confirm-password")).toBeInTheDocument();
    expect(screen.getByTestId("signin-email")).toBeInTheDocument();
    expect(screen.getByTestId("signin-password")).toBeInTheDocument();
  });

  test("allows users to switch between login and signup forms", () => {
    setup();
    fireEvent.click(screen.getByTestId("button-signup"));
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-signin"));
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("input change updates state for sign up", () => {
    setup();
    const signUpEmailInput = screen.getByTestId("signup-email");
    fireEvent.change(signUpEmailInput, {
      target: { value: "user@example.com" },
    });
    expect(signUpEmailInput.value).toBe("user@example.com");
  });

  test("input change updates state for sign in", () => {
    setup();
    const signInEmailInput = screen.getByTestId("signin-email");
    fireEvent.change(signInEmailInput, {
      target: { value: "user@example.com" },
    });
    expect(signInEmailInput.value).toBe("user@example.com");
  });

  test("displays error when passwords do not match during signup", async () => {
    setup();
    fireEvent.change(screen.getByTestId("signup-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByTestId("signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("signup-confirm-password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByTestId("signup-submit")); // Using data-testid for specificity
    expect(
      await screen.findByText("Passwords do not match.")
    ).toBeInTheDocument();
  });

  test("successful signup navigates to user home and stores token", async () => {
    axios.post.mockResolvedValue({ data: { token: "12345" } });
    Object.defineProperty(window, "localStorage", {
      value: {
        setItem: jest.fn(),
      },
    });
    setup();
    fireEvent.change(screen.getByTestId("signup-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByTestId("signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("signup-confirm-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("signup-submit")); // Using data-testid for specificity
    await waitFor(() =>
      expect(window.localStorage.setItem).toHaveBeenCalledWith("token", "12345")
    );
  });

  test("failed login shows error message", async () => {
    const errorMessage =
      "Failed to log in. Please check your credentials and try again.";
    axios.post.mockRejectedValue(new Error(errorMessage));
    setup();
    fireEvent.change(screen.getByTestId("signin-email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByTestId("signin-password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByTestId("signin-submit")); // Using data-testid for specificity
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
