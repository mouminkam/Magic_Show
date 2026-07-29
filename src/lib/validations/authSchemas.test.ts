import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../authSchemas";

describe("authSchemas", () => {
  describe("loginSchema", () => {
    it("accepts valid login data", () => {
      const result = loginSchema.safeParse({
        identifier: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("accepts a valid phone identifier", () => {
      const result = loginSchema.safeParse({
        identifier: "+15551234567",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid identifier", () => {
      const result = loginSchema.safeParse({
        identifier: "invalid",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        identifier: "test@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("accepts valid register data", () => {
      const result = registerSchema.safeParse({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+15551234567",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = registerSchema.safeParse({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+15551234567",
        password: "password123",
        confirmPassword: "different",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("accepts valid email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "user@example.com",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("resetPasswordSchema", () => {
    it("accepts valid reset data", () => {
      const result = resetPasswordSchema.safeParse({
        password: "newpassword123",
        confirmPassword: "newpassword123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = resetPasswordSchema.safeParse({
        password: "newpass123",
        confirmPassword: "different",
      });
      expect(result.success).toBe(false);
    });
  });
});
