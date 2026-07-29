import apiErrorMessage from "./apiErrorMessage";

describe("apiErrorMessage", () => {
  it("prefers the first field-level validation message when details are present", () => {
    const err = {
      response: {
        data: {
          error: {
            message: "Validation failed",
            details: { email: ["Email is already taken"] },
          },
        },
      },
    };
    expect(apiErrorMessage(err)).toBe("Email is already taken");
  });

  it("falls back to error.message when there are no field details", () => {
    const err = { response: { data: { error: { message: "Invalid credentials" } } } };
    expect(apiErrorMessage(err)).toBe("Invalid credentials");
  });

  it("falls back to a top-level message when there is no error object", () => {
    const err = { response: { data: { message: "Server is temporarily unavailable" } } };
    expect(apiErrorMessage(err)).toBe("Server is temporarily unavailable");
  });

  it("falls back to err.message when the response has no usable payload", () => {
    const err = { message: "Network Error" };
    expect(apiErrorMessage(err)).toBe("Network Error");
  });

  it("returns the generic fallback for a value with no usable message anywhere", () => {
    expect(apiErrorMessage({})).toBe("Something went wrong");
  });

  it("returns the generic fallback for non-object input (string, null, undefined)", () => {
    expect(apiErrorMessage("just a string")).toBe("Something went wrong");
    expect(apiErrorMessage(null)).toBe("Something went wrong");
    expect(apiErrorMessage(undefined)).toBe("Something went wrong");
  });

  it("ignores a blank/whitespace-only message and falls through to the generic fallback", () => {
    const err = { response: { data: { error: { message: "   " } } }, message: "   " };
    expect(apiErrorMessage(err)).toBe("Something went wrong");
  });

  it("handles a details value that is a plain string rather than an array", () => {
    const err = { response: { data: { error: { details: { coupon: "Coupon has expired" } } } } };
    expect(apiErrorMessage(err)).toBe("Coupon has expired");
  });
});
