import type { Result } from "@acervo/schemas";

type FetchOptions = {
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
};

export type ApiGetOptions = FetchOptions & {
  retry?: number;
};

export type ApiPostOptions = FetchOptions;

function buildUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function buildErrorResult<T>(code: number, message: string, rawError: unknown): Result<T> {
  const errorMessage = rawError instanceof Error ? rawError.message : String(rawError);
  console.error(`[api-client] ${message}`, { code, error: errorMessage });
  return {
    success: false,
    code,
    message,
    error: { errors: [errorMessage || message] },
  } as Result<T>;
}

async function request<T>(path: string, init?: RequestInit): Promise<Result<T>> {
  try {
    const url = buildUrl(path);
    const response = await fetch(url, init);

    if (!response.ok) {
      let message = response.statusText || "Request failed";
      try {
        const body = await response.json();
        if (body && typeof body.message === "string") {
          message = body.message;
        }
      } catch {
        // ignore parse errors and keep statusText/message
      }
      return buildErrorResult(response.status, message, new Error(message));
    }

    const data = (await response.json()) as Result<T>;
    return data;
  } catch (error) {
    return buildErrorResult(500, "Network or unexpected request error", error);
  }
}

export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<Result<T>> {
  const { retry = 0, ...fetchOptions } = options;
  const init: RequestInit = {
    method: "GET",
    ...fetchOptions,
  };

  let lastError: Result<T> | null = null;
  const attempts = Math.max(0, retry) + 1;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const result = await request<T>(path, init);
    if (result.success) {
      return result;
    }

    lastError = result;

    const isNetworkError = result.code === 500;
    const shouldRetry = isNetworkError && attempt < attempts;
    if (shouldRetry) {
      console.error(
        `[api-client] GET ${path} failed (attempt ${attempt}/${attempts}), retrying...`,
      );
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      continue;
    }

    return result;
  }

  return (
    lastError ?? buildErrorResult(500, "Request failed after retries", new Error("Unknown error"))
  );
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  options: ApiPostOptions = {},
): Promise<Result<T>> {
  const init: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  };

  return request<T>(path, init);
}
