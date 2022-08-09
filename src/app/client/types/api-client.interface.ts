export interface ApiClient {
  create(data: unknown): Promise<unknown>
  check(data: unknown): Promise<unknown>
  fetch(data: unknown): Promise<unknown>
}
