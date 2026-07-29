import type { CurrencyCode, EntityId, IsoDateString, Locale } from "./common";
import type { Address } from "./commerce";

/**
 * A storefront shopper. Mirrors `App\Http\Resources\CustomerResource`, which is
 * what the auth endpoints return as `customer`.
 */
export interface Customer {
  id: EntityId;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferredLanguage: Locale;
  preferredCurrency: CurrencyCode;
  addresses: Address[];
  avatar: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

/**
 * The authenticated principal held in the auth store. It is the customer
 * record; the alias exists because components and the store speak in terms of
 * "user" while the API speaks in terms of "customer".
 */
export type User = Customer;

/** Successful login/register result. */
export interface AuthSession {
  customer: Customer;
  accessToken: string;
  tokenType: "Bearer";
  /** Seconds until the token expires. */
  expiresIn: number;
}

export interface LoginCredentials {
  /** Email address or E.164 phone number. */
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface NewsletterSubscriber {
  id: EntityId;
  email: string;
  subscribedAt: IsoDateString;
  unsubscribedAt: IsoDateString | null;
}

export type ContactMessageStatus = "new" | "read" | "replied";

export interface ContactMessage {
  id: EntityId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: IsoDateString;
}

/** Payload accepted by `contact.sendMessage()`. */
export type ContactMessageInput = Pick<
  ContactMessage,
  "firstName" | "lastName" | "email" | "phone" | "subject" | "message"
>;
