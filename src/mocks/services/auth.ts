import type {
  ApiResponse,
  AuthSession,
  Customer,
  LoginCredentials,
  RegisterPayload,
  UpdateProfilePayload,
} from "@/types";
import { DEMO_CREDENTIALS } from "../data/account";
import { mockDb } from "../store";
import { fail, respond } from "../runtime";

/**
 * Simulated authentication against the single demo account.
 *
 * No network, no real credential handling: `login` compares against
 * `DEMO_CREDENTIALS` and mints an opaque token so the Zustand auth store,
 * the `auth-token` cookie and the route middleware all keep working unchanged.
 */

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function mintToken(customerId: number): string {
  const nonce = Math.random().toString(36).slice(2, 10);
  return `mock.${customerId}.${Date.now().toString(36)}.${nonce}`;
}

function session(customer: Customer): AuthSession {
  return {
    customer,
    accessToken: mintToken(customer.id),
    tokenType: "Bearer",
    expiresIn: TOKEN_TTL_SECONDS,
  };
}

/** Accepts either the demo email or the demo phone number as the identifier. */
function identifierMatches(identifier: string): boolean {
  const value = identifier.trim().toLowerCase();
  return (
    value === DEMO_CREDENTIALS.email.toLowerCase() ||
    value === DEMO_CREDENTIALS.phone.toLowerCase()
  );
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
    if (!identifierMatches(credentials.identifier) || credentials.password !== DEMO_CREDENTIALS.password) {
      return fail(
        "Those credentials do not match our records.",
        401,
        "INVALID_CREDENTIALS"
      );
    }
    return respond(session(mockDb.getCustomer()));
  },

  /**
   * Registration always succeeds and returns a session for a customer built
   * from the submitted details. Nothing is persisted server-side, which is why
   * the register page still sends the user to `/login` afterwards.
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthSession>> {
    if (payload.password !== payload.passwordConfirmation) {
      return fail("The password confirmation does not match.", 422, "VALIDATION_FAILED", {
        password_confirmation: ["The password confirmation does not match."],
      });
    }

    const now = new Date().toISOString();
    const customer: Customer = {
      id: 2,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      phone: payload.phone,
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
      preferredLanguage: "en",
      preferredCurrency: "USD",
      addresses: [],
      avatar: null,
      createdAt: now,
      updatedAt: now,
    };

    return respond(session(customer));
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return respond({ message: "Signed out." });
  },

  async getCurrentUser(): Promise<ApiResponse<Customer>> {
    return respond(mockDb.getCustomer());
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<Customer>> {
    const current = mockDb.getCustomer();
    const updated: Customer = {
      ...current,
      firstName: payload.firstName.trim() || current.firstName,
      lastName: payload.lastName.trim() || current.lastName,
      fullName: `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim(),
      phone: payload.phone.trim() || current.phone,
      updatedAt: new Date().toISOString(),
    };
    mockDb.setCustomer(updated);
    return respond(updated);
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    // Always reports success so the response cannot be used to enumerate
    // registered addresses — the same behaviour as the real endpoint.
    void email;
    return respond({
      message: "If that address is registered, a reset link is on its way.",
    });
  },

  async resetPassword(input: {
    token: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<ApiResponse<{ message: string }>> {
    if (!input.token || !input.email) {
      return fail("This reset link is invalid or has expired.", 400, "INVALID_RESET_TOKEN");
    }
    if (input.password !== input.passwordConfirmation) {
      return fail("The password confirmation does not match.", 422, "VALIDATION_FAILED");
    }
    return respond({ message: "Your password has been reset." });
  },
};

export { DEMO_CREDENTIALS };
