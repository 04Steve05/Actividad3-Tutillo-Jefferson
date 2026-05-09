import { ref } from 'vue'

export function useFetch<T>() {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute(url: string, options?: RequestInit): Promise<T | null> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || `HTTP ${res.status}`)
      }
      const json: T = await res.json()
      data.value = json
      return json
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      return null
    } finally {
      loading.value = false
    }
  }

  async function retry(url: string, options?: RequestInit) {
    return execute(url, options)
  }

  return { data, loading, error, execute, retry }
}
