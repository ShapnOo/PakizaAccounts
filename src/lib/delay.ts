/**
 * Helper to simulate network latency in frontend-only mock services
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
