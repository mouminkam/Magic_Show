export type ApiErrorDetails = Record<string, unknown>;

export interface ApiErrorPayload {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    details?: ApiErrorDetails;
  };
  message?: string;
}

export interface AxiosLikeError {
  response?: {
    data?: unknown;
    status?: number;
  };
  message?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export default function apiErrorMessage(err: unknown): string {
  if (!isRecord(err)) return "Something went wrong";

  const response = err.response;
  const data = isRecord(response) ? response.data : undefined;

  const payload: ApiErrorPayload | undefined = isRecord(data) ? (data as ApiErrorPayload) : undefined;

  const details = payload?.error?.details;
  if (details && isRecord(details)) {
    const firstKey = Object.keys(details)[0];
    const val = details[firstKey];
    if (Array.isArray(val) && typeof val[0] === "string") return val[0];
    if (typeof val === "string") return val;
  }

  const apiErrMsg = payload?.error?.message;
  if (typeof apiErrMsg === "string" && apiErrMsg.trim()) return apiErrMsg;

  const apiMsg = payload?.message;
  if (typeof apiMsg === "string" && apiMsg.trim()) return apiMsg;

  if (typeof err.message === "string" && err.message.trim()) return err.message;

  return "Something went wrong";
}
