export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = {};
  const token = localStorage.getItem("jwt");
  const isRegister = url.endsWith("/user") && options?.method === "POST";
  if (token && !isRegister) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (options?.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${msg}`.trim());
  }
  return res.json();
}
