const RAILS_URL = process.env.NEXT_PUBLIC_RAILS_API_URL || "http://localhost:3001"

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${RAILS_URL}/api/v1${path}`, {
    credentials: "include",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  })

  if (res.status === 401) {
    window.location.href = "/"
    throw new ApiError(401, "Unauthorized")
  }

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new ApiError(
      res.status,
      data.error || data.errors?.join(", ") || "エラーが発生しました"
    )
  }

  return res.json()
}

export const api = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: "DELETE" }),
}
