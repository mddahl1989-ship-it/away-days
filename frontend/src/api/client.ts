const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5100'

// Fehler aus der API. fieldErrors kommt aus den ProblemDetails ("errors"),
// mit Schlüsseln in camelCase, passend zu den Formularfeldern (z. B. "opponent").
export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string[]>

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// "Expenses[0].Description" -> "expenses[0].description"
function toCamelKey(key: string): string {
  return key
    .split('.')
    .map((part) => part.charAt(0).toLowerCase() + part.slice(1))
    .join('.')
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new ApiError(0, 'Die API ist nicht erreichbar. Läuft das Backend auf Port 5100?')
  }

  if (!response.ok) {
    let message = `Fehler ${response.status}`
    const fieldErrors: Record<string, string[]> = {}

    try {
      const problem = await response.json()
      message = problem.detail ?? problem.title ?? message
      for (const [key, value] of Object.entries(problem.errors ?? {})) {
        fieldErrors[toCamelKey(key)] = value as string[]
      }
      if (Object.keys(fieldErrors).length > 0) {
        message = 'Bitte prüfe die markierten Felder.'
      }
    } catch {
      // Antwort ohne JSON-Body, dann bleibt die allgemeine Meldung.
    }

    throw new ApiError(response.status, message, fieldErrors)
  }

  // 204 No Content hat keinen Body.
  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
