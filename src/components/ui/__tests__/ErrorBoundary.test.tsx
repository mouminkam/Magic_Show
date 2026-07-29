import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../ErrorBoundary";

const ThrowError = (): never => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders fallback when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    // Error message is always shown
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("shows reset button when error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    // Supports both Arabic (حاول مرة أخرى) and English (Try Again)
    const button = screen.getByRole("button", { name: /حاول مرة أخرى|Try Again/i });
    expect(button).toBeInTheDocument();
  });
});
